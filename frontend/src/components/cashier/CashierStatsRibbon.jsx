export const CashierStatsRibbon = ({ pendingCount = 0, paidCount = 0, totalSettledToday = 0 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
      <div className="text-xs text-[#78716C]">Payment Pending Queue</div>
      <div className="text-2xl font-black text-[#5A3E36] mt-1 flex items-center gap-2">
        <span>{pendingCount}</span>
        {pendingCount > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">Action Required</span>}
      </div>
    </div>
    <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
      <div className="text-xs text-[#78716C]">Settled Orders Today</div>
      <div className="text-2xl font-black text-[#65A30D] mt-1">{paidCount}</div>
    </div>
    <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
      <div className="text-xs text-[#78716C]">Cashier Revenue Cleared</div>
      <div className="text-2xl font-black text-[#5A3E36] mt-1">{totalSettledToday} <span className="text-xs font-bold text-[#E85D75]">ETB</span></div>
    </div>
    <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex items-center justify-between">
      <div>
        <div className="text-xs text-[#78716C]">Chapa Gateway Node</div>
        <div className="text-xs font-bold text-[#0052FF] mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
          <span>Telebirr / CBE Live</span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center font-bold text-xs">ET</div>
    </div>
  </div>
);
