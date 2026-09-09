import { CreditCard, Printer, RotateCw } from "lucide-react";
import { StatusPill } from "./StatusPill";

export const CashierOrderCard = ({
  order,
  onGeneratePayment,
  onPrintReceipt
}) => {
  const isPending = order.status === "PENDING";
  const isPaid = order.status === "PAID";

  return (
    <div
      id={`order-card-${order.orderNumber}`}
      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
        isPending
          ? "border-amber-300 ring-1 ring-amber-200/60"
          : isPaid
          ? "border-[#65A30D]/30"
          : "border-stone-200"
      }`}
    >
      {/* Card Top Row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-[#5A3E36]">
                ORDER #{order.orderNumber}
              </span>
              {isPending && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Action
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#78716C] flex items-center gap-2 mt-0.5">
              <span>{order.createdAt}</span>
              <span>•</span>
              <span>Server: {order.serverName}</span>
            </div>
          </div>

          <div>
            <StatusPill status={order.status} />
          </div>
        </div>

        {/* Items list breakdown */}
        <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#5A3E36]/10 space-y-1.5 mb-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="text-xs text-[#292524] flex items-start justify-between"
            >
              <div>
                <span className="font-semibold text-[#5A3E36]">
                  {item.name}
                </span>
                <span className="text-[#E85D75] font-bold ml-1">
                  × {item.quantity}
                </span>

                {(item.scoops > 0 || item.toppings?.length > 0) && (
                  <div className="text-[11px] text-stone-500 pl-2">
                    {item.scoops > 0 && `${item.scoops} scoop • `}
                    {item.serving}
                    {item.toppings?.length > 0 &&
                      ` • +${item.toppings.join(", ")}`}
                  </div>
                )}
              </div>
              <span className="font-mono text-xs font-semibold text-stone-700">
                {item.totalItemPrice} ETB
              </span>
            </div>
          ))}
          {order.customerNote && (
            <div className="pt-1.5 mt-1 border-t border-[#5A3E36]/10 text-[11px] text-[#78716C] italic">
              Note: &ldquo;{order.customerNote}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Card Bottom: Total & Primary Actions */}
      <div className="pt-2 border-t border-stone-100 space-y-3 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
            TOTAL
          </span>
          <span className="text-xl font-black text-[#5A3E36]">
            {order.total}{" "}
            <span className="text-xs font-semibold text-[#E85D75]">ETB</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {isPending ? (
            <button
              id={`generate-payment-btn-${order.orderNumber}`}
              type="button"
              onClick={() => onGeneratePayment(order)}
              className="w-full py-2.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] active:scale-98 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Generate Payment</span>
            </button>
          ) : isPaid ? (
            <button
              id={`print-receipt-btn-${order.orderNumber}`}
              type="button"
              onClick={() => onPrintReceipt(order)}
              className="w-full py-2.5 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] active:scale-98 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT RECEIPT</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGeneratePayment(order)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Payment / Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierOrderCard;
