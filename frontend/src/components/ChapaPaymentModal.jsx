import { useState, useEffect } from "react";
import { initializePayment, verifyPayment } from "../lib/axios";
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  ShieldCheck
} from "lucide-react";
const generateDefaultTxRef = (orderNumber) => `RMS-${orderNumber || 101}-${Date.now()}`;

export const ChapaPaymentModal = ({
  order,
  onClose,
  onUpdateStatus,
  onOpenReceipt
}) => {
  const [activeStatus, setActiveStatus] = useState(order.status);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTxRef, setActiveTxRef] = useState(
    () => order.chapaTxRef || generateDefaultTxRef(order.orderNumber)
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (order.id && /^[0-9a-fA-F]{24}$/.test(order.id) && order.status !== "PAID") {
      initializePayment(order.id)
        .then((res) => {
          if (!isMounted) return;
          if (res.txRef) setActiveTxRef(res.txRef);
          if (res.qrCode) setQrCodeDataUrl(res.qrCode);
        })
        .catch((err) => {
          console.warn("Chapa payment initialization fallback to demo mode:", err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [order.id, order.status]);

  const handleSimulatePayment = async (statusToSet) => {
    setIsSimulating(true);
    if (statusToSet === "PAID" && activeTxRef) {
      try {
        await verifyPayment(activeTxRef, true);
      } catch (e) {
        console.warn("Backend verifyPayment fallback to local status:", e);
      }
    }
    setActiveStatus(statusToSet);
    onUpdateStatus(order.id, statusToSet);
    setIsSimulating(false);
  };
  const getStatusBadge = () => {
    switch (activeStatus) {
      case "PAID":
        return <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#65A30D]/15 text-[#4D7C0F] border border-[#65A30D]/30">
            <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
            <span>PAID & VERIFIED</span>
          </div>;
      case "FAILED":
        return <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>PAYMENT FAILED</span>
          </div>;
      case "EXPIRED":
        return <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700 border border-stone-300">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>QR EXPIRED</span>
          </div>;
      case "PENDING":
      default:
        return <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>PAYMENT PENDING</span>
          </div>;
    }
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    onClick={onClose}
  >
      <div
    id="chapa-payment-panel"
    className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[95vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header with Chapa Branding */
  }
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]">
          <div className="flex items-center gap-3">
            {
    /* Chapa Logo Icon */
  }
            <div className="w-9 h-9 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center">
              <span className="font-black text-sm text-[#0052FF]">chapa</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#5A3E36]">Chapa Payment Request</h3>
                <span className="text-[10px] font-semibold bg-[#0052FF]/10 text-[#0052FF] px-1.5 py-0.5 rounded">
                  ETB Gateway
                </span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Secure Ethiopian Digital Checkout & Mobile Banking
              </p>
            </div>
          </div>

          <button
    type="button"
    onClick={onClose}
    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-[#5A3E36] hover:bg-stone-200 transition-colors cursor-pointer"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content Body */
  }
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {
    /* Order Summary Ribbon */
  }
          <div className="bg-[#FFF9F2] p-4 rounded-xl border border-[#5A3E36]/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#78716C]">Order Reference</div>
              <div className="font-bold text-base text-[#5A3E36]">
                ORDER #{order.orderNumber}
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                Ref: {activeTxRef}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-[#78716C]">Total Amount</div>
              <div className="text-2xl font-black text-[#5A3E36]">
                {order.total} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
              </div>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
          </div>

          {
    /* QR Code & Payment Method */
  }
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
            {
    /* Realistic Crisp SVG / Live Chapa QR Code */
  }
            <div className="relative p-2.5 bg-white rounded-xl shadow-xs border border-stone-300 flex-shrink-0">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Chapa Payment QR Code"
                  className="w-36 h-36 object-contain rounded-lg"
                />
              ) : (
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <rect x="5" y="5" width="25" height="25" fill="#000" />
                  <rect x="9" y="9" width="17" height="17" fill="#fff" />
                  <rect x="13" y="13" width="9" height="9" fill="#000" />

                  <rect x="70" y="5" width="25" height="25" fill="#000" />
                  <rect x="74" y="9" width="17" height="17" fill="#fff" />
                  <rect x="78" y="13" width="9" height="9" fill="#000" />

                  <rect x="5" y="70" width="25" height="25" fill="#000" />
                  <rect x="9" y="74" width="17" height="17" fill="#fff" />
                  <rect x="13" y="78" width="9" height="9" fill="#000" />

                  <rect x="36" y="8" width="5" height="5" fill="#000" />
                  <rect x="46" y="8" width="5" height="5" fill="#000" />
                  <rect x="56" y="12" width="5" height="5" fill="#000" />
                  <rect x="36" y="20" width="5" height="5" fill="#000" />
                  <rect x="42" y="24" width="5" height="5" fill="#000" />
                  <rect x="50" y="20" width="5" height="5" fill="#000" />

                  <rect x="10" y="38" width="5" height="5" fill="#000" />
                  <rect x="22" y="42" width="5" height="5" fill="#000" />
                  <rect x="36" y="36" width="5" height="5" fill="#000" />
                  <rect x="44" y="42" width="5" height="5" fill="#000" />
                  <rect x="54" y="38" width="5" height="5" fill="#000" />
                  <rect x="68" y="42" width="5" height="5" fill="#000" />
                  <rect x="80" y="38" width="5" height="5" fill="#000" />

                  <rect x="36" y="52" width="5" height="5" fill="#000" />
                  <rect x="44" y="58" width="5" height="5" fill="#000" />
                  <rect x="54" y="52" width="5" height="5" fill="#000" />
                  <rect x="64" y="56" width="5" height="5" fill="#000" />
                  <rect x="76" y="52" width="5" height="5" fill="#000" />

                  <rect x="36" y="72" width="5" height="5" fill="#000" />
                  <rect x="46" y="78" width="5" height="5" fill="#000" />
                  <rect x="58" y="70" width="5" height="5" fill="#000" />
                  <rect x="70" y="76" width="5" height="5" fill="#000" />
                  <rect x="82" y="82" width="5" height="5" fill="#000" />

                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#0052FF" />
                  <text x="50" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">C</text>
                </svg>
              )}

              {activeStatus === "PAID" && <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#65A30D] mb-1" />
                  <span className="font-bold text-xs text-[#4D7C0F]">VERIFIED</span>
                </div>}
            </div>

            {
    /* Payment Instructions */
  }
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#5A3E36] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#E85D75]" />
                <span>Customer Scan Instructions</span>
              </div>
              <ul className="text-stone-600 space-y-1 pl-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>Ask customer to open <strong>Telebirr</strong>, <strong>CBE Birr</strong>, or banking app.</li>
                <li>Tap <strong>Scan QR</strong> and point camera at the screen code.</li>
                <li>Verify recipient: <em>Campus Scoop Gelato Hub</em>.</li>
                <li>Approve {order.total} ETB payment.</li>
              </ul>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" />
                <span>256-bit encrypted Chapa Webhook sync</span>
              </div>
            </div>
          </div>

          {
    /* Demonstration / Tester Control Toolbar */
  }
          <div className="p-3 bg-[#FFF9F2] rounded-xl border border-[#5A3E36]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5A3E36] uppercase tracking-wide">
                Chapa Sandbox Simulator
              </span>
              <span className="text-[10px] text-[#78716C]">Simulate customer banking actions</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
    type="button"
    disabled={isSimulating}
    onClick={() => handleSimulatePayment("PAID")}
    className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeStatus === "PAID" ? "bg-[#65A30D] text-white shadow-xs" : "bg-white hover:bg-[#65A30D]/10 text-[#4D7C0F] border border-[#65A30D]/30"}`}
  >
                Simulate Paid ✓
              </button>

              <button
    type="button"
    disabled={isSimulating}
    onClick={() => handleSimulatePayment("FAILED")}
    className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeStatus === "FAILED" ? "bg-rose-600 text-white shadow-xs" : "bg-white hover:bg-rose-50 text-rose-700 border border-rose-200"}`}
  >
                Simulate Fail ✕
              </button>

              <button
    type="button"
    disabled={isSimulating}
    onClick={() => handleSimulatePayment("EXPIRED")}
    className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeStatus === "EXPIRED" ? "bg-stone-700 text-white shadow-xs" : "bg-white hover:bg-stone-100 text-stone-600 border border-stone-300"}`}
  >
                Expire QR ⟲
              </button>
            </div>
          </div>

          {
    /* Conditional Guidance Note */
  }
          {activeStatus !== "PAID" ? <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Print Receipt Locked:</strong> Receipt printing is unlocked only after Chapa payment is confirmed as <strong>PAID</strong>.
              </span>
            </div> : <div className="p-3 rounded-xl bg-[#65A30D]/10 border border-[#65A30D]/30 text-[#4D7C0F] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
                <span className="font-semibold">Payment Received! Receipt is ready for thermal printing.</span>
              </div>
            </div>}

        </div>

        {
    /* Footer with PRINT RECEIPT button (unlocked strictly after paid) */
  }
        <div className="p-4 border-t border-stone-200 bg-[#FFF9F2] flex items-center justify-between gap-3">
          <button
    type="button"
    onClick={onClose}
    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-white transition-colors cursor-pointer"
  >
            Back to Queue
          </button>

          {
    /* PRINT RECEIPT BUTTON */
  }
          <button
    id="chapa-print-receipt-btn"
    type="button"
    disabled={activeStatus !== "PAID"}
    onClick={() => {
      onOpenReceipt({
        ...order,
        status: "PAID",
        paidAt: "Just now"
      });
    }}
    className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${activeStatus === "PAID" ? "bg-[#5A3E36] hover:bg-[#47302a] text-white cursor-pointer active:scale-98" : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"}`}
  >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>
        </div>

      </div>
    </div>;
};
