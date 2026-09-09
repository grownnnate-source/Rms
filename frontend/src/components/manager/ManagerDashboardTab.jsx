import { TrendingUp, ShoppingBag, Sparkles, DollarSign, ArrowUpRight } from "lucide-react";
import { SalesChart } from "../SalesChart";

export const ManagerDashboardTab = ({
  todaySales = 0, todayOrdersCount = 0, paidOrders = [], itemsSoldCount = 0,
  netCashFlow = 0, totalInflow = 0, totalOutflow = 0, activeChartData = [],
  salesPeriod = "Daily", setSalesPeriod, displayBestSellers = [], orders = [], onNavigateTab
}) => {
  const kpiCards = [
    { title: "Today's Sales", icon: TrendingUp, col: "text-[#65A30D]", val: `${todaySales.toLocaleString()} ETB`, accent: true,
      sub: <span className="text-[11px] text-[#65A30D] font-semibold flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />Live POS ledger sync</span> },
    { title: "Today's Orders", icon: ShoppingBag, col: "text-[#5A3E36]", val: todayOrdersCount,
      sub: <div className="text-[11px] text-stone-500 mt-1">{paidOrders.length} paid &bull; {todayOrdersCount - paidOrders.length} pending</div> },
    { title: "Items Sold", icon: Sparkles, col: "text-[#F58FA3]", val: itemsSoldCount,
      sub: <div className="text-[11px] text-stone-500 mt-1">Dessert scoops & beverage drinks</div> },
    { title: "Net Cash Flow", icon: DollarSign, col: "text-[#65A30D]", val: `${netCashFlow >= 0 ? `+${netCashFlow}` : netCashFlow} ETB`, accent: true,
      sub: <div className="text-[11px] text-stone-500 mt-1">Inflow ({totalInflow}) - Outflow ({totalOutflow})</div> }
  ];

  const cashFlowRows = [
    { label: "Cash Inflow", sub: "POS Customer Revenue", amount: `+${totalInflow} ETB`, bg: "bg-[#65A30D]/10 border-[#65A30D]/20", text: "text-[#4D7C0F]", iconBg: "bg-[#65A30D]", arrow: "↓" },
    { label: "Cash Outflow", sub: "Supplies, Packaging, Dairy", amount: `-${totalOutflow} ETB`, bg: "bg-rose-50 border-rose-200", text: "text-rose-700", iconBg: "bg-rose-600", arrow: "↑" }
  ];

  return (
    <div className="space-y-6">
      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
              <div className="flex items-center justify-between text-[#78716C] text-xs">
                <span>{kpi.title}</span><Icon className={`w-4 h-4 ${kpi.col}`} />
              </div>
              <div className="text-2xl font-black text-[#5A3E36] mt-2 font-mono">
                {kpi.accent ? <>{kpi.val.replace(" ETB", "")} <span className="text-xs font-bold text-[#E85D75]">ETB</span></> : kpi.val}
              </div>
              {kpi.sub}
            </div>
          );
        })}
      </div>

      <SalesChart data={activeChartData} period={salesPeriod} onPeriodChange={setSalesPeriod} title="Sales Overview Chart" />

      {/* Best Sellers & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div><h3 className="font-bold text-sm text-[#5A3E36]">Best Selling Products</h3><p className="text-xs text-[#78716C]">Ranked sales volume by flavor</p></div>
            <span className="text-xs font-bold text-[#E85D75]">Top 5</span>
          </div>
          <div className="space-y-3">
            {displayBestSellers.length === 0 ? (
              <div className="p-8 text-center bg-[#FFF9F2] rounded-xl border border-dashed border-[#5A3E36]/20">
                <p className="text-xs font-bold text-[#5A3E36]">No sales recorded yet</p>
                <p className="text-[11px] text-[#78716C] mt-0.5">Best sellers will automatically rank here as orders are settled in POS.</p>
              </div>
            ) : (
              displayBestSellers.map((item, idx) => {
                const pct = Math.round((item.sold / (displayBestSellers[0]?.sold || 100)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#5A3E36]">{idx + 1}. {item.name}</span>
                      <div className="flex items-center gap-2"><span className="font-bold font-mono text-[#E85D75]">{item.sold} sold</span><span className="text-stone-400 font-mono">({item.revenue} ETB)</span></div>
                    </div>
                    <div className="w-full bg-[#FFF9F2] h-2.5 rounded-full overflow-hidden border border-[#5A3E36]/10">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: idx === 0 ? "#5A3E36" : idx === 1 ? "#F58FA3" : "#E85D75" }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-sm text-[#5A3E36]">Cash Flow Breakdown</h3><span className="text-xs text-[#78716C]">Operating liquidity</span></div>
            <p className="text-xs text-[#78716C] mb-4">Today&apos;s sales revenue against supplier batches & staff stipends.</p>
            <div className="space-y-3">
              {cashFlowRows.map((row, i) => (
                <div key={i} className={`p-3 rounded-xl ${row.bg} border flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${row.iconBg} text-white flex items-center justify-center font-bold text-xs`}>{row.arrow}</div>
                    <div><div className={`text-xs font-bold ${row.text}`}>{row.label}</div><div className="text-[10px] text-stone-600">{row.sub}</div></div>
                  </div>
                  <div className={`font-black font-mono text-sm ${row.text}`}>{row.amount}</div>
                </div>
              ))}
              <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/20 flex items-center justify-between">
                <div><div className="text-xs font-black uppercase tracking-wider text-[#5A3E36]">Net Cash Flow</div><div className="text-[10px] text-[#78716C]">Operating Margin Balance</div></div>
                <div className={`font-black font-mono text-base ${netCashFlow >= 0 ? "text-[#65A30D]" : "text-rose-600"}`}>{netCashFlow >= 0 ? `+${netCashFlow}` : netCashFlow} ETB</div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => onNavigateTab("expenses")} className="mt-4 w-full py-2 text-xs font-bold text-[#5A3E36] bg-[#FFF9F2] hover:bg-[#F58FA3]/20 rounded-xl border border-[#5A3E36]/15 transition-colors cursor-pointer text-center">
            Manage All Expenses &rarr;
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div><h3 className="font-bold text-sm text-[#5A3E36]">Recent Transactions</h3><p className="text-xs text-[#78716C]">Real-time ledger entries from today&apos;s orders</p></div>
          <button type="button" onClick={() => onNavigateTab("orders")} className="text-xs font-bold text-[#E85D75] hover:underline cursor-pointer">View All Orders ({orders.length}) &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#292524]">
            <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px]">
              <tr>{["Date", "Order", "Type", "Server", "Amount", "Status"].map((h, idx) => (
                <th key={h} className={`px-3 py-2.5 ${idx === 4 ? "text-right" : idx === 5 ? "text-center" : ""}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((ord, idx) => (
                <tr key={`${ord.id || "recent"}-${idx}`} className="hover:bg-stone-50">
                  <td className="px-3 py-2.5 text-stone-500 font-mono text-[11px]">{ord.createdAt}</td>
                  <td className="px-3 py-2.5 font-bold font-mono text-[#5A3E36]">#{ord.orderNumber}</td>
                  <td className="px-3 py-2.5 text-stone-600">{(ord.paymentMethod || "CHAPA_QR").replace("_", " ")}</td>
                  <td className="px-3 py-2.5 font-medium">{ord.serverName}</td>
                  <td className="px-3 py-2.5 text-right font-black font-mono text-[#5A3E36]">{ord.total} ETB</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.status === "PAID" ? "bg-[#65A30D]/15 text-[#4D7C0F]" : ord.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"}`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
