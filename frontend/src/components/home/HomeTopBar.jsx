import { Search, RotateCcw, CheckCircle2 } from "lucide-react";

export const HomeTopBar = ({
  nextOrderNumber,
  searchQuery,
  setSearchQuery,
  onClearCart,
  hasCartItems,
  showSubmissionSuccess,
  lastSubmittedOrder,
  onDismissSuccess
}) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 font-mono text-sm font-bold text-[#5A3E36]">
          Active Order #{nextOrderNumber}
        </div>
        <span className="text-xs text-[#78716C] hidden md:inline">Tap flavor cards to configure scoops & toppings with 1-touch dispatch.</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavor, toppings..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] placeholder:text-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#5A3E36] cursor-pointer">&times;</button>
          )}
        </div>

        <button
          type="button"
          onClick={onClearCart}
          disabled={!hasCartItems}
          className="px-3 py-1.5 text-xs font-semibold text-[#78716C] hover:text-[#E85D75] disabled:opacity-30 disabled:hover:text-[#78716C] flex items-center gap-1.5 rounded-xl border border-stone-200 hover:border-[#E85D75]/30 transition-colors cursor-pointer"
          title="Clear current cart and start fresh"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>

    {showSubmissionSuccess && lastSubmittedOrder && (
      <div className="mb-4 p-3.5 rounded-xl bg-[#65A30D]/15 border border-[#65A30D]/30 text-[#4D7C0F] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#65A30D]" />
          <div>
            <span className="font-bold text-sm">Order #{lastSubmittedOrder.orderNumber} submitted to Cashier!</span>
            <span className="text-xs text-stone-700 ml-2">Total: {lastSubmittedOrder.total} ETB &bull; Cashier can now generate payment.</span>
          </div>
        </div>
        <button type="button" onClick={onDismissSuccess} className="text-xs font-semibold underline text-[#4D7C0F] cursor-pointer">
          Dismiss
        </button>
      </div>
    )}
  </>
);

export default HomeTopBar;
