import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import {
  loginWithPin,
  fetchProducts as apiFetchProducts,
  createProduct as apiCreateProduct,
  toggleProductAvailability as apiToggleProductAvailability,
  createOrder as apiCreateOrder,
  fetchOrders as apiFetchOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  fetchExpenses as apiFetchExpenses,
  createExpense as apiCreateExpense,
  deleteExpense as apiDeleteExpense,
  socket
} from "./lib/axios";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_EXPENSES,
  DAILY_SALES,
  MONTHLY_SALES,
  YEARLY_SALES,
  STAFF_MEMBERS
} from "./lib/mockData";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { CashierPage } from "./pages/CashierPage";
import { ManagerPage } from "./pages/ManagerPage";

function getIconForProduct(name = "", category = "") {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
  if (n.includes("chocolate") || n.includes("chip") || n.includes("oreo")) return "Cookie";
  if (n.includes("vanilla") || n.includes("caramel")) return "IceCream";
  if (n.includes("strawberry") || n.includes("berry")) return "Sparkles";
  if (n.includes("mango") || n.includes("passion")) return "Sun";
  if (n.includes("mint") || n.includes("matcha")) return "Leaf";
  if (n.includes("coffee") || n.includes("mocha")) return "Coffee";
  if (c.includes("cone")) return "Cookie";
  if (c.includes("cup")) return "Package";
  if (c.includes("topping")) return "Sparkles";
  if (c.includes("drink")) return "GlassWater";
  return "IceCream";
}

function getColorAccentForProduct(name = "", category = "") {
  const n = name.toLowerCase();
  if (n.includes("chocolate") || n.includes("oreo") || n.includes("mocha")) return "#5A3E36";
  if (n.includes("vanilla")) return "#F6E05E";
  if (n.includes("strawberry")) return "#F58FA3";
  if (n.includes("mango") || n.includes("passion")) return "#EA580C";
  if (n.includes("mint")) return "#65A30D";
  if (n.includes("caramel")) return "#D97706";
  if (n.includes("sprinkles") || n.includes("m&m")) return "#E85D75";
  if (category.toLowerCase().includes("cone")) return "#D97706";
  if (category.toLowerCase().includes("cup")) return "#78716C";
  return "#5A3E36";
}

function normalizeProduct(p) {
  const cat = (p.category || "ice_cream").toLowerCase().replace(/\s+/g, "_");
  return {
    id: p._id || p.id,
    name: p.name,
    category: cat,
    description: p.description || "",
    price: Number(p.price) || 0,
    available: p.isAvailable !== undefined ? Boolean(p.isAvailable) : (p.available !== undefined ? Boolean(p.available) : true),
    iconName: p.iconName || getIconForProduct(p.name, cat),
    colorAccent: p.colorAccent || getColorAccentForProduct(p.name, cat),
    badge: p.badge || (Number(p.price) >= 270 ? "Bestseller" : ""),
    scoopsDefault: p.scoopsDefault || 1
  };
}

function normalizeOrder(o) {
  const numericOrderNum = typeof o.orderNumber === "string"
    ? parseInt(o.orderNumber.replace(/[^0-9]/g, ""), 10) || 101
    : (o.orderNumber || 101);

  const rawStatus = o.status || "PENDING";
  const status = rawStatus === "CREATED" || rawStatus === "PAYMENT_PENDING" ? "PENDING" : rawStatus;

  const items = (o.items || []).map((i) => ({
    id: i._id || i.id || `item-${Math.random().toString(36).substring(2, 6)}`,
    productId: i.product || i.productId,
    name: i.name,
    category: i.category || "ice_cream",
    scoops: i.options?.scoops || 1,
    serving: i.options?.containerType || "Cup",
    toppings: i.options?.toppings || [],
    unitPrice: Number(i.unitPrice) || 0,
    quantity: Number(i.quantity) || 1,
    totalItemPrice: Number(i.itemTotal) || ((Number(i.unitPrice) || 0) * (Number(i.quantity) || 1))
  }));

  const total = Number(o.totalAmount || o.total) || 0;
  const subtotal = o.subtotal ? Number(o.subtotal) : Math.round(total / 1.05);
  const tax = o.tax ? Number(o.tax) : total - subtotal;

  let createdAt = new Date().toISOString().replace("T", " ").slice(0, 16);
  if (o.createdAt) {
    try {
      createdAt = new Date(o.createdAt).toISOString().replace("T", " ").slice(0, 16);
    } catch {
      createdAt = String(o.createdAt);
    }
  }

  return {
    id: o._id || o.id,
    orderNumber: numericOrderNum,
    createdAt,
    serverName: o.attendant?.name || o.serverName || "Abebe Tadesse (Server)",
    cashierName: o.cashierName || "Sara Hailu (Cashier)",
    status,
    items,
    subtotal,
    tax,
    total,
    chapaTxRef: o.payment?.txRef || o.chapaTxRef || `RMS-${numericOrderNum}-${Date.now()}`,
    note: o.note || ""
  };
}

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [staff, setStaff] = useState(STAFF_MEMBERS);
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const location = useLocation();

  // Role Authentication Synchronization across routes
  useEffect(() => {
    async function syncRoleAuth() {
      const path = location.pathname;
      let targetPin = "1111";
      let targetRole = "attendant";

      if (path === "/cashier") {
        targetPin = "2222";
        targetRole = "cashier";
      } else if (path === "/manager") {
        targetPin = "9999";
        targetRole = "manager";
      }

      try {
        await loginWithPin(targetPin, targetRole);
        setIsLiveBackend(true);

        if (path === "/manager") {
          const liveExpenses = await apiFetchExpenses();
          if (Array.isArray(liveExpenses) && liveExpenses.length > 0) {
            setExpenses(liveExpenses);
          }
        }
      } catch (e) {
        console.warn(`Role auth sync for ${targetRole} fallback:`, e.message);
      }
    }

    syncRoleAuth();
  }, [location.pathname]);

  // Initialize Session, Connect to Live Backend & MongoDB Atlas
  useEffect(() => {
    let isSubscribed = true;

    async function initializeSystem() {
      // 1. Ensure valid JWT Token for backend requests
      let token = localStorage.getItem("rms_jwt_token");
      if (!token) {
        try {
          const auth = await loginWithPin("1111", "attendant");
          token = auth.token;
        } catch (authErr) {
          console.warn("Backend auth offline, using local fallback mode:", authErr.message);
        }
      }

      // 2. Fetch Live Products from MongoDB
      try {
        const liveProds = await apiFetchProducts();
        if (isSubscribed && Array.isArray(liveProds) && liveProds.length > 0) {
          setProducts(liveProds.map(normalizeProduct));
          setIsLiveBackend(true);
        }
      } catch (err) {
        console.warn("Live products fetch fallback:", err.message);
      }

      // 3. Fetch Live Orders from MongoDB
      try {
        const liveOrders = await apiFetchOrders();
        if (isSubscribed && Array.isArray(liveOrders) && liveOrders.length > 0) {
          setOrders(liveOrders.map(normalizeOrder));
        }
      } catch (err) {
        console.warn("Live orders fetch fallback:", err.message);
      }

      // 4. Fetch Live Expenses from MongoDB
      try {
        const liveExpenses = await apiFetchExpenses();
        if (isSubscribed && Array.isArray(liveExpenses) && liveExpenses.length > 0) {
          setExpenses(liveExpenses);
        }
      } catch (err) {
        console.warn("Live expenses fetch fallback:", err.message);
      }
    }

    initializeSystem();

    // Socket.IO Real-Time Listeners
    socket.on("order:created", (newBackendOrder) => {
      const normalized = normalizeOrder(newBackendOrder);
      setOrders((prev) => {
        if (prev.some((o) => o.id === normalized.id || o.orderNumber === normalized.orderNumber)) {
          return prev;
        }
        return [normalized, ...prev];
      });
    });

    socket.on("order:paid", ({ orderId }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "PAID", paidAt: new Date().toTimeString().slice(0, 5) }
            : o
        )
      );
    });

    socket.on("order:updated", (updatedBackendOrder) => {
      const normalized = normalizeOrder(updatedBackendOrder);
      setOrders((prev) =>
        prev.map((o) => (o.id === normalized.id ? normalized : o))
      );
    });

    return () => {
      isSubscribed = false;
      socket.off("order:created");
      socket.off("order:paid");
      socket.off("order:updated");
    };
  }, []);

  // Order Number Generator Sequence
  const nextOrderNumber =
    orders.length > 0
      ? Math.max(...orders.map((o) => o.orderNumber || 0)) + 1
      : 101;

  // Cart Management Handlers
  const handleAddToCart = (newItem) => {
    setCurrentOrderItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.serving === newItem.serving &&
          i.scoops === newItem.scoops &&
          JSON.stringify(i.toppings.slice().sort()) ===
            JSON.stringify(newItem.toppings.slice().sort())
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const item = updated[existingIdx];
        const newQty = item.quantity + newItem.quantity;
        const perUnitPrice = item.totalItemPrice / item.quantity;
        updated[existingIdx] = {
          ...item,
          quantity: newQty,
          totalItemPrice: perUnitPrice * newQty
        };
        return updated;
      }

      return [...prev, newItem];
    });
  };

  const handleUpdateCartItemQty = (index, delta) => {
    setCurrentOrderItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        return prev.filter((_, idx) => idx !== index);
      }

      const perUnitPrice = item.totalItemPrice / item.quantity;
      updated[index] = {
        ...item,
        quantity: newQty,
        totalItemPrice: perUnitPrice * newQty
      };
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCurrentOrderItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCurrentOrderItems([]);
  };

  // Submit Order from Server -> Backend + Cashier
  const handleSubmitOrder = async (note = "") => {
    if (currentOrderItems.length === 0) return null;

    // Format items for MongoDB Order Schema
    const firstValidMongoId = products.find((p) => /^[0-9a-fA-F]{24}$/.test(p.id))?.id;
    const formattedItems = currentOrderItems.map((item) => {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(item.productId);
      return {
        product: isMongoId ? item.productId : (firstValidMongoId || item.productId),
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        options: {
          scoops: item.scoops || 1,
          containerType: item.serving === "Cone" ? "Cone" : "Cup",
          toppings: item.toppings || []
        }
      };
    });

    try {
      const createdOrder = await apiCreateOrder(formattedItems);
      if (createdOrder) {
        const normalized = normalizeOrder(createdOrder);
        setOrders((prev) => [normalized, ...prev]);
        setCurrentOrderItems([]);
        return normalized;
      }
    } catch (err) {
      console.warn("Backend order creation fallback to local:", err.message);
    }

    // Local fallback if backend temporarily unreachable
    const subtotal = currentOrderItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;

    const fallbackOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNumber,
      createdAt: formattedDate,
      serverName: "Abebe Tadesse (Server)",
      cashierName: "Sara Hailu (Cashier)",
      status: "PENDING",
      items: [...currentOrderItems],
      subtotal,
      tax,
      total,
      chapaTxRef: `RMS-${nextOrderNumber}-${Date.now()}`,
      note: note.trim()
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    setCurrentOrderItems([]);
    return fallbackOrder;
  };

  // Cashier: Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
        await apiUpdateOrderStatus(orderId, newStatus === "PAID" ? "PAID" : newStatus);
      }
    } catch (e) {
      console.warn("Backend updateOrderStatus fallback:", e.message);
    }

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              paidAt: newStatus === "PAID" ? new Date().toTimeString().slice(0, 5) : ord.paidAt
            }
          : ord
      )
    );
  };

  // Manager: Product Catalog CRUD
  const handleAddProduct = async (newProdData) => {
    try {
      const created = await apiCreateProduct({
        name: newProdData.name,
        category: newProdData.category === "ice_cream" ? "Ice Cream" : newProdData.category,
        description: newProdData.description,
        price: newProdData.price,
        isAvailable: true
      });
      if (created) {
        setProducts((prev) => [normalizeProduct(created), ...prev]);
        return;
      }
    } catch (e) {
      console.warn("Backend createProduct fallback:", e.message);
    }
    setProducts((prev) => [newProdData, ...prev]);
  };

  const handleUpdateProduct = (updatedProd) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (prodId) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  const handleToggleProductAvailability = async (prodId) => {
    const prod = products.find((p) => p.id === prodId);
    const newStatus = !prod?.available;

    try {
      if (/^[0-9a-fA-F]{24}$/.test(prodId)) {
        await apiToggleProductAvailability(prodId, newStatus);
      }
    } catch (e) {
      console.warn("Backend toggleProductAvailability fallback:", e.message);
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, available: newStatus } : p))
    );
  };

  // Manager: Expenses
  const handleAddExpense = async (newExp) => {
    try {
      const created = await apiCreateExpense({
        title: newExp.title,
        category: newExp.category,
        amount: newExp.amount
      });
      if (created) {
        setExpenses((prev) => [created, ...prev]);
        return;
      }
    } catch (e) {
      console.warn("Backend createExpense fallback:", e.message);
    }
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleDeleteExpense = async (expId) => {
    try {
      if (/^[0-9a-fA-F]{24}$/.test(expId)) {
        await apiDeleteExpense(expId);
      }
    } catch (e) {
      console.warn("Backend deleteExpense fallback:", e.message);
    }
    setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== expId));
  };

  // Manager: Staff PIN
  const handleUpdateStaffPin = (staffId, newPin) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, pin: newPin } : s))
    );
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (
      window.confirm(
        "Reset all orders, products, and expenses back to initial demo seeds?"
      )
    ) {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setExpenses(INITIAL_EXPENSES);
      setStaff(STAFF_MEMBERS);
      setCurrentOrderItems([]);
    }
  };

  // Demo Helper: Add Sample Order
  const handleAddSampleOrder = () => {
    const sampleItems = [
      {
        id: `item-${Date.now()}`,
        productId: products[0]?.id || `prod-sample-${Date.now()}`,
        name: products[0]?.name || "Madagascar Vanilla Bean",
        category: "ice_cream",
        scoops: 2,
        serving: "Waffle Cone",
        toppings: ["Rainbow Sprinkles", "Hot Fudge"],
        unitPrice: products[0]?.price || 250,
        quantity: 1,
        totalItemPrice: (products[0]?.price || 250) + 70
      }
    ];

    const subtotal = (products[0]?.price || 250) + 70;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNumber,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      serverName: "Walk-in Counter",
      status: "PENDING",
      items: sampleItems,
      subtotal,
      tax,
      total,
      chapaTxRef: `RMS-${nextOrderNumber}-${Date.now()}`,
      note: "Sample Demo Order"
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;

  const getActiveStaffName = () => {
    if (location.pathname === "/cashier") {
      return isLiveBackend ? "Sara Hailu (Cashier • Live)" : "Sara Hailu (Cashier)";
    }
    if (location.pathname === "/manager") {
      return isLiveBackend ? "Dawit Bekele (Manager • Live)" : "Dawit Bekele (Manager)";
    }
    return isLiveBackend ? "Abebe Tadesse (Attendant • Live)" : "Abebe Tadesse (Server)";
  };

  const activeStaffName = getActiveStaffName();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#292524] font-sans antialiased selection:bg-[#E85D75] selection:text-white">
      {/* Top Navigation Bar matching Desktop/MERN STACK Navbar pattern */}
      <Navbar
        pendingOrdersCount={pendingOrdersCount}
        onResetData={handleResetData}
        onAddSampleOrder={handleAddSampleOrder}
        activeStaffName={activeStaffName}
      />

      {/* Main Routed Page Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                currentOrderItems={currentOrderItems}
                onAddToCart={handleAddToCart}
                onUpdateCartItemQty={handleUpdateCartItemQty}
                onRemoveCartItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onSubmitOrder={handleSubmitOrder}
                recentOrders={orders}
                nextOrderNumber={nextOrderNumber}
              />
            }
          />
          <Route
            path="/server"
            element={
              <HomePage
                products={products}
                currentOrderItems={currentOrderItems}
                onAddToCart={handleAddToCart}
                onUpdateCartItemQty={handleUpdateCartItemQty}
                onRemoveCartItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onSubmitOrder={handleSubmitOrder}
                recentOrders={orders}
                nextOrderNumber={nextOrderNumber}
              />
            }
          />
          <Route
            path="/cashier"
            element={
              <CashierPage
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            }
          />
          <Route
            path="/manager"
            element={
              <ManagerPage
                products={products}
                orders={orders}
                expenses={expenses}
                staff={staff}
                dailySales={DAILY_SALES}
                monthlySales={MONTHLY_SALES}
                yearlySales={YEARLY_SALES}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onToggleProductAvailability={handleToggleProductAvailability}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                onUpdateStaffPin={handleUpdateStaffPin}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
