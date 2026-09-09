import { useState } from "react";
import { X } from "lucide-react";
const CATEGORIES = [
  { id: "ice_cream", label: "Ice Cream" },
  { id: "toppings", label: "Toppings" },
  { id: "cones", label: "Cones" },
  { id: "cups", label: "Cups" },
  { id: "drinks", label: "Drinks" }
];
const ICON_OPTIONS = [
  { label: "Ice Cream", value: "IceCream" },
  { label: "Sparkles", value: "Sparkles" },
  { label: "Coffee", value: "Coffee" },
  { label: "Cookie", value: "Cookie" },
  { label: "Leaf", value: "Leaf" },
  { label: "Drink", value: "GlassWater" },
  { label: "Citrus", value: "Citrus" },
  { label: "Package", value: "Package" }
];
export const ProductModal = ({
  initialProduct,
  onClose,
  onSave
}) => {
  const isEditing = !!initialProduct;
  const [name, setName] = useState(initialProduct?.name || "");
  const [category, setCategory] = useState(initialProduct?.category || "ice_cream");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState(initialProduct?.price || 100);
  const [available, setAvailable] = useState(initialProduct ? initialProduct.available : true);
  const [iconName, setIconName] = useState(initialProduct?.iconName || "IceCream");
  const [badge, setBadge] = useState(initialProduct?.badge || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const productToSave = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      available,
      iconName,
      badge: badge.trim() ? badge.trim() : void 0,
      colorAccent: category === "ice_cream" ? "#5A3E36" : void 0,
      scoopsDefault: category === "ice_cream" ? 1 : 0
    };
    onSave(productToSave);
    onClose();
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    onClick={onClose}
  >
      <div
    className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[92vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Modal Header */
  }
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FFF9F2]">
          <h3 className="font-bold text-base text-[#5A3E36]">
            {isEditing ? "Edit Product Item" : "Add New Menu Product"}
          </h3>
          <button
    type="button"
    onClick={onClose}
    className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200 cursor-pointer"
  >
            <X className="w-4 h-4" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {
    /* Name */
  }
          <div>
            <label className="block text-xs font-bold text-[#5A3E36] mb-1">
              Product Name *
            </label>
            <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Ethiopian Honeycomb Crunch"
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  />
          </div>

          {
    /* Category & Price */
  }
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Category
              </label>
              <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  >
                {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Price (ETB) *
              </label>
              <input
    type="number"
    min="0"
    step="5"
    required
    value={price}
    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] font-mono text-[#292524]"
  />
            </div>
          </div>

          {
    /* Description */
  }
          <div>
            <label className="block text-xs font-bold text-[#5A3E36] mb-1">
              Description
            </label>
            <textarea
    rows={2}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Ingredients, milk source, flavor profile..."
    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  />
          </div>

          {
    /* Icon & Badge Tag */
  }
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Visual Icon
              </label>
              <select
    value={iconName}
    onChange={(e) => setIconName(e.target.value)}
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  >
                {ICON_OPTIONS.map((ico) => <option key={ico.value} value={ico.value}>
                    {ico.label}
                  </option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3E36] mb-1">
                Badge / Tag (Optional)
              </label>
              <input
    type="text"
    value={badge}
    onChange={(e) => setBadge(e.target.value)}
    placeholder="e.g. Bestseller, Seasonal"
    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#E85D75] text-[#292524]"
  />
            </div>
          </div>

          {
    /* Availability Toggle */
  }
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A3E36]">Availability Status</span>
              <p className="text-[11px] text-[#78716C]">
                Turn off if ingredient batch is temporarily out of stock
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
    type="checkbox"
    checked={available}
    onChange={(e) => setAvailable(e.target.checked)}
    className="sr-only peer"
  />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#65A30D]" />
              <span className="ml-2 text-xs font-bold text-stone-700">
                {available ? "In Stock" : "Unavailable"}
              </span>
            </label>
          </div>

          {
    /* Footer Actions */
  }
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
    className="px-5 py-2 text-xs font-bold text-white bg-[#E85D75] hover:bg-[#d44860] rounded-xl shadow-xs transition-all cursor-pointer"
  >
              {isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>

      </div>
    </div>;
};
