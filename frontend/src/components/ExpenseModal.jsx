import { useState } from "react";
import { X } from "lucide-react";
const EXPENSE_CATEGORIES = [
  { label: "Ingredients (Dairy & Flavors)", value: "Ingredients" },
  { label: "Supplies (Cones, Cups & Packaging)", value: "Supplies" },
  { label: "Utilities (Power & Freezers)", value: "Utilities" },
  { label: "Maintenance (Chiller & Equipment)", value: "Maintenance" },
  { label: "Other Operating Expenses", value: "Other" }
];
export const ExpenseModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Ingredients");
  const [amount, setAmount] = useState(500);
  const [date, setDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [approvedBy, setApprovedBy] = useState("Prof. Selamawit");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;
    const newExpense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      status: "Paid",
      approvedBy
    };
    onSave(newExpense);
    onClose();
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    onClick={onClose}
  >
      <div
    className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col"
    onClick={(e) => e.stopPropagation()}
  >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FFF9F2]">
          <h3 className="font-bold text-base text-[#5A3E36]">Record Business Expense</h3>
          <button
    type="button"
    onClick={onClose}
    className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer"
  >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5A3E36] mb-1">
              Expense Item Title *
            </label>
            <input
    type="text"
    required
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Sugar & Glucose Syrup Supply (25kg)"
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Amount (ETB) *
              </label>
              <input
    type="number"
    min="10"
    step="10"
    required
    value={amount}
    onChange={(e) => setAmount(Number(e.target.value))}
    className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Date
              </label>
              <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white text-[#292524]"
  />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Authorized By
              </label>
              <input
    type="text"
    value={approvedBy}
    onChange={(e) => setApprovedBy(e.target.value)}
    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white text-[#292524]"
  />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer"
  >
              Cancel
            </button>
            <button
    type="submit"
    className="px-5 py-2 text-xs font-bold text-white bg-[#5A3E36] hover:bg-[#47302a] rounded-xl shadow-xs transition-all cursor-pointer"
  >
              Record Outflow
            </button>
          </div>
        </form>
      </div>
    </div>;
};
