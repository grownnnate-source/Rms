import { useState, useEffect } from "react";
import { initializePayment, verifyPayment } from "../lib/axios";
import { X, Printer, CheckCircle2, AlertCircle, Clock, Smartphone, ShieldCheck } from "lucide-react";

const STATUS_BADGES = {
  PAID: { label: "PAID & VERIFIED", icon: CheckCircle2, cls: "bg-[#65A30D]/15 text-[#4D7C0F] border-[#65A30D]/30" },
  FAILED: { label: "PAYMENT FAILED", icon: AlertCircle, cls: "bg-rose-100 text-rose-700 border-rose-200" },
  EXPIRED: { label: "QR EXPIRED", icon: Clock, cls: "bg-stone-200 text-stone-700 border-stone-300" },
  PENDING: { label: "PAYMENT PENDING", icon: null, cls: "bg-amber-100 text-amber-800 border-amber-300" }
};

export const ChapaPaymentModal = ({ order, onClose, onUpdateStatus, onOpenReceipt }) => {
  const [activeStatus, setActiveStatus] = useState(order.status);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTxRef, setActiveTxRef] = useState(() => order.chapaTxRef || `RMS-${order.orderNumber || 101}-${Date.now()}`);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (order.id && /^[0-9a-fA-F]{24}$/.test(order.id) && order.status !== "PAID") {
      initializePayment(order.id).then((res) => {
        if (!mounted) return;
        if (res.txRef) setActiveTxRef(res.txRef);
        if (res.qrCode) setQrCodeDataUrl(res.qrCode);
      }).catch((err) => console.warn("Chapa payment init fallback:", err));
    }
    return () => { mounted = false; };
  }, [order.id, order.status]);

  const handleSimulatePayment = async (statusToSet) => {
    setIsSimulating(true);
    if (statusToSet === "PAID" && activeTxRef) {
      try { await verifyPayment(activeTxRef, true); } catch (e) { console.warn(e); }
    }
    setActiveStatus(statusToSet);
    onUpdateStatus(order.id, statusToSet);
    setIsSimulating(false);
  };

  const badge = STATUS_BADGES[activeStatus] || STATUS_BADGES.PENDING;
  const BadgeIcon = badge.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div id="chapa-payment-panel" className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center font-black text-sm text-[#0052FF]">chapa</div>
            <div>
              <div className="flex items-center gap-2"><h3 className="font-bold text-sm text-[#5A3E36]">Chapa Payment Request</h3><span className="text-[10px] font-semibold bg-[#0052FF]/10 text-[#0052FF] px-1.5 py-0.5 rounded">ETB Gateway</span></div>
              <p className="text-[11px] text-[#78716C]">Secure Ethiopian Digital Checkout & Mobile Banking</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-[#5A3E36] hover:bg-stone-200 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="bg-[#FFF9F2] p-4 rounded-xl border border-[#5A3E36]/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#78716C]">Order Reference</div>
              <div className="font-bold text-base text-[#5A3E36]">ORDER #{order.orderNumber}</div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">Ref: {activeTxRef}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#78716C]">Total Amount</div>
              <div className="text-2xl font-black text-[#5A3E36]">{order.total} <span className="text-xs font-bold text-[#E85D75]">ETB</span></div>
              <div className="mt-1">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.cls}`}>
                  {BadgeIcon ? <BadgeIcon className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                  <span>{badge.label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
            <div className="relative p-2.5 bg-white rounded-xl shadow-xs border border-stone-300 shrink-0">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Chapa Payment QR Code" className="w-36 h-36 object-contain rounded-lg" />
              ) : (
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  {[[5, 5], [70, 5], [5, 70]].map(([x, y], i) => (
                    <g key={i}><rect x={x} y={y} width="25" height="25" fill="#000" /><rect x={x + 4} y={y + 4} width="17" height="17" fill="#fff" /><rect x={x + 8} y={y + 8} width="9" height="9" fill="#000" /></g>
                  ))}
                  {[[36,8],[46,8],[56,12],[36,20],[42,24],[50,20],[10,38],[22,42],[36,36],[44,42],[54,38],[68,42],[80,38],[36,52],[44,58],[54,52],[64,56],[76,52],[36,72],[46,78],[58,70],[70,76],[82,82]].map(([x, y], i) => (
                    <rect key={i} x={x} y={y} width="5" height="5" fill="#000" />
                  ))}
                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#0052FF" />
                  <text x="50" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">C</text>
                </svg>
              )}
              {activeStatus === "PAID" && (
                <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#65A30D] mb-1" />
                  <span className="font-bold text-xs text-[#4D7C0F]">VERIFIED</span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#5A3E36] flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-[#E85D75]" /><span>Customer Scan Instructions</span></div>
              <ul className="text-stone-600 space-y-1 pl-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>Ask customer to open <strong>Telebirr</strong>, <strong>CBE Birr</strong>, or banking app.</li>
                <li>Tap <strong>Scan QR</strong> and point camera at the screen code.</li>
                <li>Verify recipient: <em>Campus Scoop Gelato Hub</em>.</li>
                <li>Confirm amount <strong>{order.total} ETB</strong> and complete PIN entry.</li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold"><ShieldCheck className="w-4 h-4 text-[#0052FF]" /><span>Cashier Terminal Simulation</span></div>
              <span className="text-[10px] bg-stone-200 text-stone-700 font-mono px-2 py-0.5 rounded">Mock Hook</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" disabled={isSimulating || activeStatus === "PAID"} onClick={() => handleSimulatePayment("PAID")} className="flex-1 py-2 px-3 bg-[#65A30D] hover:bg-[#558b0b] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">Simulate Live PAID</button>
              <button type="button" disabled={isSimulating} onClick={() => handleSimulatePayment("FAILED")} className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 transition-all cursor-pointer">Fail</button>
              <button type="button" disabled={isSimulating} onClick={() => handleSimulatePayment("EXPIRED")} className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition-all cursor-pointer">Expire</button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-[#5A3E36]/10 bg-[#FFF9F2] flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#5A3E36] hover:bg-[#5A3E36]/10 rounded-xl border border-[#5A3E36]/20 cursor-pointer">Close Terminal</button>
          {activeStatus === "PAID" && onOpenReceipt && (
            <button type="button" onClick={() => { onClose(); onOpenReceipt(order); }} className="px-4 py-2 text-xs font-bold bg-[#5A3E36] hover:bg-[#432d27] text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /><span>Print Receipt Slip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapaPaymentModal;
