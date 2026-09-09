import { useState, useEffect, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router";
import { IceCream } from "lucide-react";
import * as api from "./lib/axios";
import { socket } from "./lib/axios";
import { normalizeProduct, normalizeOrder, upsertOrder, computeChartData, addToCart, updateCartQty, formatOrderItems, createFallbackOrder } from "./lib/dataUtils";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { CashierPage } from "./pages/CashierPage";
import { ManagerPage } from "./pages/ManagerPage";
import { LoginPage } from "./pages/LoginPage";

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const t = localStorage.getItem("rms_jwt_token"), u = localStorage.getItem("rms_user");
      return t && u ? JSON.parse(u) : null;
    } catch { return null; }
  });

  const [isAuthChecking, setIsAuthChecking] = useState(() => Boolean(localStorage.getItem("rms_jwt_token")) && !localStorage.getItem("rms_user"));

  const handleLogout = () => {
    localStorage.removeItem("rms_jwt_token");
    localStorage.removeItem("rms_user");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let active = true;
    async function init() {
      if (!localStorage.getItem("rms_jwt_token")) {
        if (active) { setCurrentUser(null); setIsAuthChecking(false); }
        return;
      }
      try {
        const auth = await api.fetchCurrentStaff();
        if (active && auth?.user) { setCurrentUser(auth.user); localStorage.setItem("rms_user", JSON.stringify(auth.user)); }
      } catch (err) {
        if (err.response?.status === 401) { handleLogout(); return; }
      } finally {
        if (active) setIsAuthChecking(false);
      }

      try {
        const [prods, ords] = await Promise.all([api.fetchProducts(), api.fetchOrders()]);
        if (active) {
          if (Array.isArray(prods)) setProducts(prods.map(normalizeProduct));
          if (Array.isArray(ords)) setOrders(ords.map(normalizeOrder));
        }
      } catch (e) { console.warn("Init fetch error:", e.message); }
    }

    init();
    socket.on("order:created", (o) => setOrders((prev) => upsertOrder(prev, o)));
    socket.on("order:paid", ({ orderId }) => setOrders((prev) => prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status: "PAID", paidAt: new Date().toTimeString().slice(0, 5) } : o))));
    socket.on("order:updated", (o) => setOrders((prev) => upsertOrder(prev, o)));

    return () => {
      active = false;
      socket.off("order:created");
      socket.off("order:paid");
      socket.off("order:updated");
    };
  }, [navigate]);

  useEffect(() => {
    if (currentUser?.role === "manager") {
      api.fetchStaff().then((d) => Array.isArray(d) && setStaff(d)).catch(() => {});
      api.fetchExpenses().then((d) => Array.isArray(d) && setExpenses(d)).catch(() => {});
    }
  }, [currentUser?.role]);

  const nextOrderNumber = orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber || 0)) + 1 : 101;

  const handleAddToCart = (item) => setCurrentOrderItems((prev) => addToCart(prev, item));
  const handleUpdateCartItemQty = (idx, delta) => setCurrentOrderItems((prev) => updateCartQty(prev, idx, delta));
  const handleRemoveCartItem = (idx) => setCurrentOrderItems((prev) => prev.filter((_, i) => i !== idx));
  const handleClearCart = () => setCurrentOrderItems([]);

  const handleSubmitOrder = async (note = "") => {
    if (currentOrderItems.length === 0) return null;
    let newOrder;
    try {
      const items = formatOrderItems(currentOrderItems, products);
      const created = await api.createOrder(items, note);
      if (created) newOrder = normalizeOrder(created);
    } catch (e) { console.warn("Order err:", e.message); }
    if (!newOrder) newOrder = createFallbackOrder(currentOrderItems, nextOrderNumber, currentUser?.name, note);
    setOrders((prev) => upsertOrder(prev, newOrder));
    setCurrentOrderItems([]);
    return newOrder;
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) api.updateOrderStatus(orderId, newStatus).catch(console.warn);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, paidAt: newStatus === "PAID" ? new Date().toTimeString().slice(0, 5) : o.paidAt } : o)));
  };

  const handleAddProduct = async (p) => {
    const c = await api.createProduct({ ...p, category: p.category === "ice_cream" ? "Ice Cream" : p.category, isAvailable: true }).catch(console.warn);
    setProducts((prev) => [c ? normalizeProduct(c) : p, ...prev]);
  };
  const handleUpdateProduct = (u) => setProducts((prev) => prev.map((p) => (p.id === u.id ? u : p)));
  const handleDeleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleToggleProductAvailability = (id) => {
    const next = !products.find((p) => p.id === id)?.available;
    if (/^[0-9a-fA-F]{24}$/.test(id)) api.toggleProductAvailability(id, next).catch(console.warn);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: next } : p)));
  };

  const handleAddExpense = async (e) => {
    const c = await api.createExpense(e).catch(console.warn);
    setExpenses((prev) => [c || e, ...prev]);
  };
  const handleDeleteExpense = (id) => {
    if (/^[0-9a-fA-F]{24}$/.test(id)) api.deleteExpense(id).catch(console.warn);
    setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
  };

  const handleUpdateStaffPin = async (id, pin) => {
    try {
      await api.updateStaffPinApi(id, pin);
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, pin } : s)));
    } catch (e) { alert(e.response?.data?.message || "Failed to update PIN"); }
  };

  const paidOrders = useMemo(() => orders.filter((o) => o.status === "PAID"), [orders]);
  const dailySales = useMemo(() => computeChartData(paidOrders, "Daily"), [paidOrders]);
  const monthlySales = useMemo(() => computeChartData(paidOrders, "Monthly"), [paidOrders]);
  const yearlySales = useMemo(() => computeChartData(paidOrders, "Yearly"), [paidOrders]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F2] text-[#5A3E36]">
        <div className="w-14 h-14 rounded-2xl bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center shadow-md animate-pulse mb-3">
          <IceCream className="w-7 h-7 text-[#F58FA3]" />
        </div>
        <p className="font-bold text-sm tracking-wide text-[#5A3E36]">Campus Scoop POS</p>
        <p className="text-xs text-[#78716C] mt-1">Verifying staff terminal session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#292524] font-sans antialiased selection:bg-[#E85D75] selection:text-white">
      {currentUser && location.pathname !== "/login" && (
        <Navbar pendingOrdersCount={orders.filter((o) => o.status === "PENDING").length} activeStaffName={currentUser.name ? `${currentUser.name} (${currentUser.role})` : "Staff User"} currentUser={currentUser} onLogout={handleLogout} />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <LoginPage onLoginSuccess={setCurrentUser} />} />
          <Route path="/" element={<Navigate to={currentUser ? `/${currentUser.role}` : "/login"} replace />} />
          <Route path="/server" element={<Navigate to="/attendant" replace />} />
          <Route path="/attendant" element={<ProtectedRoute user={currentUser} allowedRoles={["attendant", "manager"]}><HomePage products={products} currentOrderItems={currentOrderItems} onAddToCart={handleAddToCart} onUpdateCartItemQty={handleUpdateCartItemQty} onRemoveCartItem={handleRemoveCartItem} onClearCart={handleClearCart} onSubmitOrder={handleSubmitOrder} recentOrders={orders} nextOrderNumber={nextOrderNumber} /></ProtectedRoute>} />
          <Route path="/cashier" element={<ProtectedRoute user={currentUser} allowedRoles={["cashier", "manager"]}><CashierPage orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute user={currentUser} allowedRoles={["manager"]}><ManagerPage products={products} orders={orders} expenses={expenses} staff={staff} dailySales={dailySales} monthlySales={monthlySales} yearlySales={yearlySales} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onToggleProductAvailability={handleToggleProductAvailability} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onUpdateStaffPin={handleUpdateStaffPin} /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={currentUser ? `/${currentUser.role}` : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
