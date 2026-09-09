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
  products = [],
  orders = [],
  expenses = [],
  staff = [],
  dailySales = [],
  monthlySales = [],
  yearlySales = [],
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

  // Key KPI metrics calculations
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

  // Best selling products ranking
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
  const bestSellingList = Object.values(productSalesMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
  const displayBestSellers =
    bestSellingList.length > 0
      ? bestSellingList
      : [
          { name: "Belgian Dark Chocolate", category: "ice_cream", sold: 128, revenue: 14080 },
          { name: "Madagascar Vanilla Bean", category: "ice_cream", sold: 104, revenue: 9880 },
          { name: "Wild Strawberry Swirl", category: "ice_cream", sold: 92, revenue: 10580 },
          { name: "Cold Brew Affogato", category: "drinks", sold: 76, revenue: 10640 },
          { name: "Ethiopian Mocha Chip", category: "ice_cream", sold: 68, revenue: 8500 }
        ];

  // Active chart data for dashboard & analytics
  const activeChartData =
    salesPeriod === "Daily"
      ? dailySales
      : salesPeriod === "Monthly"
      ? monthlySales
      : yearlySales;

  const activeAnalyticsData =
    analyticsPeriod === "Daily"
      ? dailySales
      : analyticsPeriod === "Monthly"
      ? monthlySales
      : yearlySales;

  const currentAnalyticsRevenue = activeAnalyticsData.reduce(
    (s, d) => s + d.revenue,
    0
  );
  const currentAnalyticsOrders = activeAnalyticsData.reduce(
    (s, d) => s + d.ordersCount,
    0
  );
  const currentAnalyticsItems = activeAnalyticsData.reduce(
    (s, d) => s + d.itemsSold,
    0
  );
  const averageOrderValue =
    currentAnalyticsOrders > 0
      ? Math.round(currentAnalyticsRevenue / currentAnalyticsOrders)
      : 0;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      <div className="bg-white rounded-3xl border border-[#5A3E36]/15 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[780px]">
        {/* Left Navigation Sidebar */}
        <ManagerSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={orders.length}
          productsCount={products.length}
          todaySales={todaySales}
        />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFF9F2]/20">
          <ManagerHeader
            activeTab={activeTab}
            onOpenAddProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onOpenAddExpense={() => setIsExpenseModalOpen(true)}
          />

          <div className="p-6 overflow-y-auto space-y-6">
            {activeTab === "dashboard" && (
              <ManagerDashboardTab
                todaySales={todaySales}
                todayOrdersCount={todayOrdersCount}
                paidOrders={paidOrders}
                itemsSoldCount={itemsSoldCount}
                netCashFlow={netCashFlow}
                totalInflow={totalInflow}
                totalOutflow={totalOutflow}
                activeChartData={activeChartData}
                salesPeriod={salesPeriod}
                setSalesPeriod={setSalesPeriod}
                displayBestSellers={displayBestSellers}
                orders={orders}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === "orders" && (
              <ManagerOrdersTab
                orders={orders}
                orderSearch={orderSearch}
                setOrderSearch={setOrderSearch}
                onSelectReceiptOrder={setSelectedReceiptOrder}
              />
            )}

            {activeTab === "products" && (
              <ManagerProductsTab
                products={products}
                productCategoryFilter={productCategoryFilter}
                setProductCategoryFilter={setProductCategoryFilter}
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                onOpenAddProduct={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                onEditProduct={(prod) => {
                  setEditingProduct(prod);
                  setIsProductModalOpen(true);
                }}
                onDeleteProduct={onDeleteProduct}
                onToggleAvailability={onToggleProductAvailability}
              />
            )}

            {activeTab === "expenses" && (
              <ManagerExpensesTab
                expenses={expenses}
                onOpenAddExpense={() => setIsExpenseModalOpen(true)}
                onDeleteExpense={onDeleteExpense}
              />
            )}

            {activeTab === "analytics" && (
              <ManagerAnalyticsTab
                analyticsPeriod={analyticsPeriod}
                setAnalyticsPeriod={setAnalyticsPeriod}
                activeAnalyticsData={activeAnalyticsData}
                currentAnalyticsRevenue={currentAnalyticsRevenue}
                currentAnalyticsOrders={currentAnalyticsOrders}
                currentAnalyticsItems={currentAnalyticsItems}
                averageOrderValue={averageOrderValue}
              />
            )}

            {activeTab === "settings" && (
              <ManagerSettingsTab
                staff={staff}
                onUpdateStaffPin={onUpdateStaffPin}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <ProductModal
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
        />
      )}

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={onAddExpense}
        />
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};

export const ManagerView = ManagerPage;
export default ManagerPage;
