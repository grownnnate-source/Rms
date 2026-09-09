import { useState } from "react";

const SUBTITLES = { Daily: "Hourly store performance for today", Monthly: "Weekly revenue aggregation this month", Yearly: "Annual academic calendar sales trajectory" };

export const SalesChart = ({ data = [], period, onPeriodChange, title = "Sales Overview", metric = "revenue" }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const values = data.map((d) => (metric === "revenue" ? d.revenue : d.ordersCount));
  const maxValue = Math.max(...values, 100);
  const height = 200, padX = 35, padY = 25;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h3 className="font-bold text-sm text-[#5A3E36]">{title}</h3><p className="text-xs text-[#78716C]">{SUBTITLES[period] || ""}</p></div>
        <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15 self-start sm:self-auto">
          {["Daily", "Monthly", "Yearly"].map((p) => (
            <button key={p} type="button" onClick={() => onPeriodChange(p)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${period === p ? "bg-[#5A3E36] text-white shadow-2xs" : "text-[#78716C] hover:text-[#5A3E36]"}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="relative pt-2">
        <svg className="w-full h-52 overflow-visible" viewBox={`0 0 500 ${height}`} preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padY + (height - 2 * padY) * (1 - ratio);
            return (
              <g key={i}>
                <line x1={padX} y1={y} x2={500 - padX} y2={y} stroke="#E7E5E4" strokeDasharray="4 4" strokeWidth="1" />
                <text x={padX - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#A8A29E" fontFamily="monospace">{Math.round(maxValue * ratio)}</text>
              </g>
            );
          })}
          {data.map((pt, i) => {
            const slot = (500 - 2 * padX) / data.length;
            const bw = Math.min(Math.max(slot * 0.55, 14), 32);
            const cx = padX + i * slot + slot / 2;
            const val = metric === "revenue" ? pt.revenue : pt.ordersCount;
            const bh = ((height - 2 * padY) * val) / maxValue;
            const by = height - padY - bh;
            const isHov = hoveredIdx === i;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                <rect x={cx - slot / 2 + 2} y={padY} width={slot - 4} height={height - 2 * padY} fill={isHov ? "#F58FA3" : "transparent"} fillOpacity="0.08" rx="4" />
                <rect x={cx - bw / 2} y={by} width={bw} height={bh} fill={isHov ? "#E85D75" : "#5A3E36"} rx="6" className="transition-all duration-150" />
                <rect x={cx - bw / 2} y={by} width={bw} height={Math.min(bh, 4)} fill="#F58FA3" rx="2" />
                <text x={cx} y={height - 6} textAnchor="middle" fontSize="10" fontWeight={isHov ? "bold" : "normal"} fill={isHov ? "#5A3E36" : "#78716C"}>{pt.time || pt.day || pt.month || pt.label || ""}</text>
              </g>
            );
          })}
        </svg>

        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5A3E36] text-white px-3 py-1.5 rounded-xl text-xs shadow-lg pointer-events-none flex items-center gap-2 font-mono animate-in fade-in duration-100">
            <span className="font-bold text-[#F58FA3]">{data[hoveredIdx].time || data[hoveredIdx].day || data[hoveredIdx].month || data[hoveredIdx].label}:</span>
            <span>{data[hoveredIdx].revenue.toLocaleString()} ETB</span><span className="text-stone-300">({data[hoveredIdx].ordersCount} orders)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
