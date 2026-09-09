import { useState } from "react";
import { X, Plus, Minus, Check, Sparkles } from "lucide-react";
import { ProductIcon } from "./ProductIcon";

const CUP_SIZES = [
  { size: "sm", label: "Small (sm)", price: 20 },
  { size: "md", label: "Medium (md)", price: 35 },
  { size: "L", label: "Large (L)", price: 50 },
  { size: "XL", label: "Extra Large (XL)", price: 70 }
];

const TOPPING_OPTIONS = [
  { name: "Crushed Oreo", price: 40 },
  { name: "Rainbow Sprinkles", price: 40 },
  { name: "Chocolate Chips", price: 40 },
  { name: "Crushed M&Ms", price: 40 },
  { name: "Crushed Peanuts", price: 40 }
];

const createCustomizedItemId = () => `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

export const CustomizationModal = ({
  product,
  onClose,
  onAddToCart
}) => {
  const isIceCream = product.category === "ice_cream";
  const [scoops, setScoops] = useState(product.scoopsDefault || 1);
  const [serving, setServing] = useState("Cone"); // Cone has no price (free), Cup has price
  const [cupSize, setCupSize] = useState("sm");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Exact user requirement: "the price = scoop * price of icecream"
  const iceCreamBasePrice = isIceCream ? scoops * product.price : product.price;

  // Exact user requirement: "the cup have a price the cone doesnt have a price"
  const selectedCup = CUP_SIZES.find((c) => c.size === cupSize) || CUP_SIZES[0];
  const containerPrice = serving === "Cup" ? selectedCup.price : 0; // Cone is 0 ETB (free)

  const toppingsPrice = selectedToppings.reduce((acc, tName) => {
    const found = TOPPING_OPTIONS.find((t) => t.name === tName);
    return acc + (found ? found.price : 40);
  }, 0);

  const unitPrice = iceCreamBasePrice + containerPrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (toppingName) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };

  const handleConfirm = () => {
    const servingDescription = serving === "Cup"
      ? `Paper Cup (${selectedCup.size.toUpperCase()})`
      : "Regular Waffle Cone";

    const orderItem = {
      id: createCustomizedItemId(),
      productId: product.id,
      name: product.name,
      category: product.category,
      scoops: isIceCream ? scoops : 0,
      serving: servingDescription,
      containerType: serving,
      cupSize: serving === "Cup" ? cupSize : "",
      toppings: selectedToppings,
      unitPrice,
      quantity,
      totalItemPrice: totalPrice
    };
    onAddToCart(orderItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="customization-modal"
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Scoops Section: price = scoop * price of icecream */}
          {isIceCream && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#5A3E36] flex items-center gap-1.5">
                  <span>Number of Scoops</span>
                  <span className="text-xs font-semibold text-[#E85D75]">
                    ({product.price} ETB / scoop)
                  </span>
                </label>
                <span className="text-xs font-bold text-[#5A3E36] font-mono">
                  {scoops} × {product.price} = {scoops * product.price} ETB
                </span>
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
                <span className="font-bold text-lg text-[#5A3E36] w-12 text-center">
                  {scoops}
                </span>
                <button
                  type="button"
                  onClick={() => setScoops(Math.min(5, scoops + 1))}
                  disabled={scoops >= 5}
                  className="w-10 h-10 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Serving Container: Cone (0 ETB) vs Cup (with cup sizes just under it) */}
          {isIceCream && (
            <div>
              <label className="block text-sm font-bold text-[#5A3E36] mb-2">
                Serving Container
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Cone: 0 ETB */}
                <button
                  type="button"
                  onClick={() => setServing("Cone")}
                  className={`py-3 px-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    serving === "Cone"
                      ? "border-[#65A30D] bg-[#65A30D]/10 text-[#5A3E36] shadow-xs ring-1 ring-[#65A30D]"
                      : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#5A3E36]">Waffle Cone</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#65A30D]/20 text-[#4D7C0F]">
                      FREE (+0 ETB)
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C]">Fresh rolled cone included at no extra cost</p>
                </button>

                {/* Cup: Has price based on size */}
                <button
                  type="button"
                  onClick={() => setServing("Cup")}
                  className={`py-3 px-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    serving === "Cup"
                      ? "border-[#E85D75] bg-[#F58FA3]/15 text-[#5A3E36] shadow-xs ring-1 ring-[#E85D75]"
                      : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#5A3E36]">Paper Cup</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E85D75]/15 text-[#E85D75]">
                      +{selectedCup.price} ETB
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C]">
                    Insulated paper cup ({selectedCup.size.toUpperCase()})
                  </p>
                </button>
              </div>

              {/* Exact user requirement: "and the cup sizes should be just under the cup component" */}
              {serving === "Cup" && (
                <div className="mt-3 p-3.5 bg-[#FFF9F2] rounded-xl border border-[#5A3E36]/15 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A3E36]">Cup Sizes & Prices:</span>
                    <span className="text-[11px] text-[#78716C]">
                      Select cup container size
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {CUP_SIZES.map((cs) => {
                      const isSelectedSize = cupSize === cs.size;
                      return (
                        <button
                          key={cs.size}
                          type="button"
                          onClick={() => setCupSize(cs.size)}
                          className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelectedSize
                              ? "border-[#E85D75] bg-[#E85D75] text-white font-bold shadow-xs"
                              : "border-[#5A3E36]/15 bg-white text-[#5A3E36] hover:border-[#5A3E36]/30 font-medium"
                          }`}
                        >
                          <div className="text-xs font-bold uppercase">{cs.size}</div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isSelectedSize ? "text-white/90" : "text-[#E85D75] font-semibold"
                            }`}
                          >
                            +{cs.price} ETB
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toppings Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[#5A3E36] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E85D75]" />
                <span>Toppings (40 ETB each)</span>
              </label>
              <span className="text-xs text-[#78716C]">
                {selectedToppings.length} selected (+{toppingsPrice} ETB)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((topping) => {
                const isChecked = selectedToppings.includes(topping.name);
                return (
                  <button
                    key={topping.name}
                    type="button"
                    onClick={() => toggleTopping(topping.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isChecked
                        ? "border-[#E85D75] bg-[#FFF9F2] text-[#5A3E36] shadow-2xs ring-1 ring-[#E85D75]/50"
                        : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? "bg-[#E85D75] border-[#E85D75]" : "border-stone-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium">{topping.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#5A3E36]">+{topping.price} ETB</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-4 border-t border-[#5A3E36]/10">
            <div>
              <label className="block text-xs font-bold text-[#5A3E36]">Order Quantity</label>
              <span className="text-[11px] text-[#78716C]">Multiplies this configured item</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/10">
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

        {/* Footer with Price and Large Touch-Friendly Submit Button */}
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
    </div>
  );
};
export default CustomizationModal;
