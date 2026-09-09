import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const CONFIG = {
  PAID: { cls: "bg-[#65A30D]/15 text-[#4D7C0F] border-[#65A30D]/30", icon: CheckCircle2, text: "PAID", iconCls: "text-[#65A30D]" },
  FAILED: { cls: "bg-rose-100 text-rose-700 border-rose-200", icon: AlertCircle, text: "FAILED", iconCls: "text-rose-600" },
  EXPIRED: { cls: "bg-stone-200 text-stone-700 border-stone-300", icon: Clock, text: "EXPIRED", iconCls: "text-stone-500" },
  PENDING: { cls: "bg-amber-100 text-amber-800 border-amber-300", text: "PAYMENT PENDING" }
};

export const StatusPill = ({ status }) => {
  const c = CONFIG[status] || CONFIG.PENDING;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${c.cls}`}>
      {Icon ? <Icon className={`w-3 h-3 ${c.iconCls}`} /> : <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
      <span>{c.text}</span>
    </span>
  );
};
