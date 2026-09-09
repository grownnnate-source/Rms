import { Search, Printer } from "lucide-react";

export const ManagerOrdersTab = ({ orders = [], orderSearch, setOrderSearch, onSelectReceiptOrder }) => {
  const filtered = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return !q || String(o.orderNumber).includes(q) || o.serverName?.toLowerCase().includes(q) || o.items?.some((i) => i.name?.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
        <div><h3 className="font-bold text-base text-[#5A3E36]">Customer Orders Log</h3><p className="text-xs text-[#78716C]">Search and audit all historical POS orders</p></div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order #, customer, flavor..." className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#E85D75]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#292524]">
            <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
              <tr>{["Order #", "Time", "Server", "Items Ordered", "Total (ETB)", "Payment Method", "Status", "Receipt"].map((h, i) => (
                <th key={h} className={`px-4 py-3 ${i === 4 || i === 7 ? "text-right" : ""}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((o, idx) => (
                <tr key={`${o.id || "mgr-ord"}-${idx}`} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-bold font-mono text-[#5A3E36]">#{o.orderNumber}</td>
                  <td className="px-4 py-3 text-stone-500 font-mono text-[11px]">{o.createdAt}</td>
                  <td className="px-4 py-3 font-medium">{o.serverName}</td>
                  <td className="px-4 py-3 text-stone-700 max-w-xs"><div className="truncate">{o.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}</div></td>
                  <td className="px-4 py-3 text-right font-black font-mono text-[#5A3E36]">{o.total} ETB</td>
                  <td className="px-4 py-3 text-stone-600 font-mono text-[11px]">{(o.paymentMethod || "CHAPA_QR").replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === "PAID" ? "bg-[#65A30D]/15 text-[#4D7C0F]" : o.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-stone-200 text-stone-700"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => onSelectReceiptOrder(o)} className="px-2.5 py-1 rounded-lg bg-[#FFF9F2] hover:bg-[#5A3E36] text-[#5A3E36] hover:text-white font-bold text-[11px] border border-[#5A3E36]/15 transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <Printer className="w-3 h-3" /><span>View Receipt</span>
                    </button>
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

export default ManagerOrdersTab;
