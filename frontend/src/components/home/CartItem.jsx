import { Plus, Minus, Trash2 } from "lucide-react";

export const CartItem = ({ item, onUpdateQty, onRemove }) => (
  <div className="p-3 rounded-xl bg-[#FFF9F2]/80 border border-[#5A3E36]/10 flex flex-col gap-2 relative group">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 pr-6">
        <div className="font-bold text-xs text-[#5A3E36] leading-tight">{item.name}</div>
        <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
          {item.scoops > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-white text-[#5A3E36] font-medium border border-[#5A3E36]/10">
              {item.scoops} {item.scoops === 1 ? "scoop" : "scoops"}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded bg-white text-[#5A3E36] font-medium border border-[#5A3E36]/10">{item.serving}</span>
          {item.toppings?.map((top) => (
            <span key={top} className="px-1.5 py-0.5 rounded bg-[#F58FA3]/20 text-[#5A3E36] font-medium">
              +{top.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => onRemove(item.id)} className="text-stone-400 hover:text-[#E85D75] transition-colors p-1 cursor-pointer absolute right-2 top-2" title="Remove item">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>

    <div className="flex items-center justify-between pt-1 border-t border-[#5A3E36]/5">
      <div className="flex items-center bg-white rounded-lg border border-[#5A3E36]/15 p-0.5">
        <button type="button" onClick={() => onUpdateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center text-[#5A3E36] hover:bg-[#FFF9F2] cursor-pointer">
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs font-bold text-[#5A3E36] w-6 text-center">{item.quantity}</span>
        <button type="button" onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center text-[#5A3E36] hover:bg-[#FFF9F2] cursor-pointer">
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <div className="font-mono font-bold text-xs text-[#5A3E36]">
        {item.totalItemPrice} <span className="text-[10px] text-[#E85D75]">ETB</span>
      </div>
    </div>
  </div>
);

export default CartItem;
