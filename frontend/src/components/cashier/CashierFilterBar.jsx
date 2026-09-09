import { Search, Grid, List } from "lucide-react";

export const CashierFilterBar = ({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  totalOrdersCount = 0,
  pendingCount = 0,
  paidCount = 0,
  failedCount = 0
}) => {
  const filterOptions = [
    { id: "ALL", label: "All Incoming", count: totalOrdersCount },
    { id: "PENDING", label: "Pending Payment", count: pendingCount },
    { id: "PAID", label: "Paid & Completed", count: paidCount },
    { id: "FAILED", label: "Failed / Expired", count: failedCount }
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Status Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {filterOptions.map((f) => {
          const isActive = filterStatus === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#5A3E36] text-white shadow-xs"
                  : "bg-[#FFF9F2] text-[#78716C] hover:text-[#5A3E36] border border-[#5A3E36]/10"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-white text-stone-600"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Layout View Mode */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, items, server..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] placeholder:text-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
          />
        </div>

        <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-[#5A3E36] shadow-2xs"
                : "text-[#78716C]"
            }`}
            title="Cards Layout"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-[#5A3E36] shadow-2xs"
                : "text-[#78716C]"
            }`}
            title="Dense Table Layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashierFilterBar;
