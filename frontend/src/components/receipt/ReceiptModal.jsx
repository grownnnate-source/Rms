import React from "react";
import { Printer, X, Copy } from "lucide-react";
export const ReceiptModal = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };
  const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    const textLines = [
      "================================",
      "     CAMPUS SCOOP GELATO        ",
      "  University Student Center L1  ",
      "   Tel: +251 91 122 3344        ",
      "================================",
      `Order #: #${order.orderNumber}`,
      `Date: ${order.createdAt}`,
      `Server: ${order.serverName}`,
      `Cashier: ${order.cashierName || "Dawit K."}`,
      "--------------------------------",
      ...order.items.map(
        (i) => `${i.name} (x${i.quantity}) - ${i.totalItemPrice} ETB`
      ),
      "--------------------------------",
      `Subtotal: ${order.subtotal} ETB`,
      `Campus Tax: ${order.tax} ETB`,
      `TOTAL: ${order.total} ETB`,
      `STATUS: ${order.status}`,
      `CHAPA REF: ${order.chapaTxRef}`,
      "================================",
      "Thank you for your sweet visit! ",
      "================================"
    ].join("\n");
    navigator.clipboard?.writeText(textLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    onClick={onClose}
  >
      <div
    className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[95vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Modal Top Bar */
  }
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-[#FFF9F2]">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#5A3E36]" />
            <h3 className="font-bold text-sm text-[#5A3E36]">Printable Receipt Slip</h3>
          </div>
          <button
    type="button"
    onClick={onClose}
    className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 hover:text-[#5A3E36] hover:bg-stone-200 cursor-pointer"
  >
            <X className="w-4 h-4" />
          </button>
        </div>

        {
    /* Scrollable Receipt Preview */
  }
        <div className="p-6 overflow-y-auto bg-stone-100 flex justify-center">
          
          {
    /* Authentic Thermal Receipt Paper */
  }
          <div
    id="printable-receipt"
    className="w-full max-w-[340px] bg-white p-6 shadow-sm border border-stone-300 font-mono-receipt text-xs text-stone-900 rounded-sm space-y-3 leading-relaxed"
  >
            {
    /* Header */
  }
            <div className="text-center pb-3 border-b border-dashed border-stone-400 space-y-1">
              <h2 className="font-bold text-sm tracking-wider text-black">
                CAMPUS SCOOP GELATO
              </h2>
              <p className="text-[11px] text-stone-600">
                University Student Center, Level 1
              </p>
              <p className="text-[10px] text-stone-500">
                TIN: 0094821034 • Tel: +251 91 122 3344
              </p>
              <div className="pt-1 text-[11px] font-bold">
                *** CASH REGISTER RECEIPT ***
              </div>
            </div>

            {
    /* Order Meta */
  }
            <div className="text-[11px] space-y-0.5 border-b border-dashed border-stone-400 pb-2">
              <div className="flex justify-between">
                <span>ORDER #:</span>
                <span className="font-bold text-black">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{order.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>SERVER:</span>
                <span>{order.serverName}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER:</span>
                <span>{order.cashierName || "Dawit K."}</span>
              </div>
            </div>

            {
    /* Itemized list */
  }
            <div className="space-y-2 border-b border-dashed border-stone-400 pb-3">
              <div className="flex justify-between font-bold text-[10px] text-stone-600 uppercase border-b border-stone-200 pb-1">
                <span>Item / Details</span>
                <span>Amount</span>
              </div>

              {order.items.map((item, idx) => <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium text-black">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>{item.totalItemPrice} ETB</span>
                  </div>

                  {
    /* Options sub-line */
  }
                  <div className="text-[10px] text-stone-600 pl-3">
                    {item.scoops > 0 && `${item.scoops} scoop(s) \u2022 `}
                    {item.serving}
                    {item.toppings.length > 0 && <span className="text-stone-500">
                        {" "}+ {item.toppings.join(", ")}
                      </span>}
                  </div>
                </div>)}
            </div>

            {
    /* Totals */
  }
            <div className="space-y-1 border-b border-dashed border-stone-400 pb-3 text-[11px]">
              <div className="flex justify-between text-stone-600">
                <span>SUBTOTAL:</span>
                <span>{order.subtotal}.00 ETB</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>VAT (5%):</span>
                <span>{order.tax}.00 ETB</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-1 border-t border-stone-300">
                <span>TOTAL PAID:</span>
                <span>{order.total}.00 ETB</span>
              </div>
            </div>

            {
    /* Payment & Chapa Details */
  }
            <div className="space-y-1 border-b border-dashed border-stone-400 pb-3 text-[10px]">
              <div className="flex justify-between">
                <span>PAYMENT METHOD:</span>
                <span className="font-bold">{order.paymentMethod.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT STATUS:</span>
                <span className="font-bold text-black bg-stone-100 px-1 rounded">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-stone-500 truncate">
                <span>CHAPA REF:</span>
                <span className="font-mono text-[9px]">{order.chapaTxRef}</span>
              </div>
              {order.paidAt && <div className="flex justify-between text-stone-500">
                  <span>CLEARED AT:</span>
                  <span>{order.paidAt}</span>
                </div>}
            </div>

            {
    /* Receipt Footer & Barcode Simulation */
  }
            <div className="text-center pt-2 space-y-2">
              {
    /* Clean SVG Barcode */
  }
              <div className="flex justify-center py-1">
                <svg className="w-48 h-10" viewBox="0 0 160 30">
                  {
    /* barcode stripes */
  }
                  <rect x="0" y="0" width="2" height="26" fill="#000" />
                  <rect x="4" y="0" width="1" height="26" fill="#000" />
                  <rect x="7" y="0" width="3" height="26" fill="#000" />
                  <rect x="13" y="0" width="1" height="26" fill="#000" />
                  <rect x="16" y="0" width="2" height="26" fill="#000" />
                  <rect x="21" y="0" width="4" height="26" fill="#000" />
                  <rect x="27" y="0" width="1" height="26" fill="#000" />
                  <rect x="30" y="0" width="2" height="26" fill="#000" />
                  <rect x="34" y="0" width="3" height="26" fill="#000" />
                  <rect x="40" y="0" width="1" height="26" fill="#000" />
                  <rect x="43" y="0" width="4" height="26" fill="#000" />
                  <rect x="49" y="0" width="2" height="26" fill="#000" />
                  <rect x="54" y="0" width="1" height="26" fill="#000" />
                  <rect x="58" y="0" width="3" height="26" fill="#000" />
                  <rect x="64" y="0" width="2" height="26" fill="#000" />
                  <rect x="68" y="0" width="4" height="26" fill="#000" />
                  <rect x="74" y="0" width="1" height="26" fill="#000" />
                  <rect x="78" y="0" width="2" height="26" fill="#000" />
                  <rect x="82" y="0" width="3" height="26" fill="#000" />
                  <rect x="88" y="0" width="1" height="26" fill="#000" />
                  <rect x="91" y="0" width="4" height="26" fill="#000" />
                  <rect x="97" y="0" width="2" height="26" fill="#000" />
                  <rect x="102" y="0" width="1" height="26" fill="#000" />
                  <rect x="106" y="0" width="3" height="26" fill="#000" />
                  <rect x="112" y="0" width="2" height="26" fill="#000" />
                  <rect x="116" y="0" width="4" height="26" fill="#000" />
                  <rect x="122" y="0" width="1" height="26" fill="#000" />
                  <rect x="126" y="0" width="3" height="26" fill="#000" />
                  <rect x="132" y="0" width="2" height="26" fill="#000" />
                  <rect x="136" y="0" width="1" height="26" fill="#000" />
                  <rect x="140" y="0" width="3" height="26" fill="#000" />
                  <rect x="146" y="0" width="2" height="26" fill="#000" />
                  <rect x="150" y="0" width="4" height="26" fill="#000" />
                  <rect x="156" y="0" width="2" height="26" fill="#000" />
                </svg>
              </div>
              <p className="text-[10px] text-stone-600 font-bold uppercase tracking-wider">
                Thank you for your visit!
              </p>
              <p className="text-[9px] text-stone-500">
                Freshly churned daily at University Dessert Lab.
              </p>
            </div>

          </div>

        </div>

        {
    /* Modal Actions */
  }
        <div className="no-print p-4 border-t border-stone-200 bg-white flex items-center justify-between gap-3">
          <button
    type="button"
    onClick={handleCopyText}
    className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
  >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer"
  >
              Close
            </button>
            <button
    id="print-thermal-receipt-btn"
    type="button"
    onClick={handlePrint}
    className="px-5 py-2 text-xs font-bold text-white bg-[#5A3E36] hover:bg-[#47302a] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
  >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>;
};
