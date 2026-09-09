import { Plus, Trash2 } from "lucide-react";

export const ManagerExpensesTab = ({ expenses = [], onOpenAddExpense, onDeleteExpense }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
      <div>
        <h3 className="font-bold text-base text-[#5A3E36]">Business Expense Tracker</h3>
        <p className="text-xs text-[#78716C]">Record supply costs, batch dairy, packaging & wages</p>
      </div>
      <button
        type="button"
        onClick={onOpenAddExpense}
        className="px-4 py-2 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[3]" />
        <span>Record Outflow</span>
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292524]">
          <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Expense Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 font-mono text-right">Amount</th>
              <th className="px-4 py-3">Authorized By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 text-stone-500 font-mono text-[11px]">{exp.date}</td>
                <td className="px-4 py-3 font-bold text-[#5A3E36]">{exp.title}</td>
                <td className="px-4 py-3 text-stone-600">
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#5A3E36] border border-[#5A3E36]/10 font-medium text-[11px]">{exp.category}</span>
                </td>
                <td className="px-4 py-3 text-right font-black font-mono text-sm text-rose-700">-{exp.amount} ETB</td>
                <td className="px-4 py-3 text-stone-600">{exp.approvedBy}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => onDeleteExpense(exp.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer" title="Delete expense">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ManagerExpensesTab;
