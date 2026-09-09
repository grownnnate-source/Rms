import { Plus } from "lucide-react";
import { ProductIcon } from "../ProductIcon";

const DEFAULT_CUP_SIZES = [{ size: "sm", price: 20 }, { size: "md", price: 35 }, { size: "L", price: 50 }, { size: "XL", price: 70 }];

export const ProductCard = ({ product, onProductClick, onAddCupWithSize }) => {
  const isIceCream = product.category === "ice_cream";
  const isCone = product.category === "cones";
  const isCup = product.category === "cups";
  const cupSizes = product.sizes?.length > 0 ? product.sizes : DEFAULT_CUP_SIZES;

  return (
    <div
      id={`prod-card-${product.id}`}
      className={`relative bg-white rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
        product.available ? "border-[#5A3E36]/10 shadow-xs hover:shadow-md hover:border-[#5A3E36]/25 group" : "border-stone-200 opacity-60 bg-stone-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <ProductIcon category={product.category} iconName={product.iconName} colorAccent={product.colorAccent} className="w-7 h-7" />
        <div className="flex flex-col items-end">
          {product.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F58FA3]/20 text-[#5A3E36] border border-[#F58FA3]/30 mb-1">{product.badge}</span>}
          {!product.available && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">Unavailable</span>}
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-bold text-sm text-[#5A3E36] group-hover:text-[#E85D75] transition-colors leading-snug">{product.name}</h3>
        <p className="text-xs text-[#78716C] line-clamp-2 mt-1">{product.description}</p>
        {isCup && (
          <div className="mt-2.5 pt-2.5 border-t border-dashed border-[#5A3E36]/15">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#5A3E36] mb-1.5">
              <span>Cup Sizes:</span><span className="text-[10px] text-[#78716C]">Tap size to add</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {cupSizes.map((sz) => (
                <button
                  key={sz.size} type="button" disabled={!product.available} onClick={() => onAddCupWithSize(product, sz)}
                  className="px-2 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-[#E85D75] text-[#5A3E36] hover:text-white border border-[#5A3E36]/15 hover:border-[#E85D75] transition-all flex items-center justify-between text-xs cursor-pointer shadow-2xs group/btn disabled:opacity-40"
                  title={`Add ${sz.size.toUpperCase()} cup (${sz.price} ETB)`}
                >
                  <span className="font-bold uppercase text-[11px]">{sz.size}</span>
                  <span className="font-bold text-[11px] text-[#E85D75] group-hover/btn:text-white">{sz.price} ETB</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#5A3E36]/5 mt-auto">
        <div>
          {isCone ? (
            <div className="flex items-center gap-1"><span className="text-base font-black text-[#65A30D]">FREE</span><span className="text-[11px] font-semibold text-[#78716C]">(0 ETB)</span></div>
          ) : isCup ? (
            <div><span className="text-[11px] text-[#78716C]">From</span> <span className="text-base font-black text-[#5A3E36]">20</span><span className="text-xs font-semibold text-[#E85D75] ml-1">ETB</span></div>
          ) : (
            <div><span className="text-base font-black text-[#5A3E36]">{product.price}</span><span className="text-xs font-semibold text-[#E85D75] ml-1">ETB</span>{isIceCream && <span className="text-[10px] text-[#78716C] ml-0.5">/ scoop</span>}</div>
          )}
        </div>
        <button
          type="button" disabled={!product.available} onClick={() => onProductClick(product)}
          className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] hover:bg-[#E85D75] text-[#5A3E36] hover:text-white font-bold text-xs border border-[#5A3E36]/15 hover:border-[#E85D75] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isIceCream ? "Customize" : isCone ? "Add (Free)" : isCup ? "Add (sm)" : "Add"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
