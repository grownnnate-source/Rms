import { useState } from "react";
import { ProductModal } from "../components/ProductModal";
import { ExpenseModal } from "../components/ExpenseModal";
import { SalesChart } from "../components/SalesChart";
import { ProductIcon } from "../components/ProductIcon";
import { ReceiptModal } from "../components/ReceiptModal";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Edit3,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Search,
  Printer,
  Key,
  Store,
  CreditCard,
  Sparkles
} from "lucide-react";
export const ManagerPage = ({
  products,
  orders,
  expenses,
  staff,
  dailySales,
  monthlySales,
  yearlySales,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleProductAvailability,
  onAddExpense,
  onDeleteExpense,
  onUpdateStaffPin
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [salesPeriod, setSalesPeriod] = useState("Daily");
  const [analyticsPeriod, setAnalyticsPeriod] = useState("Daily");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const paidOrders = orders.filter((o) => o.status === "PAID");
  const todaySales = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const todayOrdersCount = orders.length;
  const itemsSoldCount = paidOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );
  const totalInflow = todaySales;
  const totalOutflow = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashFlow = totalInflow - totalOutflow;
  const productSalesMap = {};
  paidOrders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.name,
          category: item.category,
          sold: 0,
          revenue: 0
        };
      }
      productSalesMap[item.productId].sold += item.quantity;
      productSalesMap[item.productId].revenue += item.totalItemPrice;
    });
  });
  const bestSellingList = Object.values(productSalesMap).sort((a, b) => b.sold - a.sold).slice(0, 5);
  const displayBestSellers = bestSellingList.length > 0 ? bestSellingList : [
    { name: "Belgian Dark Chocolate", category: "ice_cream", sold: 128, revenue: 14080 },
    { name: "Madagascar Vanilla Bean", category: "ice_cream", sold: 104, revenue: 9880 },
    { name: "Wild Strawberry Swirl", category: "ice_cream", sold: 92, revenue: 10580 },
    { name: "Cold Brew Affogato", category: "drinks", sold: 76, revenue: 10640 },
    { name: "Ethiopian Mocha Chip", category: "ice_cream", sold: 68, revenue: 8500 }
  ];
  const activeChartData = salesPeriod === "Daily" ? dailySales : salesPeriod === "Monthly" ? monthlySales : yearlySales;
  const activeAnalyticsData = analyticsPeriod === "Daily" ? dailySales : analyticsPeriod === "Monthly" ? monthlySales : yearlySales;
  const currentAnalyticsRevenue = activeAnalyticsData.reduce((s, d) => s + d.revenue, 0);
  const currentAnalyticsOrders = activeAnalyticsData.reduce((s, d) => s + d.ordersCount, 0);
  const currentAnalyticsItems = activeAnalyticsData.reduce((s, d) => s + d.itemsSold, 0);
  const averageOrderValue = currentAnalyticsOrders > 0 ? Math.round(currentAnalyticsRevenue / currentAnalyticsOrders) : 0;
  const filteredProducts = products.filter((p) => {
    const matchesCategory = productCategoryFilter === "ALL" || p.category === productCategoryFilter;
    const matchesSearch = productSearch === "" || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      
      {
    /* 1440x900 Responsive Layout Container */
  }
      <div className="bg-white rounded-3xl border border-[#5A3E36]/15 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[780px]">
        
        {
    /* LEFT SIDEBAR (Desktop/Laptop) */
  }
        <aside className="w-full md:w-64 bg-[#FFF9F2] border-r border-[#5A3E36]/10 p-5 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-6">
            
            {
    /* Store Portal Label */
  }
            <div>
              <div className="flex items-center gap-2 text-[#5A3E36] font-bold text-base">
                <Store className="w-5 h-5 text-[#E85D75]" />
                <span>Manager Suite</span>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">Admin Operations & ERP</p>
            </div>

            {
    /* Navigation Tabs */
  }
            <nav className="space-y-1">
              {[
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders Archive", icon: ShoppingBag, count: orders.length },
    { id: "products", label: "Products", icon: Layers, count: products.length },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings & PIN", icon: Settings }
  ].map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return <button
      key={tab.id}
      id={`manager-nav-${tab.id}`}
      type="button"
      onClick={() => setActiveTab(tab.id)}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? "bg-[#5A3E36] text-[#FFF9F2] shadow-sm" : "text-[#78716C] hover:text-[#5A3E36] hover:bg-white/80"}`}
    >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#F58FA3]" : "text-[#78716C]"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== void 0 && <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#5A3E36]/10 text-[#5A3E36]"}`}>
                        {tab.count}
                      </span>}
                  </button>;
  })}
            </nav>
          </div>

          {
    /* Sidebar Bottom: Quick Summary Box */
  }
          <div className="pt-4 border-t border-[#5A3E36]/10 space-y-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#5A3E36]/10 shadow-2xs">
              <div className="text-[11px] text-[#78716C]">Today's Settlement</div>
              <div className="font-bold text-sm text-[#5A3E36] mt-0.5 font-mono">
                {todaySales} ETB
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#65A30D] mt-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D]" />
                Chapa Instant Verified
              </div>
            </div>
            <div className="text-[11px] text-[#78716C] text-center">
              Campus Scoop v2.4 • Addis Ababa Univ
            </div>
          </div>
        </aside>

        {
    /* MAIN CONTENT AREA */
  }
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFF9F2]/20">
          
          {
    /* TOP BAR (Desktop/Laptop) */
  }
          <header className="px-6 py-4 border-b border-[#5A3E36]/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#5A3E36] capitalize">
                  {activeTab === "dashboard" ? "Business Overview" : activeTab}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F58FA3]/20 text-[#5A3E36]">
                  Term II
                </span>
              </div>
              <p className="text-xs text-[#78716C]">
                Real-time operational stream from Server tablets and Cashier counter
              </p>
            </div>

            {
    /* Manager Name, Date, Notifications, Profile */
  }
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#78716C] bg-[#FFF9F2] px-3 py-1.5 rounded-xl border border-[#5A3E36]/10">
                <Calendar className="w-3.5 h-3.5 text-[#E85D75]" />
                <span>Today: {(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              {
    /* Quick Actions based on active tab */
  }
              {activeTab === "products" && <button
    id="manager-add-product-btn"
    type="button"
    onClick={() => {
      setEditingProduct(null);
      setIsProductModalOpen(true);
    }}
    className="px-3 py-1.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
  >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Product</span>
                </button>}

              {activeTab === "expenses" && <button
    id="manager-add-expense-btn"
    type="button"
    onClick={() => setIsExpenseModalOpen(true)}
    className="px-3 py-1.5 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
  >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Record Expense</span>
                </button>}

              {
    /* Manager Profile Avatar */
  }
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="w-8 h-8 rounded-xl bg-[#5A3E36] text-[#FFF9F2] font-bold text-xs flex items-center justify-center shadow-xs">
                  SH
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#5A3E36]">Prof. Selamawit H.</div>
                  <div className="text-[10px] text-[#78716C]">Store Manager</div>
                </div>
              </div>
            </div>
          </header>

          {
    /* MAIN TAB CONTENT */
  }
          <div className="p-6 overflow-y-auto space-y-6">

            {
    /* TAB 1: MAIN DASHBOARD */
  }
            {activeTab === "dashboard" && <div className="space-y-6">
                
                {
    /* TOP KPI CARDS */
  }
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {
    /* Today's Sales */
  }
                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <div className="flex items-center justify-between text-[#78716C] text-xs">
                      <span>Today's Sales</span>
                      <TrendingUp className="w-4 h-4 text-[#65A30D]" />
                    </div>
                    <div className="text-2xl font-black text-[#5A3E36] mt-2">
                      {todaySales.toLocaleString()} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
                    </div>
                    <div className="text-[11px] text-[#65A30D] font-semibold flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+14.2% from yesterday</span>
                    </div>
                  </div>

                  {
    /* Today's Orders */
  }
                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <div className="flex items-center justify-between text-[#78716C] text-xs">
                      <span>Today's Orders</span>
                      <ShoppingBag className="w-4 h-4 text-[#5A3E36]" />
                    </div>
                    <div className="text-2xl font-black text-[#5A3E36] mt-2">
                      {todayOrdersCount}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      {paidOrders.length} paid • {todayOrdersCount - paidOrders.length} pending
                    </div>
                  </div>

                  {
    /* Items Sold */
  }
                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <div className="flex items-center justify-between text-[#78716C] text-xs">
                      <span>Items Sold</span>
                      <Sparkles className="w-4 h-4 text-[#F58FA3]" />
                    </div>
                    <div className="text-2xl font-black text-[#5A3E36] mt-2">
                      {itemsSoldCount}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      Dessert scoops & beverage drinks
                    </div>
                  </div>

                  {
    /* Net Cash Flow */
  }
                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <div className="flex items-center justify-between text-[#78716C] text-xs">
                      <span>Net Cash Flow</span>
                      <DollarSign className="w-4 h-4 text-[#65A30D]" />
                    </div>
                    <div className="text-2xl font-black text-[#5A3E36] mt-2 font-mono">
                      {netCashFlow >= 0 ? `+${netCashFlow}` : netCashFlow} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      Inflow ({totalInflow}) - Outflow ({totalOutflow})
                    </div>
                  </div>
                </div>

                {
    /* Sales Overview Chart */
  }
                <SalesChart
    data={activeChartData}
    period={salesPeriod}
    onPeriodChange={setSalesPeriod}
    title="Sales Overview Chart"
  />

                {
    /* Grid: Best Selling Products & Cash Flow Visualization */
  }
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {
    /* Best Selling Products (Col 7) */
  }
                  <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-[#5A3E36]">Best Selling Products</h3>
                        <p className="text-xs text-[#78716C]">Ranked sales volume by flavor</p>
                      </div>
                      <span className="text-xs font-bold text-[#E85D75]">Top 5</span>
                    </div>

                    <div className="space-y-3">
                      {displayBestSellers.map((item, idx) => {
    const highestSold = displayBestSellers[0]?.sold || 100;
    const percentage = Math.round(item.sold / highestSold * 100);
    return <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#5A3E36]">
                                {idx + 1}. {item.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono text-[#E85D75]">{item.sold} sold</span>
                                <span className="text-stone-400 font-mono">({item.revenue} ETB)</span>
                              </div>
                            </div>

                            {
      /* Progress bar */
    }
                            <div className="w-full bg-[#FFF9F2] h-2.5 rounded-full overflow-hidden border border-[#5A3E36]/10">
                              <div
      className="h-full rounded-full transition-all duration-300"
      style={{
        width: `${percentage}%`,
        backgroundColor: idx === 0 ? "#5A3E36" : idx === 1 ? "#F58FA3" : "#E85D75"
      }}
    />
                            </div>
                          </div>;
  })}
                    </div>
                  </div>

                  {
    /* Cash Flow Card (Col 5) */
  }
                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm text-[#5A3E36]">Cash Flow Breakdown</h3>
                        <span className="text-xs text-[#78716C]">Operating liquidity</span>
                      </div>
                      <p className="text-xs text-[#78716C] mb-4">
                        Today's sales revenue against supplier batches & staff stipends.
                      </p>

                      <div className="space-y-3">
                        {
    /* Cash Inflow */
  }
                        <div className="p-3 rounded-xl bg-[#65A30D]/10 border border-[#65A30D]/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#65A30D] text-white flex items-center justify-center font-bold text-xs">
                              ↓
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#4D7C0F]">Cash Inflow</div>
                              <div className="text-[10px] text-stone-600">POS Customer Revenue</div>
                            </div>
                          </div>
                          <div className="font-black font-mono text-sm text-[#4D7C0F]">
                            +{totalInflow} ETB
                          </div>
                        </div>

                        {
    /* Cash Outflow */
  }
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                              ↑
                            </div>
                            <div>
                              <div className="text-xs font-bold text-rose-700">Cash Outflow</div>
                              <div className="text-[10px] text-stone-600">Supplies, Packaging, Dairy</div>
                            </div>
                          </div>
                          <div className="font-black font-mono text-sm text-rose-700">
                            -{totalOutflow} ETB
                          </div>
                        </div>

                        {
    /* Net Cash Flow */
  }
                        <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/20 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-black uppercase tracking-wider text-[#5A3E36]">
                              Net Cash Flow
                            </div>
                            <div className="text-[10px] text-[#78716C]">Operating Margin Balance</div>
                          </div>
                          <div className={`font-black font-mono text-base ${netCashFlow >= 0 ? "text-[#65A30D]" : "text-rose-600"}`}>
                            {netCashFlow >= 0 ? `+${netCashFlow}` : netCashFlow} ETB
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
    type="button"
    onClick={() => setActiveTab("expenses")}
    className="mt-4 w-full py-2 text-xs font-bold text-[#5A3E36] bg-[#FFF9F2] hover:bg-[#F58FA3]/20 rounded-xl border border-[#5A3E36]/15 transition-colors cursor-pointer text-center"
  >
                      Manage All Expenses →
                    </button>
                  </div>

                </div>

                {
    /* Recent Transactions Table */
  }
                <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#5A3E36]">Recent Transactions</h3>
                      <p className="text-xs text-[#78716C]">Real-time ledger entries from today's orders</p>
                    </div>
                    <button
    type="button"
    onClick={() => setActiveTab("orders")}
    className="text-xs font-bold text-[#E85D75] hover:underline cursor-pointer"
  >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292524]">
                      <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px]">
                        <tr>
                          <th className="px-3 py-2.5">Date</th>
                          <th className="px-3 py-2.5">Order</th>
                          <th className="px-3 py-2.5">Type</th>
                          <th className="px-3 py-2.5">Server</th>
                          <th className="px-3 py-2.5 text-right">Amount</th>
                          <th className="px-3 py-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.slice(0, 5).map((ord) => <tr key={ord.id} className="hover:bg-stone-50">
                            <td className="px-3 py-2.5 text-stone-500 font-mono text-[11px]">
                              {ord.createdAt}
                            </td>
                            <td className="px-3 py-2.5 font-bold font-mono text-[#5A3E36]">
                              #{ord.orderNumber}
                            </td>
                            <td className="px-3 py-2.5 text-stone-600">
                              {ord.paymentMethod.replace("_", " ")}
                            </td>
                            <td className="px-3 py-2.5 font-medium">
                              {ord.serverName}
                            </td>
                            <td className="px-3 py-2.5 text-right font-black font-mono text-[#5A3E36]">
                              {ord.total} ETB
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.status === "PAID" ? "bg-[#65A30D]/15 text-[#4D7C0F]" : ord.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"}`}>
                                {ord.status}
                              </span>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>}

            {
    /* TAB 2: ORDERS ARCHIVE */
  }
            {activeTab === "orders" && <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                  <div>
                    <h3 className="font-bold text-base text-[#5A3E36]">Customer Orders Log</h3>
                    <p className="text-xs text-[#78716C]">Search and audit all historical POS orders</p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
    type="text"
    value={orderSearch}
    onChange={(e) => setOrderSearch(e.target.value)}
    placeholder="Search order #, customer, flavor..."
    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
  />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292524]">
                      <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Order #</th>
                          <th className="px-4 py-3">Time</th>
                          <th className="px-4 py-3">Server</th>
                          <th className="px-4 py-3">Items Ordered</th>
                          <th className="px-4 py-3 text-right">Total (ETB)</th>
                          <th className="px-4 py-3">Payment Method</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.filter(
    (o) => o.orderNumber.toString().includes(orderSearch) || o.serverName.toLowerCase().includes(orderSearch.toLowerCase()) || o.items.some((i) => i.name.toLowerCase().includes(orderSearch.toLowerCase()))
  ).map((order) => <tr key={order.id} className="hover:bg-stone-50">
                              <td className="px-4 py-3 font-bold font-mono text-[#5A3E36]">
                                #{order.orderNumber}
                              </td>
                              <td className="px-4 py-3 text-stone-500 font-mono text-[11px]">
                                {order.createdAt}
                              </td>
                              <td className="px-4 py-3 font-medium">
                                {order.serverName}
                              </td>
                              <td className="px-4 py-3 text-stone-700 max-w-xs">
                                <div className="truncate">
                                  {order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-black font-mono text-[#5A3E36]">
                                {order.total} ETB
                              </td>
                              <td className="px-4 py-3 text-stone-600 font-mono text-[11px]">
                                {order.paymentMethod.replace("_", " ")}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${order.status === "PAID" ? "bg-[#65A30D]/15 text-[#4D7C0F]" : order.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
    type="button"
    onClick={() => setSelectedReceiptOrder(order)}
    className="px-2.5 py-1 rounded-lg bg-[#FFF9F2] hover:bg-[#5A3E36] text-[#5A3E36] hover:text-white font-bold text-[11px] border border-[#5A3E36]/15 transition-colors inline-flex items-center gap-1 cursor-pointer"
  >
                                  <Printer className="w-3 h-3" />
                                  <span>View Receipt</span>
                                </button>
                              </td>
                            </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>}

            {
    /* TAB 3: PRODUCT MANAGEMENT */
  }
            {activeTab === "products" && <div className="space-y-4">
                
                {
    /* Control bar */
  }
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                  {
    /* Category filters */
  }
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["ALL", "ice_cream", "toppings", "cones", "cups", "drinks"].map((cat) => {
    const isActive = productCategoryFilter === cat;
    const label = cat === "ALL" ? "All" : cat.replace("_", " ");
    return <button
      key={cat}
      type="button"
      onClick={() => setProductCategoryFilter(cat)}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${isActive ? "bg-[#5A3E36] text-white shadow-xs" : "bg-[#FFF9F2] text-[#78716C] hover:text-[#5A3E36] border border-[#5A3E36]/10"}`}
    >
                          {label}
                        </button>;
  })}
                  </div>

                  {
    /* Search and Add Button */
  }
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
    type="text"
    value={productSearch}
    onChange={(e) => setProductSearch(e.target.value)}
    placeholder="Search product..."
    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
  />
                    </div>

                    <button
    type="button"
    onClick={() => {
      setEditingProduct(null);
      setIsProductModalOpen(true);
    }}
    className="px-3.5 py-1.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
  >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {
    /* Product Management Table */
  }
                <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292524]">
                      <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Visual</th>
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 font-mono">Price</th>
                          <th className="px-4 py-3">Availability</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredProducts.map((prod) => {
    return <tr
      key={prod.id}
      className={`hover:bg-stone-50 transition-colors ${!prod.available ? "opacity-65 bg-stone-50/70" : ""}`}
    >
                              <td className="px-4 py-3">
                                <ProductIcon
      category={prod.category}
      iconName={prod.iconName}
      colorAccent={prod.colorAccent}
      className="w-5 h-5"
    />
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-sm text-[#5A3E36]">
                                  {prod.name}
                                </div>
                                <div className="text-[11px] text-[#78716C] line-clamp-1">
                                  {prod.description}
                                </div>
                                {prod.badge && <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F58FA3]/20 text-[#5A3E36]">
                                    {prod.badge}
                                  </span>}
                              </td>
                              <td className="px-4 py-3 capitalize font-medium text-stone-600">
                                {prod.category.replace("_", " ")}
                              </td>
                              <td className="px-4 py-3 font-black font-mono text-sm text-[#5A3E36]">
                                {prod.price} <span className="text-[10px] text-[#E85D75]">ETB</span>
                              </td>
                              <td className="px-4 py-3">
                                <button
      type="button"
      onClick={() => onToggleProductAvailability(prod.id)}
      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${prod.available ? "bg-[#65A30D]/15 text-[#4D7C0F] hover:bg-[#65A30D]/25" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
      title="Click to toggle availability"
    >
                                  <span className={`w-1.5 h-1.5 rounded-full ${prod.available ? "bg-[#65A30D]" : "bg-stone-400"}`} />
                                  <span>{prod.available ? "In Stock" : "Disabled / Out of Stock"}</span>
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
      type="button"
      onClick={() => {
        setEditingProduct(prod);
        setIsProductModalOpen(true);
      }}
      className="p-1.5 rounded-lg text-stone-600 hover:text-[#5A3E36] hover:bg-[#FFF9F2] border border-stone-200 cursor-pointer"
      title="Edit Product"
    >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
      type="button"
      onClick={() => onDeleteProduct(prod.id)}
      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 cursor-pointer"
      title="Delete Product"
    >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>;
  })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>}

            {
    /* TAB 4: EXPENSES MANAGEMENT */
  }
            {activeTab === "expenses" && <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                  <div>
                    <h3 className="font-bold text-base text-[#5A3E36]">Business Expense Tracker</h3>
                    <p className="text-xs text-[#78716C]">Record supply costs, batch dairy, packaging & wages</p>
                  </div>

                  <button
    type="button"
    onClick={() => setIsExpenseModalOpen(true)}
    className="px-4 py-2 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Record Outflow</span>
                  </button>
                </div>

                {
    /* Expenses Table */
  }
                <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292524]">
                      <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Expense Item</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 font-mono text-right">Amount</th>
                          <th className="px-4 py-3">Authorized By</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {expenses.map((exp) => <tr key={exp.id} className="hover:bg-stone-50">
                            <td className="px-4 py-3 text-stone-500 font-mono text-[11px]">
                              {exp.date}
                            </td>
                            <td className="px-4 py-3 font-bold text-[#5A3E36]">
                              {exp.title}
                            </td>
                            <td className="px-4 py-3 text-stone-600">
                              <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#5A3E36] border border-[#5A3E36]/10 font-medium text-[11px]">
                                {exp.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-black font-mono text-sm text-rose-700">
                              -{exp.amount} ETB
                            </td>
                            <td className="px-4 py-3 text-stone-600">
                              {exp.approvedBy}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
    type="button"
    onClick={() => onDeleteExpense(exp.id)}
    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
    title="Delete expense"
  >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>}

            {
    /* TAB 5: DEDICATED ANALYTICS PAGE */
  }
            {activeTab === "analytics" && <div className="space-y-6">
                
                {
    /* Period Selector Top Bar */
  }
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                  <div>
                    <h3 className="font-bold text-base text-[#5A3E36]">Store Performance Analytics</h3>
                    <p className="text-xs text-[#78716C]">Comprehensive metrics across university retail cycles</p>
                  </div>

                  <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
                    {["Daily", "Monthly", "Yearly"].map((p) => {
    const isSelected = analyticsPeriod === p;
    return <button
      key={p}
      type="button"
      onClick={() => setAnalyticsPeriod(p)}
      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelected ? "bg-[#5A3E36] text-white shadow-xs" : "text-[#78716C] hover:text-[#5A3E36]"}`}
    >
                          {p}
                        </button>;
  })}
                  </div>
                </div>

                {
    /* Key Metrics Grid */
  }
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <span className="text-xs text-[#78716C]">Total Revenue</span>
                    <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
                      {currentAnalyticsRevenue.toLocaleString()} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <span className="text-xs text-[#78716C]">Total Orders</span>
                    <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
                      {currentAnalyticsOrders}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <span className="text-xs text-[#78716C]">Items Sold</span>
                    <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
                      {currentAnalyticsItems}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
                    <span className="text-xs text-[#78716C]">Average Order Value (AOV)</span>
                    <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
                      {averageOrderValue} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
                    </div>
                  </div>
                </div>

                {
    /* Sales Trend Chart */
  }
                <SalesChart
    data={activeAnalyticsData}
    period={analyticsPeriod}
    onPeriodChange={setAnalyticsPeriod}
    title="Sales Trend (ETB Revenue)"
    metric="revenue"
  />

                {
    /* Orders Trend Chart */
  }
                <SalesChart
    data={activeAnalyticsData}
    period={analyticsPeriod}
    onPeriodChange={setAnalyticsPeriod}
    title="Orders Volume Trend"
    metric="orders"
  />

                {
    /* Revenue by Category Breakdown */
  }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-[#5A3E36]">Revenue by Category</h3>
                    <div className="space-y-3">
                      {[
    { name: "Ice Cream & Gelato", percentage: 68, amount: Math.round(currentAnalyticsRevenue * 0.68), color: "#5A3E36" },
    { name: "Cold Drinks & Shakes", percentage: 18, amount: Math.round(currentAnalyticsRevenue * 0.18), color: "#E85D75" },
    { name: "Toppings & Add-ons", percentage: 9, amount: Math.round(currentAnalyticsRevenue * 0.09), color: "#F58FA3" },
    { name: "Specialty Cones & Bowls", percentage: 5, amount: Math.round(currentAnalyticsRevenue * 0.05), color: "#65A30D" }
  ].map((c) => <div key={c.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-[#5A3E36]">{c.name}</span>
                            <span className="font-mono text-stone-600">{c.amount.toLocaleString()} ETB ({c.percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#FFF9F2] h-2 rounded-full overflow-hidden border border-[#5A3E36]/10">
                            <div
    className="h-full rounded-full"
    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
  />
                          </div>
                        </div>)}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-[#5A3E36]">Top Revenue Drivers</h3>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
                        <span className="font-bold text-[#5A3E36]">Belgian Dark Chocolate</span>
                        <span className="font-mono font-bold text-[#E85D75]">14,080 ETB</span>
                      </li>
                      <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
                        <span className="font-bold text-[#5A3E36]">Wild Strawberry Swirl</span>
                        <span className="font-mono font-bold text-[#E85D75]">10,580 ETB</span>
                      </li>
                      <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
                        <span className="font-bold text-[#5A3E36]">Cold Brew Affogato</span>
                        <span className="font-mono font-bold text-[#E85D75]">10,640 ETB</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>}

            {
    /* TAB 6: SETTINGS & STAFF PIN MANAGEMENT */
  }
            {activeTab === "settings" && <div className="space-y-6">
                
                {
    /* Staff PIN Management */
  }
                <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#E85D75]" />
                    <div>
                      <h3 className="font-bold text-sm text-[#5A3E36]">Staff Access & Security PINs</h3>
                      <p className="text-xs text-[#78716C]">Configure 4-digit quick authorization codes for shift personnel</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {staff.map((member) => <div key={member.id} className="p-4 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-lg bg-[#5A3E36] text-[#FFF9F2] font-bold text-xs flex items-center justify-center">
                            {member.avatar}
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-[#5A3E36] border border-[#5A3E36]/10">
                            {member.role}
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-sm text-[#5A3E36]">{member.name}</div>
                          <div className="text-[11px] text-[#78716C]">{member.shift}</div>
                        </div>

                        <div className="pt-2 border-t border-[#5A3E36]/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#78716C]">Current PIN:</span>
                            <div className="font-mono font-bold text-sm tracking-widest text-[#5A3E36]">
                              •••• ({member.pin})
                            </div>
                          </div>
                          <button
    type="button"
    onClick={() => {
      const newPin = prompt(`Enter new 4-digit PIN for ${member.name}:`, member.pin);
      if (newPin && newPin.length === 4) {
        onUpdateStaffPin(member.id, newPin);
      }
    }}
    className="px-2.5 py-1 text-xs font-bold text-[#E85D75] hover:bg-[#F58FA3]/20 rounded-lg transition-colors cursor-pointer"
  >
                            Change PIN
                          </button>
                        </div>
                      </div>)}
                  </div>
                </div>

                {
    /* Chapa Payment Gateway Settings */
  }
                <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#0052FF]" />
                    <div>
                      <h3 className="font-bold text-sm text-[#5A3E36]">Chapa Gateway & Bank Integration</h3>
                      <p className="text-xs text-[#78716C]">Ethiopian Telebirr, CBE Birr, and Visa/Mastercard settlement channel</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                        Chapa Merchant Public Key
                      </label>
                      <input
    type="text"
    readOnly
    value="CHASECK_TEST-384920412849102"
    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700"
  />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                        Webhook Receiver URL
                      </label>
                      <input
    type="text"
    readOnly
    value="https://campus-scoop.edu.et/api/chapa/webhook"
    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700"
  />
                    </div>
                  </div>
                </div>

                {
    /* Store Profile */
  }
                <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#5A3E36]" />
                    <div>
                      <h3 className="font-bold text-sm text-[#5A3E36]">Campus Store Parameters</h3>
                      <p className="text-xs text-[#78716C]">Tax rate, currency unit and physical terminal identity</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
                      <span className="text-stone-500">Currency Unit</span>
                      <div className="font-bold text-sm text-[#5A3E36] mt-0.5">ETB (Ethiopian Birr)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
                      <span className="text-stone-500">Student Campus VAT</span>
                      <div className="font-bold text-sm text-[#5A3E36] mt-0.5">5.0% flat</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
                      <span className="text-stone-500">Thermal Printer Protocol</span>
                      <div className="font-bold text-sm text-[#5A3E36] mt-0.5">ESC/POS 80mm Standard</div>
                    </div>
                  </div>
                </div>

              </div>}

          </div>

        </div>

      </div>

      {
    /* Add / Edit Product Modal */
  }
      {isProductModalOpen && <ProductModal
    initialProduct={editingProduct}
    onClose={() => {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }}
    onSave={(prod) => {
      if (editingProduct) {
        onUpdateProduct(prod);
      } else {
        onAddProduct(prod);
      }
    }}
  />}

      {
    /* Record Expense Modal */
  }
      {isExpenseModalOpen && <ExpenseModal
    onClose={() => setIsExpenseModalOpen(false)}
    onSave={onAddExpense}
  />}

      {
    /* Printable Receipt Modal */
  }
      {selectedReceiptOrder && <ReceiptModal
    order={selectedReceiptOrder}
    onClose={() => setSelectedReceiptOrder(null)}
  />}

    </div>;
};

export const ManagerView = ManagerPage;
export default ManagerPage;
