import { useState, useMemo } from "react";
import { X, Plus, Minus, Check, Sparkles } from "lucide-react";
import { ProductIcon } from "./ProductIcon";

const createId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const CustomizationModal = ({ product, products = [], onClose, onAddToCart }) => {
  const cupProduct = useMemo(() => products.find((p) => p.category?.toLowerCase() === "cups" || p.name?.toLowerCase().includes("cup")), [products]);
  const cupSizes = useMemo(() => (cupProduct?.sizes?.length ? cupProduct.sizes.map((s) => ({ size: s.size, label: s.size.toUpperCase(), price: Number(s.price) || 0 })) : [
    { size: "sm", label: "SM", price: 20 }, { size: "md", label: "MD", price: 35 }, { size: "L", label: "L", price: 50 }, { size: "XL", label: "XL", price: 70 }
  ]), [cupProduct]);
  const toppingOptions = useMemo(() => products.filter((p) => p.category?.toLowerCase() === "toppings" && p.available !== false).map((p) => ({ name: p.name, price: Number(p.price) || 0 })), [products]);

  const isIceCream = product.category === "ice_cream";
  const [scoops, setScoops] = useState(product.scoopsDefault || 1);
  const [serving, setServing] = useState("Cone");
  const [cupSize, setCupSize] = useState(cupSizes[0]?.size || "sm");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const selectedCup = cupSizes.find((c) => c.size === cupSize) || cupSizes[0] || { size: "sm", price: 20 };
  const iceCreamBasePrice = isIceCream ? scoops * product.price : product.price;
  const containerPrice = serving === "Cup" ? selectedCup.price : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + (toppingOptions.find((o) => o.name === t)?.price || 0), 0);
  const unitPrice = iceCreamBasePrice + containerPrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (name) => setSelectedToppings((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));

  const handleConfirm = () => {
    onAddToCart({
      id: createId(), productId: product.id, name: product.name, category: product.category,
      scoops: isIceCream ? scoops : 0,
      serving: serving === "Cup" ? `Paper Cup (${selectedCup.size.toUpperCase()})` : "Regular Waffle Cone",
      containerType: serving, cupSize: serving === "Cup" ? cupSize : "",
      toppings: selectedToppings, unitPrice, quantity, totalItemPrice: totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div id="customization-modal" className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#5A3E36]/15 overflow-hidden flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]/70">
          <div className="flex items-center gap-3">
            <ProductIcon category={product.category} iconName={product.iconName} colorAccent={product.colorAccent} className="w-6 h-6" />
            <div><h2 className="text-lg font-bold text-[#5A3E36]">{product.name}</h2><p className="text-xs text-[#78716C]">{product.description}</p></div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#5A3E36] hover:bg-[#5A3E36]/10 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {isIceCream && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#5A3E36]">Number of Scoops <span className="text-[11px] font-normal text-[#78716C]">({product.price} ETB / scoop)</span></label>
                <span className="text-xs font-black font-mono text-[#E85D75]">{iceCreamBasePrice} ETB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button key={num} type="button" onClick={() => setScoops(num)} className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center cursor-pointer ${scoops === num ? "border-[#E85D75] bg-[#E85D75] text-white shadow-xs" : "border-[#5A3E36]/15 bg-white text-[#5A3E36] hover:border-[#5A3E36]/30"}`}>
                    <span className="text-sm">{num} {num === 1 ? "Scoop" : "Scoops"}</span>
                    <span className={`text-[10px] mt-0.5 font-mono ${scoops === num ? "text-white/90" : "text-[#78716C]"}`}>{num * product.price} ETB</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isIceCream && (
            <div>
              <label className="block text-sm font-bold text-[#5A3E36] mb-2">Serving Container</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "Cone", label: "Waffle Cone", price: "FREE (+0 ETB)", desc: "Fresh rolled cone included at no extra cost", active: "border-[#65A30D] bg-[#65A30D]/10 ring-[#65A30D]", badge: "bg-[#65A30D]/20 text-[#4D7C0F]" },
                  { id: "Cup", label: "Paper Cup", price: `+${selectedCup.price} ETB`, desc: `Insulated paper cup (${selectedCup.size.toUpperCase()})`, active: "border-[#E85D75] bg-[#F58FA3]/15 ring-[#E85D75]", badge: "bg-[#E85D75]/15 text-[#E85D75]" }
                ].map((c) => (
                  <button key={c.id} type="button" onClick={() => setServing(c.id)} className={`py-3 px-3.5 rounded-xl border text-left transition-all cursor-pointer ${serving === c.id ? `${c.active} text-[#5A3E36] shadow-xs ring-1` : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"}`}>
                    <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold text-[#5A3E36]">{c.label}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.badge}`}>{c.price}</span></div>
                    <p className="text-xs text-[#78716C]">{c.desc}</p>
                  </button>
                ))}
              </div>

              {serving === "Cup" && (
                <div className="mt-3 p-3.5 bg-[#FFF9F2] rounded-xl border border-[#5A3E36]/15 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs"><span className="font-bold text-[#5A3E36]">Cup Sizes & Prices:</span><span className="text-[11px] text-[#78716C]">Select cup container size</span></div>
                  <div className="grid grid-cols-4 gap-2">
                    {cupSizes.map((cs) => (
                      <button key={cs.size} type="button" onClick={() => setCupSize(cs.size)} className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${cupSize === cs.size ? "border-[#E85D75] bg-[#E85D75] text-white font-bold shadow-xs" : "border-[#5A3E36]/15 bg-white text-[#5A3E36] hover:border-[#5A3E36]/30 font-medium"}`}>
                        <div className="text-xs font-bold uppercase">{cs.size}</div>
                        <div className={`text-[10px] mt-0.5 ${cupSize === cs.size ? "text-white/90" : "text-[#E85D75] font-semibold"}`}>+{cs.price} ETB</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {toppingOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#5A3E36] flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#E85D75]" /><span>Toppings</span></label>
                <span className="text-xs text-[#78716C]">{selectedToppings.length} selected (+{toppingsPrice} ETB)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {toppingOptions.map((t) => {
                  const checked = selectedToppings.includes(t.name);
                  return (
                    <button key={t.name} type="button" onClick={() => toggleTopping(t.name)} className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${checked ? "border-[#E85D75] bg-[#FFF9F2] text-[#5A3E36] ring-1 ring-[#E85D75]/50" : "border-[#5A3E36]/15 bg-white text-[#78716C] hover:border-[#5A3E36]/30"}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? "bg-[#E85D75] border-[#E85D75]" : "border-stone-300 bg-white"}`}>
                          {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{t.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#5A3E36]">+{t.price} ETB</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#5A3E36]/10">
            <div><label className="block text-xs font-bold text-[#5A3E36]">Order Quantity</label><span className="text-[11px] text-[#78716C]">Multiplies this configured item</span></div>
            <div className="flex items-center gap-2 bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/10">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="w-8 h-8 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] disabled:opacity-30 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
              <span className="font-bold text-base text-[#5A3E36] w-10 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-white border border-[#5A3E36]/15 flex items-center justify-center text-[#5A3E36] cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-[#5A3E36]/10 bg-[#FFF9F2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#78716C]">Unit: {unitPrice} ETB &bull; Qty: {quantity}</div>
            <div className="text-2xl font-black text-[#5A3E36] font-mono">{totalPrice} <span className="text-sm font-bold text-[#E85D75]">ETB</span></div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button type="button" onClick={onClose} className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#5A3E36]/20 font-bold text-xs text-[#5A3E36] hover:bg-[#5A3E36]/10 cursor-pointer">Cancel</button>
            <button id="confirm-customization-btn" type="button" onClick={handleConfirm} className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] active:scale-98 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4 stroke-[3]" /><span>Add to Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
