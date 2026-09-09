import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
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

export default function App() {
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

  // Current In-Progress Order (Cart) for Server View
  const [currentOrderItems, setCurrentOrderItems] = useState([]);

  // Save state back to localStorage
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

  // Submit Order from Server -> Cashier
  const handleSubmitOrder = (note = "") => {
    if (currentOrderItems.length === 0) return null;

    const subtotal = currentOrderItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNumber,
      createdAt: formattedDate,
      serverName: "Abebe B. (Attendant)",
      cashierName: "Dawit K.",
      status: "PENDING",
      items: [...currentOrderItems],
      subtotal,
      tax,
      total,
      note: note.trim()
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderItems([]);
    return newOrder;
  };

  // Cashier: Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              paidAt:
                newStatus === "PAID"
                  ? new Date().toTimeString().slice(0, 5)
                  : ord.paidAt
            }
          : ord
      )
    );
  };

  // Manager: Product Catalog CRUD
  const handleAddProduct = (newProdData) => {
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

  const handleToggleProductAvailability = (prodId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, available: !p.available } : p))
    );
  };

  // Manager: Expenses
  const handleAddExpense = (newExp) => {
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleDeleteExpense = (expId) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expId));
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
      localStorage.removeItem("campus_scoop_products");
      localStorage.removeItem("campus_scoop_orders");
      localStorage.removeItem("campus_scoop_expenses");
      localStorage.removeItem("campus_scoop_staff");
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
        productId: `prod-sample-${Date.now()}`,
        name: "Madagascar Vanilla Bean",
        category: "ice_cream",
        scoops: 2,
        serving: "Waffle Cone",
        toppings: ["Rainbow Sprinkles", "Hot Fudge"],
        unitPrice: 95,
        quantity: 1,
        totalItemPrice: 165
      }
    ];

    const subtotal = 165;
    const tax = 8;
    const total = 173;

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
      note: "Sample Demo Order"
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const activeStaffName = "Abebe B. (Server)";

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
