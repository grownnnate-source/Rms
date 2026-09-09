import { useState, useEffect } from "react";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_EXPENSES,
  DAILY_SALES,
  MONTHLY_SALES,
  YEARLY_SALES,
  STAFF_MEMBERS
} from "./data/mockData";
import { HeaderNav } from "./components/HeaderNav";
import { ServerView } from "./components/server/ServerView";
import { CashierView } from "./components/cashier/CashierView";
import { ManagerView } from "./components/manager/ManagerView";
export default function App() {
  const [currentRole, setCurrentRole] = useState("server");
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("campus_scoop_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("campus_scoop_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("campus_scoop_expenses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EXPENSES;
      }
    }
    return INITIAL_EXPENSES;
  });
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem("campus_scoop_staff");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return STAFF_MEMBERS;
      }
    }
    return STAFF_MEMBERS;
  });
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const [nextOrderNumber, setNextOrderNumber] = useState(105);
  useEffect(() => {
    localStorage.setItem("campus_scoop_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("campus_scoop_orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem("campus_scoop_expenses", JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem("campus_scoop_staff", JSON.stringify(staff));
  }, [staff]);
  const handleAddToCart = (item) => {
    setCurrentOrderItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.scoops === item.scoops && i.serving === item.serving && JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + item.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          totalItemPrice: current.unitPrice * newQty
        };
        return updated;
      }
      return [...prev, item];
    });
  };
  const handleUpdateCartItemQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCurrentOrderItems(
      (prev) => prev.map(
        (item) => item.id === itemId ? {
          ...item,
          quantity: newQty,
          totalItemPrice: item.unitPrice * newQty
        } : item
      )
    );
  };
  const handleRemoveCartItem = (itemId) => {
    setCurrentOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };
  const handleClearCart = () => {
    setCurrentOrderItems([]);
  };
  const handleSubmitOrder = (customerNote) => {
    if (currentOrderItems.length === 0) return null;
    const subtotal = currentOrderItems.reduce((sum, i) => sum + i.totalItemPrice, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const now = /* @__PURE__ */ new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newOrder = {
      id: `ord-${nextOrderNumber}`,
      orderNumber: nextOrderNumber,
      createdAt: `Just now (${timeStr})`,
      serverName: "Bethlehem T.",
      cashierName: "Dawit K.",
      items: [...currentOrderItems],
      subtotal,
      tax,
      total,
      status: "PENDING",
      paymentMethod: "CHAPA_QR",
      chapaTxRef: `chapa-tx-${nextOrderNumber}-${Math.floor(1e3 + Math.random() * 9e3)}`,
      customerNote: customerNote || void 0
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderItems([]);
    setNextOrderNumber((prev) => prev + 1);
    return newOrder;
  };
  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders(
      (prev) => prev.map((ord) => {
        if (ord.id === orderId) {
          const now = /* @__PURE__ */ new Date();
          const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return {
            ...ord,
            status,
            paidAt: status === "PAID" ? timeStr : ord.paidAt
          };
        }
        return ord;
      })
    );
  };
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };
  const handleUpdateProduct = (updatedProduct) => {
    setProducts(
      (prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };
  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product from the menu?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };
  const handleToggleProductAvailability = (productId) => {
    setProducts(
      (prev) => prev.map((p) => p.id === productId ? { ...p, available: !p.available } : p)
    );
  };
  const handleAddExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };
  const handleDeleteExpense = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };
  const handleUpdateStaffPin = (staffId, newPin) => {
    setStaff(
      (prev) => prev.map((s) => s.id === staffId ? { ...s, pin: newPin } : s)
    );
  };
  const handleResetData = () => {
    if (confirm("Reset all catalog, orders, and expenses to initial state?")) {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setExpenses(INITIAL_EXPENSES);
      setStaff(STAFF_MEMBERS);
      setCurrentOrderItems([]);
      setNextOrderNumber(105);
      localStorage.clear();
    }
  };
  const handleAddSampleOrder = () => {
    const sampleFlavors = [
      { name: "Belgian Dark Chocolate", price: 110, category: "ice_cream" },
      { name: "Wild Strawberry Swirl", price: 115, category: "ice_cream" },
      { name: "Madagascar Vanilla Bean", price: 95, category: "ice_cream" },
      { name: "Cold Brew Affogato", price: 140, category: "drinks" }
    ];
    const picked = sampleFlavors[Math.floor(Math.random() * sampleFlavors.length)];
    const orderNum = nextOrderNumber;
    const sampleItem = {
      id: `item-${Date.now()}`,
      productId: `prod-sample-${Date.now()}`,
      name: picked.name,
      category: picked.category,
      scoops: picked.category === "ice_cream" ? 2 : 0,
      serving: "Cone",
      toppings: ["Crushed Oreo Crumble"],
      unitPrice: picked.price + 35,
      quantity: 2,
      totalItemPrice: (picked.price + 35) * 2
    };
    const subtotal = sampleItem.totalItemPrice;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const newOrder = {
      id: `ord-${orderNum}`,
      orderNumber: orderNum,
      createdAt: "Just now",
      serverName: "Abebe M.",
      cashierName: "Dawit K.",
      items: [sampleItem],
      subtotal,
      tax,
      total,
      status: "PENDING",
      paymentMethod: "CHAPA_QR",
      chapaTxRef: `chapa-tx-${orderNum}-${Math.floor(1e3 + Math.random() * 9e3)}`,
      customerNote: "Customer waiting at counter"
    };
    setOrders((prev) => [newOrder, ...prev]);
    setNextOrderNumber((prev) => prev + 1);
  };
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const activeStaffName = currentRole === "server" ? "Bethlehem T. (Server)" : currentRole === "cashier" ? "Dawit K. (Cashier)" : "Prof. Selamawit H. (Manager)";
  return <div className="min-h-screen bg-[#FFF9F2] text-[#292524] flex flex-col selection:bg-[#F58FA3]/30">
      
      {
    /* Top Header & Role Switcher */
  }
      <HeaderNav
    currentRole={currentRole}
    onSelectRole={setCurrentRole}
    pendingOrdersCount={pendingOrdersCount}
    onResetData={handleResetData}
    onAddSampleOrder={handleAddSampleOrder}
    activeStaffName={activeStaffName}
  />

      {
    /* Main View Area (Conditioned on Selected Role) */
  }
      <main className="flex-1">
        {currentRole === "server" && <ServerView
    products={products}
    currentOrderItems={currentOrderItems}
    onAddToCart={handleAddToCart}
    onUpdateCartItemQty={handleUpdateCartItemQty}
    onRemoveCartItem={handleRemoveCartItem}
    onClearCart={handleClearCart}
    onSubmitOrder={handleSubmitOrder}
    recentOrders={orders}
    nextOrderNumber={nextOrderNumber}
  />}

        {currentRole === "cashier" && <CashierView
    orders={orders}
    onUpdateOrderStatus={handleUpdateOrderStatus}
  />}

        {currentRole === "manager" && <ManagerView
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
  />}
      </main>

    </div>;
}
