import { Calendar, Plus } from "lucide-react";

export const ManagerHeader = ({
  activeTab,
  onOpenAddProduct,
  onOpenAddExpense
}) => {
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <header className="px-6 py-4 border-b border-[#5A3E36]/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#5A3E36] capitalize">
            {activeTab === "dashboard" ? "Business Overview" : activeTab}
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F58FA3]/20 text-[#5A3E36]">
            Term II
          </span>
        </div>
        <p className="text-xs text-[#78716C]">
          Real-time operational stream from Server tablets and Cashier counter
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#78716C] bg-[#FFF9F2] px-3 py-1.5 rounded-xl border border-[#5A3E36]/10">
          <Calendar className="w-3.5 h-3.5 text-[#E85D75]" />
          <span>Today: {currentDateFormatted}</span>
        </div>

        {activeTab === "products" && (
          <button
            id="manager-add-product-btn"
            type="button"
            onClick={onOpenAddProduct}
            className="px-3 py-1.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Product</span>
          </button>
        )}

        {activeTab === "expenses" && (
          <button
            id="manager-add-expense-btn"
            type="button"
            onClick={onOpenAddExpense}
            className="px-3 py-1.5 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Record Expense</span>
          </button>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-xl bg-[#5A3E36] text-[#FFF9F2] font-bold text-xs flex items-center justify-center shadow-xs">
            SH
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#5A3E36]">
              Prof. Selamawit H.
            </div>
            <div className="text-[10px] text-[#78716C]">Store Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
