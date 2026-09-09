import { Clock } from "lucide-react";

export const RecentOrdersBar = ({ recentOrders = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#5A3E36]/10 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E85D75]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A3E36]">
            Recent Server Submissions
          </h4>
        </div>
        <span className="text-[11px] text-[#78716C]">Live queue sync</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {recentOrders.slice(0, 3).map((ord) => (
          <div
            key={ord.id}
            className="p-2.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10 flex items-center justify-between text-xs"
          >
            <div>
              <span className="font-bold text-[#5A3E36]">#{ord.orderNumber}</span>
              <span className="text-stone-500 text-[11px] ml-1.5">
                ({ord.items.length} items)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-[#5A3E36]">{ord.total} ETB</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ord.status === "PAID"
                    ? "bg-[#65A30D]/15 text-[#4D7C0F]"
                    : ord.status === "PENDING"
                    ? "bg-amber-100 text-amber-800 animate-pulse"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {ord.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrdersBar;
