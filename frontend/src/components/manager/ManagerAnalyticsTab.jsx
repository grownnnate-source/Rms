import { SalesChart } from "../SalesChart";

const ANALYTICS_PERIODS = ["Daily", "Monthly", "Yearly"];

export const ManagerAnalyticsTab = ({
  analyticsPeriod = "Daily",
  setAnalyticsPeriod,
  activeAnalyticsData = [],
  currentAnalyticsRevenue = 0,
  currentAnalyticsOrders = 0,
  currentAnalyticsItems = 0,
  averageOrderValue = 0
}) => {
  const categoryBreakdown = [
    {
      name: "Ice Cream & Gelato",
      percentage: 68,
      amount: Math.round(currentAnalyticsRevenue * 0.68),
      color: "#5A3E36"
    },
    {
      name: "Cold Drinks & Shakes",
      percentage: 18,
      amount: Math.round(currentAnalyticsRevenue * 0.18),
      color: "#E85D75"
    },
    {
      name: "Toppings & Add-ons",
      percentage: 9,
      amount: Math.round(currentAnalyticsRevenue * 0.09),
      color: "#F58FA3"
    },
    {
      name: "Specialty Cones & Bowls",
      percentage: 5,
      amount: Math.round(currentAnalyticsRevenue * 0.05),
      color: "#65A30D"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
        <div>
          <h3 className="font-bold text-base text-[#5A3E36]">
            Store Performance Analytics
          </h3>
          <p className="text-xs text-[#78716C]">
            Comprehensive metrics across university retail cycles
          </p>
        </div>

        <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
          {ANALYTICS_PERIODS.map((p) => {
            const isSelected = analyticsPeriod === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setAnalyticsPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#5A3E36] text-white shadow-xs"
                    : "text-[#78716C] hover:text-[#5A3E36]"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
          <span className="text-xs text-[#78716C]">Total Revenue</span>
          <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
            {currentAnalyticsRevenue.toLocaleString()}{" "}
            <span className="text-xs font-bold text-[#E85D75]">ETB</span>
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
          <span className="text-xs text-[#78716C]">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
            {averageOrderValue}{" "}
            <span className="text-xs font-bold text-[#E85D75]">ETB</span>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <SalesChart
        data={activeAnalyticsData}
        period={analyticsPeriod}
        onPeriodChange={setAnalyticsPeriod}
        title="Sales Trend (ETB Revenue)"
        metric="revenue"
      />

      {/* Orders Trend Chart */}
      <SalesChart
        data={activeAnalyticsData}
        period={analyticsPeriod}
        onPeriodChange={setAnalyticsPeriod}
        title="Orders Volume Trend"
        metric="orders"
      />

      {/* Revenue by Category Breakdown & Top Revenue Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A3E36]">
            Revenue by Category
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#5A3E36]">{c.name}</span>
                  <span className="font-mono text-stone-600">
                    {c.amount.toLocaleString()} ETB ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#FFF9F2] h-2 rounded-full overflow-hidden border border-[#5A3E36]/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.percentage}%`,
                      backgroundColor: c.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A3E36]">
            Top Revenue Drivers
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
              <span className="font-bold text-[#5A3E36]">
                Belgian Dark Chocolate
              </span>
              <span className="font-mono font-bold text-[#E85D75]">
                14,080 ETB
              </span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
              <span className="font-bold text-[#5A3E36]">
                Wild Strawberry Swirl
              </span>
              <span className="font-mono font-bold text-[#E85D75]">
                10,580 ETB
              </span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2]">
              <span className="font-bold text-[#5A3E36]">
                Cold Brew Affogato
              </span>
              <span className="font-mono font-bold text-[#E85D75]">
                10,640 ETB
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalyticsTab;
