import { useMemo } from "react";
import { SalesChart } from "../SalesChart";

const CATEGORY_META = {
  ice_cream: { name: "Ice Cream & Gelato", color: "#5A3E36" },
  drinks: { name: "Cold Drinks & Shakes", color: "#E85D75" },
  toppings: { name: "Toppings & Add-ons", color: "#F58FA3" },
  cones: { name: "Waffle Cones", color: "#65A30D" },
  cups: { name: "Cups & Packaging", color: "#D97706" }
};

export const ManagerAnalyticsTab = ({
  analyticsPeriod = "Daily", setAnalyticsPeriod, activeAnalyticsData = [],
  currentAnalyticsRevenue = 0, currentAnalyticsOrders = 0, currentAnalyticsItems = 0,
  averageOrderValue = 0, paidOrders = []
}) => {
  const categoryBreakdown = useMemo(() => {
    const map = {};
    paidOrders.forEach((o) => o.items.forEach((item) => {
      const cat = (item.category || "ice_cream").toLowerCase().replace(/\s+/g, "_");
      map[cat] = map[cat] || { name: CATEGORY_META[cat]?.name || cat.replace("_", " "), amount: 0, color: CATEGORY_META[cat]?.color || "#5A3E36" };
      map[cat].amount += item.totalItemPrice;
    }));
    const total = Object.values(map).reduce((s, c) => s + c.amount, 0);
    return Object.values(map).map((c) => ({ ...c, percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0 }));
  }, [paidOrders]);

  const topDrivers = useMemo(() => {
    const map = {};
    paidOrders.forEach((o) => o.items.forEach((it) => { map[it.name] = (map[it.name] || 0) + it.totalItemPrice; }));
    return Object.entries(map).map(([name, revenue]) => ({ name, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [paidOrders]);

  const metrics = [
    { label: "Total Revenue", val: `${currentAnalyticsRevenue.toLocaleString()} ETB`, accent: true },
    { label: "Total Orders", val: currentAnalyticsOrders },
    { label: "Items Sold", val: currentAnalyticsItems },
    { label: "Average Order Value (AOV)", val: `${averageOrderValue} ETB`, accent: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
        <div><h3 className="font-bold text-base text-[#5A3E36]">Store Performance Analytics</h3><p className="text-xs text-[#78716C]">Comprehensive metrics across retail cycles</p></div>
        <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
          {["Daily", "Monthly", "Yearly"].map((p) => (
            <button key={p} type="button" onClick={() => setAnalyticsPeriod(p)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${analyticsPeriod === p ? "bg-[#5A3E36] text-white shadow-xs" : "text-[#78716C] hover:text-[#5A3E36]"}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
            <span className="text-xs text-[#78716C]">{m.label}</span>
            <div className="text-2xl font-black text-[#5A3E36] mt-1 font-mono">
              {m.accent ? <>{String(m.val).replace(" ETB", "")} <span className="text-xs font-bold text-[#E85D75]">ETB</span></> : m.val}
            </div>
          </div>
        ))}
      </div>

      <SalesChart data={activeAnalyticsData} period={analyticsPeriod} onPeriodChange={setAnalyticsPeriod} title="Sales Trend (ETB Revenue)" metric="revenue" />
      <SalesChart data={activeAnalyticsData} period={analyticsPeriod} onPeriodChange={setAnalyticsPeriod} title="Orders Volume Trend" metric="orders" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A3E36]">Revenue by Category</h3>
          {categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF9F2] rounded-xl border border-dashed border-[#5A3E36]/20">
              <p className="text-xs font-bold text-[#5A3E36]">No category sales yet</p>
              <p className="text-[11px] text-[#78716C] mt-0.5">Category revenue splits will generate here once customer orders settle.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="font-semibold text-[#5A3E36]">{c.name}</span><span className="font-mono text-stone-600">{c.amount.toLocaleString()} ETB ({c.percentage}%)</span></div>
                  <div className="w-full bg-[#FFF9F2] h-2 rounded-full overflow-hidden border border-[#5A3E36]/10"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${c.percentage}%`, backgroundColor: c.color }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#5A3E36]">Top Revenue Drivers</h3>
          {topDrivers.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF9F2] rounded-xl border border-dashed border-[#5A3E36]/20">
              <p className="text-xs font-bold text-[#5A3E36]">No revenue drivers yet</p>
              <p className="text-[11px] text-[#78716C] mt-0.5">Top earning products will appear here automatically from POS orders.</p>
            </div>
          ) : (
            <ul className="space-y-2.5 text-xs">
              {topDrivers.map((item) => (
                <li key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
                  <span className="font-bold text-[#5A3E36]">{item.name}</span>
                  <span className="font-mono font-bold text-[#E85D75]">{item.revenue.toLocaleString()} ETB</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalyticsTab;
