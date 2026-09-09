import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export const StatusPill = ({ status }) => {
  switch (status) {
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#65A30D]/15 text-[#4D7C0F] border border-[#65A30D]/30">
          <CheckCircle2 className="w-3 h-3 text-[#65A30D]" />
          <span>PAID</span>
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>FAILED</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700 border border-stone-300">
          <Clock className="w-3 h-3 text-stone-500" />
          <span>EXPIRED</span>
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>PAYMENT PENDING</span>
        </span>
      );
  }
};

export default StatusPill;
