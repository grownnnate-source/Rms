import { ShoppingBag, Send } from "lucide-react";
import { CartItem } from "./CartItem";

export const CartSidebar = ({
  nextOrderNumber,
  cartItems = [],
  onClearCart,
  onUpdateQty,
  onRemoveItem,
  customerNote,
  setCustomerNote,
  onSubmitOrder
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl border border-[#5A3E36]/15 shadow-md flex flex-col sticky top-20 overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center font-bold text-xs">
            #{nextOrderNumber}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#5A3E36]">Current Order</h3>
            <p className="text-[11px] text-[#78716C]">
              {cartItems.length} items in cart
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-[#78716C] hover:text-[#E85D75] font-semibold transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="p-4 space-y-3 max-h-[44vh] overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-600">Cart is empty</p>
            <p className="text-xs text-stone-400 mt-1 max-w-[200px] mx-auto">
              Select ice cream flavors or toppings from the menu to build customer order.
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Customer Note */}
      <div className="px-4 py-2 bg-stone-50/50 border-t border-[#5A3E36]/10">
        <input
          type="text"
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          placeholder="Order instructions (e.g. extra napkins, allergies)..."
          className="w-full text-xs bg-transparent border-none focus:outline-none text-[#5A3E36] placeholder:text-stone-400"
        />
      </div>

      {/* Totals & Submit Section */}
      <div className="p-4 border-t border-[#5A3E36]/10 bg-[#FFF9F2]/60 space-y-3">
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-[#78716C]">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-[#5A3E36]">
              {subtotal} ETB
            </span>
          </div>
          <div className="flex items-center justify-between text-[#78716C]">
            <span>Campus VAT (15%)</span>
            <span className="font-mono font-semibold text-[#5A3E36]">
              {tax} ETB
            </span>
          </div>
          <div className="flex items-center justify-between text-base font-bold pt-1.5 border-t border-[#5A3E36]/10 text-[#5A3E36]">
            <span>Total Due</span>
            <span className="text-xl font-black text-[#5A3E36]">
              {total} <span className="text-xs font-semibold text-[#E85D75]">ETB</span>
            </span>
          </div>
        </div>

        {/* SUBMIT ORDER Button */}
        <button
          id="server-submit-order-btn"
          type="button"
          disabled={cartItems.length === 0}
          onClick={onSubmitOrder}
          className="w-full py-3.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>SUBMIT ORDER</span>
        </button>
        <p className="text-[10px] text-center text-[#78716C]">
          Dispatches order #{nextOrderNumber} instantly to Cashier checkout queue
        </p>
      </div>
    </div>
  );
};

export default CartSidebar;
