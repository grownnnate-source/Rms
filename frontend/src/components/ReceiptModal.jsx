import { useState } from "react";
import { Printer, X, Copy, Check } from "lucide-react";

export const ReceiptModal = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    const textLines = [
      "================================\n     CAMPUS SCOOP GELATO        \n  University Student Center L1  \n   Tel: +251 91 122 3344        \n================================",
      `Order #: #${order.orderNumber}\nDate: ${order.createdAt}\nServer: ${order.serverName}\nCashier: ${order.cashierName || "Counter Cashier"}`,
      "--------------------------------",
      ...order.items.map((i) => `${i.name} (x${i.quantity}) - ${i.totalItemPrice} ETB`),
      "--------------------------------",
      `Subtotal: ${order.subtotal} ETB\nCampus Tax: ${order.tax} ETB\nTOTAL: ${order.total} ETB\nSTATUS: ${order.status}\nCHAPA REF: ${order.chapaTxRef}`,
      "================================\nThank you for your sweet visit! \n================================"
    ].join("\n");
    navigator.clipboard?.writeText(textLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-[#FFF9F2]">
          <div className="flex items-center gap-2"><Printer className="w-4 h-4 text-[#5A3E36]" /><h3 className="font-bold text-sm text-[#5A3E36]">Printable Receipt Slip</h3></div>
          <button type="button" onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 hover:text-[#5A3E36] hover:bg-stone-200 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto bg-stone-100 flex justify-center">
          <div id="printable-receipt" className="w-full max-w-[340px] bg-white p-6 shadow-sm border border-stone-300 font-mono text-xs text-stone-900 rounded-sm space-y-3 leading-relaxed">
            <div className="text-center pb-3 border-b border-dashed border-stone-400 space-y-1">
              <h2 className="font-bold text-sm tracking-wider text-black">CAMPUS SCOOP GELATO</h2>
              <p className="text-[11px] text-stone-600">University Student Center, Level 1</p>
              <p className="text-[10px] text-stone-500">TIN: 0094821034 &bull; Tel: +251 91 122 3344</p>
              <div className="pt-1 text-[11px] font-bold">*** CASH REGISTER RECEIPT ***</div>
            </div>

            <div className="text-[11px] space-y-0.5 border-b border-dashed border-stone-400 pb-2">
              <div className="flex justify-between"><span>ORDER #:</span><span className="font-bold text-black">#{order.orderNumber}</span></div>
              <div className="flex justify-between"><span>DATE:</span><span>{order.createdAt}</span></div>
              <div className="flex justify-between"><span>SERVER:</span><span>{order.serverName}</span></div>
              <div className="flex justify-between"><span>CASHIER:</span><span>{order.cashierName || "Counter Cashier"}</span></div>
            </div>

            <div className="space-y-2 py-1 border-b border-dashed border-stone-400">
              <div className="text-[10px] uppercase font-bold text-stone-500 flex justify-between"><span>ITEM DESCRIPTION</span><span>TOTAL</span></div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-black"><span>{item.name}</span><span>{item.totalItemPrice} ETB</span></div>
                  <div className="text-[10px] text-stone-600 flex justify-between pl-1"><span>{item.serving} (x{item.quantity})</span><span>@{item.unitPrice}</span></div>
                  {item.toppings?.length > 0 && <div className="text-[10px] text-stone-500 italic pl-2">+ {item.toppings.join(", ")}</div>}
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 border-b border-dashed border-stone-400 pb-2 text-[11px]">
              <div className="flex justify-between"><span>SUBTOTAL:</span><span>{order.subtotal} ETB</span></div>
              <div className="flex justify-between"><span>CAMPUS VAT (15%):</span><span>{order.tax} ETB</span></div>
              <div className="flex justify-between text-base font-black text-black pt-1 border-t border-stone-200"><span>TOTAL AMOUNT:</span><span>{order.total} ETB</span></div>
            </div>

            <div className="text-[10px] space-y-0.5 text-stone-600 border-b border-dashed border-stone-400 pb-2">
              <div className="flex justify-between"><span>SETTLEMENT:</span><span className="font-bold uppercase text-black">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span>TX REF:</span><span className="font-mono">{order.chapaTxRef}</span></div>
              <div className="flex justify-between"><span>STATUS:</span><span className="font-bold text-[#4D7C0F]">PAID &bull; VERIFIED</span></div>
            </div>

            <div className="text-center pt-2 space-y-1 text-[10px] text-stone-500">
              <p className="font-bold text-stone-800">THANK YOU FOR YOUR VISIT!</p>
              <p>Keep this receipt for university rewards points</p>
              <p className="font-mono pt-1">*** END OF FISCAL SLIP ***</p>
            </div>
          </div>
        </div>

        <div className="no-print p-4 border-t border-stone-200 bg-[#FFF9F2] flex items-center justify-between gap-3">
          <button type="button" onClick={handleCopyText} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5 text-[#65A30D]" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-bold text-[#5A3E36] hover:bg-[#5A3E36]/10 rounded-xl cursor-pointer">Done</button>
            <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#5A3E36] hover:bg-[#432d27] rounded-xl shadow-xs cursor-pointer">
              <Printer className="w-3.5 h-3.5" /><span>Print ESC/POS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
