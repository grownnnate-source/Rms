import { CreditCard, Printer } from "lucide-react";
import { StatusPill } from "./StatusPill";

export const CashierOrdersTable = ({ orders = [], onGeneratePayment, onPrintReceipt }) => {
  const sorted = [...orders].sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)) || ((Number(b.orderNumber) || 0) - (Number(a.orderNumber) || 0)));

  return (
    <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292524]">
          <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
            <tr>{["Order", "Timestamp", "Server", "Items Summary", "Total", "Status", "Action"].map((h, i) => (
              <th key={h} className={`px-4 py-3 ${i === 4 || i === 6 ? "text-right" : ""}`}>{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sorted.map((order, idx) => {
              const isPending = order.status === "PENDING";
              const isPaid = order.status === "PAID";
              return (
                <tr key={`${order.id || "ord"}-${idx}`} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-[#5A3E36]">#{order.orderNumber}</td>
                  <td className="px-4 py-3.5 text-stone-500">{order.createdAt}</td>
                  <td className="px-4 py-3.5 font-medium">{order.serverName}</td>
                  <td className="px-4 py-3.5 text-stone-700 max-w-xs"><div className="truncate">{order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}</div></td>
                  <td className="px-4 py-3.5 text-right font-black font-mono text-sm text-[#5A3E36]">{order.total} ETB</td>
                  <td className="px-4 py-3.5"><StatusPill status={order.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {isPending ? (
                      <button type="button" onClick={() => onGeneratePayment(order)} className="px-3 py-1.5 rounded-lg bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <CreditCard className="w-3.5 h-3.5" /><span>Generate Payment</span>
                      </button>
                    ) : isPaid ? (
                      <button type="button" onClick={() => onPrintReceipt(order)} className="px-3 py-1.5 rounded-lg bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Printer className="w-3.5 h-3.5" /><span>PRINT RECEIPT</span>
                      </button>
                    ) : (
                      <button type="button" onClick={() => onGeneratePayment(order)} className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer">
                        <span>Retry</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashierOrdersTable;
