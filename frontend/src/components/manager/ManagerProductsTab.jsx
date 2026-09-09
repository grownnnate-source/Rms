import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { ProductIcon } from "../ProductIcon";

const PRODUCT_CATEGORIES = ["ALL", "ice_cream", "toppings", "cones", "cups", "drinks"];

export const ManagerProductsTab = ({
  products = [], productCategoryFilter, setProductCategoryFilter, productSearch,
  setProductSearch, onOpenAddProduct, onEditProduct, onDeleteProduct, onToggleAvailability
}) => {
  const filtered = products.filter((p) => {
    const matchCat = productCategoryFilter === "ALL" || p.category === productCategoryFilter;
    const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat} type="button" onClick={() => setProductCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${productCategoryFilter === cat ? "bg-[#5A3E36] text-white shadow-xs" : "bg-[#FFF9F2] text-[#78716C] hover:text-[#5A3E36] border border-[#5A3E36]/10"}`}
            >
              {cat === "ALL" ? "All" : cat.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search product..." className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#E85D75]" />
          </div>
          <button type="button" onClick={onOpenAddProduct} className="px-3.5 py-1.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <Plus className="w-3.5 h-3.5 stroke-[3]" /><span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#292524]">
            <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
              <tr>{["Visual", "Product Name", "Category", "Price", "Availability", "Actions"].map((h, i) => (
                <th key={h} className={`px-4 py-3 ${i === 3 ? "font-mono" : i === 5 ? "text-right" : ""}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className={`hover:bg-stone-50 transition-colors ${!prod.available ? "opacity-65 bg-stone-50/70" : ""}`}>
                  <td className="px-4 py-3"><ProductIcon category={prod.category} iconName={prod.iconName} colorAccent={prod.colorAccent} className="w-5 h-5" /></td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-sm text-[#5A3E36]">{prod.name}</div>
                    <div className="text-[11px] text-[#78716C] line-clamp-1">{prod.description}</div>
                    {prod.badge && <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F58FA3]/20 text-[#5A3E36]">{prod.badge}</span>}
                  </td>
                  <td className="px-4 py-3 capitalize font-medium text-stone-600">{prod.category.replace("_", " ")}</td>
                  <td className="px-4 py-3 font-black font-mono text-sm text-[#5A3E36]">{prod.price} <span className="text-[10px] text-[#E85D75]">ETB</span></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => onToggleAvailability(prod.id)} className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${prod.available ? "bg-[#65A30D]/15 text-[#4D7C0F] hover:bg-[#65A30D]/25" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`} title="Toggle availability">
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.available ? "bg-[#65A30D]" : "bg-stone-400"}`} /><span>{prod.available ? "In Stock" : "Disabled / Out of Stock"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => onEditProduct(prod)} className="p-1.5 rounded-lg text-stone-600 hover:text-[#5A3E36] hover:bg-[#FFF9F2] border border-stone-200 cursor-pointer" title="Edit Product"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => onDeleteProduct(prod.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 cursor-pointer" title="Delete Product"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerProductsTab;
