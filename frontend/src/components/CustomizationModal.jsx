import { useState } from "react";
import { X, Plus, Minus, Check, Sparkles } from "lucide-react";
import { ProductIcon } from "./ProductIcon";
const TOPPING_OPTIONS = [
  { name: "Crushed Oreo Crumble", price: 25 },
  { name: "Rainbow Sprinkles", price: 15 },
  { name: "Chocolate Chips", price: 25 },
  { name: "Roasted Nuts & Almonds", price: 30 },
  { name: "Warm Fudge Drizzle", price: 20 }
];

const createCustomizedItemId = () => `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

export const CustomizationModal = ({
  product,
  onClose,
  onAddToCart
}) => {
  const isIceCream = product.category === "ice_cream";
  const [scoops, setScoops] = useState(product.scoopsDefault || 1);
  const [serving, setServing] = useState("Cup");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const extraScoopPrice = isIceCream && scoops > 1 ? (scoops - 1) * 35 : 0;
  const servingExtra = serving === "Waffle Bowl" ? 20 : serving === "Cone" ? 10 : 0;
  const toppingsPrice = selectedToppings.reduce((acc, tName) => {
    const found = TOPPING_OPTIONS.find((t) => t.name === tName);
    return acc + (found ? found.price : 20);
  }, 0);
  const unitPrice = product.price + extraScoopPrice + servingExtra + toppingsPrice;
  const totalPrice = unitPrice * quantity;
  const toggleTopping = (toppingName) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };
  const handleConfirm = () => {
    const orderItem = {
      id: createCustomizedItemId(),
      productId: product.id,
      name: product.name,
      category: product.category,
      scoops: isIceCream ? scoops : 0,
      serving: isIceCream ? serving : "Cup",
      toppings: selectedToppings,
      unitPrice,
      quantity,
      totalItemPrice: totalPrice
    };
    onAddToCart(orderItem);
    onClose();
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    onClick={onClose}
  >
      <div
    id="customization-modal"
    className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[92vh]"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Header */
  }
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]/70">
          <div className="flex items-center gap-3">
            <ProductIcon
    category={product.category}
    iconName={product.iconName}
    colorAccent={product.colorAccent}
    className="w-6 h-6"
  />
            <div>
              <h2 className="text-lg font-bold text-[#5A3E36]">{product.name}</h2>
              <p className="text-xs text-[#78716C]">{product.description}</p>
            </div>
          </div>
          <button
    type="button"
    onClick={onClose}
    className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#5A3E36] hover:bg-[#5A3E36]/10 transition-colors cursor-pointer"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content Body */
  }
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {
    /* Scoops Section (for Ice Cream) */
  }
          {isIceCream && <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#5A3E36] flex items-center gap-1.5">
                  <span>Scoops</span>
                  {scoops > 1 && <span className="text-xs font-normal text-[#E85D75]">(+35 ETB each extra)</span>}
                </label>
                <span className="text-xs text-[#78716C] font-mono">{scoops} {scoops === 1 ? "scoop" : "scoops"}</span>
              </div>
              <div className="flex items-center justify-between bg-[#FFF9F2] p-2 rounded-xl border border-[#5A3E36]/10 max-w-xs">
                <button
    type="button"
    onClick={() => setScoops(Math.max(1, scoops - 1))}
    disabled={scoops <= 1}
    className="w-10 h-10 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer shadow-2xs"
  >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg text-[#5A3E36] w-12 text-center">{scoops}</span>
                <button
    type="button"
    onClick={() => setScoops(Math.min(3, scoops + 1))}
    disabled={scoops >= 3}
    className="w-10 h-10 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer shadow-2xs"
  >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>}

          {
    /* Serving Style (Cup / Cone / Waffle Bowl) */
  }
          {isIceCream && <div>
              <label className="block text-sm font-bold text-[#5A3E36] mb-2">
                Serving Style
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {["Cup", "Cone", "Waffle Bowl"].map((type) => {
    const isSelected = serving === type;
    const priceNote = type === "Waffle Bowl" ? "+20 ETB" : type === "Cone" ? "+10 ETB" : "Standard";
    return <button
      key={type}
      type="button"
      onClick={() => setServing(type)}
      className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected ? "border-[#E85D75] bg-[#F58FA3]/15 text-[#5A3E36] shadow-xs ring-1 ring-[#E85D75]" : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"}`}
    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#E85D75] bg-[#E85D75]" : "border-stone-400"}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-sm font-bold text-[#5A3E36]">{type}</span>
                      </div>
                      <span className="text-[11px] text-[#78716C]">{priceNote}</span>
                    </button>;
  })}
              </div>
            </div>}

          {
    /* Toppings Multi-Select */
  }
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[#5A3E36] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E85D75]" />
                <span>Toppings & Add-ons</span>
              </label>
              <span className="text-xs text-[#78716C]">
                {selectedToppings.length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((topping) => {
    const isChecked = selectedToppings.includes(topping.name);
    return <button
      key={topping.name}
      type="button"
      onClick={() => toggleTopping(topping.name)}
      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isChecked ? "border-[#E85D75] bg-[#FFF9F2] text-[#5A3E36] shadow-2xs ring-1 ring-[#E85D75]/50" : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"}`}
    >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-[#E85D75] border-[#E85D75]" : "border-stone-300 bg-white"}`}>
                        {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-[#292524]">{topping.name}</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-[#E85D75]">+{topping.price} ETB</span>
                  </button>;
  })}
            </div>
          </div>

          {
    /* Quantity Controls */
  }
          <div className="pt-2 border-t border-[#5A3E36]/10 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-[#5A3E36]">Quantity</span>
              <p className="text-xs text-[#78716C]">Items to prepare</p>
            </div>
            <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
              <button
    type="button"
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    disabled={quantity <= 1}
    className="w-8 h-8 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
  >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-base text-[#5A3E36] w-10 text-center">{quantity}</span>
              <button
    type="button"
    onClick={() => setQuantity(quantity + 1)}
    className="w-8 h-8 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] hover:bg-stone-50 cursor-pointer"
  >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {
    /* Footer with Price and Large Touch-Friendly Submit Button */
  }
        <div className="p-4 border-t border-[#5A3E36]/10 bg-[#FFF9F2] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#78716C] uppercase font-mono tracking-wider">Item Total</div>
            <div className="text-xl font-black text-[#5A3E36]">
              {totalPrice} <span className="text-sm font-semibold text-[#E85D75]">ETB</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-3 rounded-xl border border-[#5A3E36]/20 text-sm font-bold text-[#5A3E36] hover:bg-white transition-colors cursor-pointer"
  >
              Cancel
            </button>
            <button
    id="add-to-order-modal-btn"
    type="button"
    onClick={handleConfirm}
    className="px-6 py-3 rounded-xl bg-[#E85D75] hover:bg-[#d44860] active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
  >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Order</span>
            </button>
          </div>
        </div>

      </div>
    </div>;
};
