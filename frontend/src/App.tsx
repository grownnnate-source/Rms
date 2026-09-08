import React, { useState, useEffect } from 'react';
import { 
  Role, 
  Product, 
  Order, 
  OrderItem, 
  Expense, 
  StaffMember, 
  PaymentStatus 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_EXPENSES, 
  DAILY_SALES, 
  MONTHLY_SALES, 
  YEARLY_SALES, 
  STAFF_MEMBERS 
} from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { ServerView } from './components/server/ServerView';
import { CashierView } from './components/cashier/CashierView';
import { ManagerView } from './components/manager/ManagerView';

export default function App() {
  // Role State
  const [currentRole, setCurrentRole] = useState<Role>('server');

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('campus_scoop_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('campus_scoop_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('campus_scoop_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EXPENSES;
  });

  // Staff State
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('campus_scoop_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return STAFF_MEMBERS;
  });

  // Current Server Cart State
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [nextOrderNumber, setNextOrderNumber] = useState<number>(105);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('campus_scoop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('campus_scoop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('campus_scoop_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('campus_scoop_staff', JSON.stringify(staff));
  }, [staff]);

  // Server Cart Handlers
  const handleAddToCart = (item: OrderItem) => {
    setCurrentOrderItems((prev) => {
      // Check if identical item already in cart
      const existingIdx = prev.findIndex(
        (i) => 
          i.productId === item.productId &&
          i.scoops === item.scoops &&
          i.serving === item.serving &&
          JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + item.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          totalItemPrice: current.unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartItemQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCurrentOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQty,
              totalItemPrice: item.unitPrice * newQty,
            }
          : item
      )
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCurrentOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCurrentOrderItems([]);
  };

  const handleSubmitOrder = (customerNote?: string): Order | null => {
    if (currentOrderItems.length === 0) return null;

    const subtotal = currentOrderItems.reduce((sum, i) => sum + i.totalItemPrice, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord-${nextOrderNumber}`,
      orderNumber: nextOrderNumber,
      createdAt: `Just now (${timeStr})`,
      serverName: 'Bethlehem T.',
      cashierName: 'Dawit K.',
      items: [...currentOrderItems],
      subtotal,
      tax,
      total,
      status: 'PENDING',
      paymentMethod: 'CHAPA_QR',
      chapaTxRef: `chapa-tx-${nextOrderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerNote: customerNote || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderItems([]);
    setNextOrderNumber((prev) => prev + 1);

    return newOrder;
  };

  // Cashier Order Status Update
  const handleUpdateOrderStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status,
            paidAt: status === 'PAID' ? timeStr : ord.paidAt,
          };
        }
        return ord;
      })
    );
  };

  // Manager Product Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product from the menu?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleToggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
  };

  // Manager Expense Handlers
  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  // Staff PIN Handler
  const handleUpdateStaffPin = (staffId: string, newPin: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, pin: newPin } : s))
    );
  };

  // Demo Helpers
  const handleResetData = () => {
    if (confirm('Reset all catalog, orders, and expenses to initial state?')) {
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
      { name: 'Belgian Dark Chocolate', price: 110, category: 'ice_cream' as const },
      { name: 'Wild Strawberry Swirl', price: 115, category: 'ice_cream' as const },
      { name: 'Madagascar Vanilla Bean', price: 95, category: 'ice_cream' as const },
      { name: 'Cold Brew Affogato', price: 140, category: 'drinks' as const },
    ];
    const picked = sampleFlavors[Math.floor(Math.random() * sampleFlavors.length)];
    const orderNum = nextOrderNumber;

    const sampleItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: `prod-sample-${Date.now()}`,
      name: picked.name,
      category: picked.category,
      scoops: picked.category === 'ice_cream' ? 2 : 0,
      serving: 'Cone',
      toppings: ['Crushed Oreo Crumble'],
      unitPrice: picked.price + 35,
      quantity: 2,
      totalItemPrice: (picked.price + 35) * 2,
    };

    const subtotal = sampleItem.totalItemPrice;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `ord-${orderNum}`,
      orderNumber: orderNum,
      createdAt: 'Just now',
      serverName: 'Abebe M.',
      cashierName: 'Dawit K.',
      items: [sampleItem],
      subtotal,
      tax,
      total,
      status: 'PENDING',
      paymentMethod: 'CHAPA_QR',
      chapaTxRef: `chapa-tx-${orderNum}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerNote: 'Customer waiting at counter',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setNextOrderNumber((prev) => prev + 1);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  const activeStaffName = 
    currentRole === 'server' ? 'Bethlehem T. (Server)' :
    currentRole === 'cashier' ? 'Dawit K. (Cashier)' :
    'Prof. Selamawit H. (Manager)';

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#292524] flex flex-col selection:bg-[#F58FA3]/30">
      
      {/* Top Header & Role Switcher */}
      <HeaderNav
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        pendingOrdersCount={pendingOrdersCount}
        onResetData={handleResetData}
        onAddSampleOrder={handleAddSampleOrder}
        activeStaffName={activeStaffName}
      />

      {/* Main View Area (Conditioned on Selected Role) */}
      <main className="flex-1">
        {currentRole === 'server' && (
          <ServerView
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
        )}

        {currentRole === 'cashier' && (
          <CashierView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentRole === 'manager' && (
          <ManagerView
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
        )}
      </main>

    </div>
  );
}
