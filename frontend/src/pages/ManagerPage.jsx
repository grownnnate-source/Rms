import { useState } from "react";
import { ProductModal } from "../components/ProductModal";
import { ExpenseModal } from "../components/ExpenseModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { ManagerSidebar } from "../components/manager/ManagerSidebar";
import { ManagerHeader } from "../components/manager/ManagerHeader";
import { ManagerDashboardTab } from "../components/manager/ManagerDashboardTab";
import { ManagerOrdersTab } from "../components/manager/ManagerOrdersTab";
import { ManagerProductsTab } from "../components/manager/ManagerProductsTab";
import { ManagerExpensesTab } from "../components/manager/ManagerExpensesTab";
import { ManagerAnalyticsTab } from "../components/manager/ManagerAnalyticsTab";
import { ManagerSettingsTab } from "../components/manager/ManagerSettingsTab";

export const ManagerPage = ({
  products = [], orders = [], expenses = [], staff = [],
  dailySales = [], monthlySales = [], yearlySales = [],
  onAddProduct, onUpdateProduct, onDeleteProduct, onToggleProductAvailability,
  onAddExpense, onDeleteExpense, onUpdateStaffPin
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
  const todaySales = paidOrders.reduce((s, o) => s + o.total, 0);
  const itemsSoldCount = paidOrders.reduce((s, o) => s + o.items.reduce((acc, i) => acc + i.quantity, 0), 0);
  const totalOutflow = expenses.reduce((s, e) => s + e.amount, 0);
  const netCashFlow = todaySales - totalOutflow;

  const salesMap = {};
  paidOrders.forEach((o) => o.items.forEach((i) => {
    salesMap[i.productId] = salesMap[i.productId] || { name: i.name, category: i.category, sold: 0, revenue: 0 };
    salesMap[i.productId].sold += i.quantity;
    salesMap[i.productId].revenue += i.totalItemPrice;
  }));
  const displayBestSellers = Object.values(salesMap).sort((a, b) => b.sold - a.sold).slice(0, 5);

  const getChartData = (p) => (p === "Daily" ? dailySales : p === "Monthly" ? monthlySales : yearlySales);
  const activeChartData = getChartData(salesPeriod);
  const activeAnalyticsData = getChartData(analyticsPeriod);

  const currentAnalyticsRevenue = activeAnalyticsData.reduce((s, d) => s + d.revenue, 0);
  const currentAnalyticsOrders = activeAnalyticsData.reduce((s, d) => s + d.ordersCount, 0);
  const currentAnalyticsItems = activeAnalyticsData.reduce((s, d) => s + d.itemsSold, 0);
  const averageOrderValue = currentAnalyticsOrders > 0 ? Math.round(currentAnalyticsRevenue / currentAnalyticsOrders) : 0;

  const openNewProduct = () => { setEditingProduct(null); setIsProductModalOpen(true); };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      <div className="bg-white rounded-3xl border border-[#5A3E36]/15 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[780px]">
        <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} ordersCount={orders.length} productsCount={products.length} todaySales={todaySales} />
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFF9F2]/20">
          <ManagerHeader activeTab={activeTab} onOpenAddProduct={openNewProduct} onOpenAddExpense={() => setIsExpenseModalOpen(true)} />
          <div className="p-6 overflow-y-auto space-y-6">
            {activeTab === "dashboard" && (
              <ManagerDashboardTab todaySales={todaySales} todayOrdersCount={orders.length} paidOrders={paidOrders} itemsSoldCount={itemsSoldCount} netCashFlow={netCashFlow} totalInflow={todaySales} totalOutflow={totalOutflow} activeChartData={activeChartData} salesPeriod={salesPeriod} setSalesPeriod={setSalesPeriod} displayBestSellers={displayBestSellers} orders={orders} onNavigateTab={setActiveTab} />
            )}
            {activeTab === "orders" && (
              <ManagerOrdersTab orders={orders} orderSearch={orderSearch} setOrderSearch={setOrderSearch} onSelectReceiptOrder={setSelectedReceiptOrder} />
            )}
            {activeTab === "products" && (
              <ManagerProductsTab products={products} productCategoryFilter={productCategoryFilter} setProductCategoryFilter={setProductCategoryFilter} productSearch={productSearch} setProductSearch={setProductSearch} onOpenAddProduct={openNewProduct} onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }} onDeleteProduct={onDeleteProduct} onToggleAvailability={onToggleProductAvailability} />
            )}
            {activeTab === "expenses" && (
              <ManagerExpensesTab expenses={expenses} onOpenAddExpense={() => setIsExpenseModalOpen(true)} onDeleteExpense={onDeleteExpense} />
            )}
            {activeTab === "analytics" && (
              <ManagerAnalyticsTab analyticsPeriod={analyticsPeriod} setAnalyticsPeriod={setAnalyticsPeriod} activeAnalyticsData={activeAnalyticsData} currentAnalyticsRevenue={currentAnalyticsRevenue} currentAnalyticsOrders={currentAnalyticsOrders} currentAnalyticsItems={currentAnalyticsItems} averageOrderValue={averageOrderValue} paidOrders={paidOrders} />
            )}
            {activeTab === "settings" && <ManagerSettingsTab staff={staff} onUpdateStaffPin={onUpdateStaffPin} />}
          </div>
        </div>
      </div>

      {isProductModalOpen && <ProductModal initialProduct={editingProduct} onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} onSave={(p) => (editingProduct ? onUpdateProduct(p) : onAddProduct(p))} />}
      {isExpenseModalOpen && <ExpenseModal onClose={() => setIsExpenseModalOpen(false)} onSave={onAddExpense} />}
      {selectedReceiptOrder && <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} />}
    </div>
  );
};

export default ManagerPage;
