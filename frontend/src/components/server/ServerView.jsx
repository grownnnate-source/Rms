import { useState } from "react";
import { CustomizationModal } from "./CustomizationModal";
import { ProductIcon } from "../common/ProductIcon";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Clock,
  Send,
  ShoppingBag
} from "lucide-react";
const CATEGORIES = [
  { id: "ice_cream", label: "Ice Cream" },
  { id: "toppings", label: "Toppings" },
  { id: "cones", label: "Cones" },
  { id: "cups", label: "Cups" },
  { id: "drinks", label: "Drinks" }
];

const createQuickItemId = (productId) => `item-${productId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

export const ServerView = ({
  products,
  currentOrderItems,
  onAddToCart,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onClearCart,
  onSubmitOrder,
  recentOrders,
  nextOrderNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState("ice_cream");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomizingProduct, setActiveCustomizingProduct] = useState(null);
  const [customerNote, setCustomerNote] = useState("");
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === p.category;
    const matchesSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const subtotal = currentOrderItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const handleProductCardClick = (product) => {
    if (!product.available) return;
    if (product.category === "ice_cream") {
      setActiveCustomizingProduct(product);
    } else {
      const newItem = {
        id: createQuickItemId(product.id),
        productId: product.id,
        name: product.name,
        category: product.category,
        scoops: 0,
        serving: product.category === "cups" ? "Cup" : product.category === "cones" ? "Cone" : "Cup",
        toppings: [],
        unitPrice: product.price,
        quantity: 1,
        totalItemPrice: product.price
      };
      onAddToCart(newItem);
    }
  };
  const handleQuickSubmit = () => {
    if (currentOrderItems.length === 0) return;
    const submitted = onSubmitOrder(customerNote);
    if (submitted) {
      setLastSubmittedOrder(submitted);
      setShowSubmissionSuccess(true);
      setCustomerNote("");
      setTimeout(() => {
        setShowSubmissionSuccess(false);
      }, 4e3);
    }
  };
  return <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      
      {
    /* Tablet Top Info Bar */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 font-mono text-sm font-bold text-[#5A3E36]">
            Active Order #{nextOrderNumber}
          </div>
          <span className="text-xs text-[#78716C] hidden md:inline">
            Tap flavor cards to configure scoops & toppings with 1-touch dispatch.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {
    /* Quick Search */
  }
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search flavor, toppings..."
    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] placeholder:text-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
  />
            {searchQuery && <button
    onClick={() => setSearchQuery("")}
    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#5A3E36]"
  >
                ×
              </button>}
          </div>

          <button
    type="button"
    onClick={onClearCart}
    disabled={currentOrderItems.length === 0}
    className="px-3 py-1.5 text-xs font-semibold text-[#78716C] hover:text-[#E85D75] disabled:opacity-30 disabled:hover:text-[#78716C] flex items-center gap-1.5 rounded-xl border border-stone-200 hover:border-[#E85D75]/30 transition-colors cursor-pointer"
    title="Clear current cart and start fresh"
  >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {
    /* Success Notification Banner */
  }
      {showSubmissionSuccess && lastSubmittedOrder && <div className="mb-4 p-3.5 rounded-xl bg-[#65A30D]/15 border border-[#65A30D]/30 text-[#4D7C0F] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#65A30D]" />
            <div>
              <span className="font-bold text-sm">
                Order #{lastSubmittedOrder.orderNumber} submitted to Cashier!
              </span>
              <span className="text-xs text-stone-700 ml-2">
                Total: {lastSubmittedOrder.total} ETB • Cashier can now generate payment.
              </span>
            </div>
          </div>
          <button
    onClick={() => setShowSubmissionSuccess(false)}
    className="text-xs font-semibold underline text-[#4D7C0F]"
  >
            Dismiss
          </button>
        </div>}

      {
    /* Main Tablet 2-Column Grid (Left: Menu & Categories, Right: Current Order Panel) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {
    /* LEFT / MAIN AREA (Col 7 or 8 on desktop/tablet) */
  }
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {
    /* Category Tabs */
  }
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
    const isActive = selectedCategory === cat.id;
    const count = products.filter((p) => p.category === cat.id).length;
    return <button
      key={cat.id}
      id={`cat-tab-${cat.id}`}
      type="button"
      onClick={() => setSelectedCategory(cat.id)}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${isActive ? "bg-[#5A3E36] text-[#FFF9F2] shadow-sm ring-2 ring-[#5A3E36]/20" : "bg-white text-[#78716C] hover:text-[#5A3E36] hover:bg-stone-50 border border-[#5A3E36]/10"}`}
    >
                  <span>{cat.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-[#F58FA3]/30 text-[#FFF9F2]" : "bg-[#FFF9F2] text-[#78716C]"}`}>
                    {count}
                  </span>
                </button>;
  })}
          </div>

          {
    /* Product Cards Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => {
    const isIceCream = product.category === "ice_cream";
    return <div
      key={product.id}
      id={`prod-card-${product.id}`}
      className={`relative bg-white rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${product.available ? "border-[#5A3E36]/10 shadow-xs hover:shadow-md hover:border-[#5A3E36]/25 group" : "border-stone-200 opacity-60 bg-stone-50"}`}
    >
                  {
      /* Top row: Badge & Availability */
    }
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <ProductIcon
      category={product.category}
      iconName={product.iconName}
      colorAccent={product.colorAccent}
      className="w-7 h-7"
    />

                    <div className="flex flex-col items-end">
                      {product.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F58FA3]/20 text-[#5A3E36] border border-[#F58FA3]/30 mb-1">
                          {product.badge}
                        </span>}
                      {!product.available && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                          Unavailable
                        </span>}
                    </div>
                  </div>

                  {
      /* Product Details */
    }
                  <div className="mb-3">
                    <h3 className="font-bold text-sm text-[#5A3E36] group-hover:text-[#E85D75] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#78716C] line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  {
      /* Price & Add Button */
    }
                  <div className="flex items-center justify-between pt-2 border-t border-[#5A3E36]/5 mt-auto">
                    <div>
                      <span className="text-base font-black text-[#5A3E36]">
                        {product.price}
                      </span>
                      <span className="text-xs font-semibold text-[#E85D75] ml-1">ETB</span>
                    </div>

                    <button
      type="button"
      disabled={!product.available}
      onClick={() => handleProductCardClick(product)}
      className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] hover:bg-[#E85D75] text-[#5A3E36] hover:text-white font-bold text-xs border border-[#5A3E36]/15 hover:border-[#E85D75] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isIceCream ? "Customize" : "Add"}</span>
                    </button>
                  </div>
                </div>;
  })}
          </div>

          {filteredProducts.length === 0 && <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-[#5A3E36]/20">
              <Sparkles className="w-8 h-8 text-[#F58FA3] mx-auto mb-2 opacity-70" />
              <p className="text-sm font-bold text-[#5A3E36]">No items found</p>
              <p className="text-xs text-[#78716C] mt-1">Try switching category tabs or clearing search.</p>
            </div>}

          {
    /* Recent Orders Tracker Footer (Tablet friendly) */
  }
          <div className="bg-white rounded-2xl p-4 border border-[#5A3E36]/10 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E85D75]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A3E36]">
                  Recent Server Submissions
                </h4>
              </div>
              <span className="text-[11px] text-[#78716C]">Live queue sync</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recentOrders.slice(0, 3).map((ord) => <div
    key={ord.id}
    className="p-2.5 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10 flex items-center justify-between text-xs"
  >
                  <div>
                    <span className="font-bold text-[#5A3E36]">#{ord.orderNumber}</span>
                    <span className="text-stone-500 text-[11px] ml-1.5">({ord.items.length} items)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#5A3E36]">{ord.total} ETB</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${ord.status === "PAID" ? "bg-[#65A30D]/15 text-[#4D7C0F]" : ord.status === "PENDING" ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-stone-200 text-stone-600"}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>

        </div>

        {
    /* RIGHT SIDE: Current Order Panel (Col 5 or 4 on desktop/tablet) */
  }
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-[#5A3E36]/15 shadow-md flex flex-col sticky top-20 overflow-hidden">
          
          {
    /* Panel Header */
  }
          <div className="p-4 border-b border-[#5A3E36]/10 bg-[#FFF9F2]/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center font-bold text-xs">
                #{nextOrderNumber}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#5A3E36]">Current Order</h3>
                <p className="text-[11px] text-[#78716C]">{currentOrderItems.length} items in cart</p>
              </div>
            </div>

            {currentOrderItems.length > 0 && <button
    type="button"
    onClick={onClearCart}
    className="text-xs text-[#78716C] hover:text-[#E85D75] font-semibold transition-colors cursor-pointer"
  >
                Clear
              </button>}
          </div>

          {
    /* Cart Items List */
  }
          <div className="p-4 space-y-3 max-h-[44vh] overflow-y-auto">
            {currentOrderItems.length === 0 ? <div className="py-12 text-center text-stone-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-sm font-bold text-stone-600">Cart is empty</p>
                <p className="text-xs text-stone-400 mt-1 max-w-[200px] mx-auto">
                  Select ice cream flavors or toppings from the menu to build customer order.
                </p>
              </div> : currentOrderItems.map((item) => <div
    key={item.id}
    className="p-3 rounded-xl bg-[#FFF9F2]/80 border border-[#5A3E36]/10 flex flex-col gap-2 relative group"
  >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 pr-6">
                      <div className="font-bold text-xs text-[#5A3E36] leading-tight">
                        {item.name}
                      </div>

                      {
    /* Customization Details Badges */
  }
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                        {item.scoops > 0 && <span className="px-1.5 py-0.5 rounded bg-white text-[#5A3E36] font-medium border border-[#5A3E36]/10">
                            {item.scoops} {item.scoops === 1 ? "scoop" : "scoops"}
                          </span>}
                        <span className="px-1.5 py-0.5 rounded bg-white text-[#5A3E36] font-medium border border-[#5A3E36]/10">
                          {item.serving}
                        </span>
                        {item.toppings.map((top) => <span
    key={top}
    className="px-1.5 py-0.5 rounded bg-[#F58FA3]/20 text-[#5A3E36] font-medium"
  >
                            +{top.split(" ")[0]}
                          </span>)}
                      </div>
                    </div>

                    <button
    type="button"
    onClick={() => onRemoveCartItem(item.id)}
    className="text-stone-400 hover:text-[#E85D75] transition-colors p-1 cursor-pointer absolute right-2 top-2"
    title="Remove item"
  >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {
    /* Quantity & Item Subtotal */
  }
                  <div className="flex items-center justify-between pt-1 border-t border-[#5A3E36]/5">
                    <div className="flex items-center bg-white rounded-lg border border-[#5A3E36]/15 p-0.5">
                      <button
    type="button"
    onClick={() => onUpdateCartItemQty(item.id, item.quantity - 1)}
    className="w-6 h-6 rounded flex items-center justify-center text-[#5A3E36] hover:bg-[#FFF9F2] cursor-pointer"
  >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#5A3E36] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
    type="button"
    onClick={() => onUpdateCartItemQty(item.id, item.quantity + 1)}
    className="w-6 h-6 rounded flex items-center justify-center text-[#5A3E36] hover:bg-[#FFF9F2] cursor-pointer"
  >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-xs text-[#5A3E36]">
                      {item.totalItemPrice} <span className="text-[10px] text-[#E85D75]">ETB</span>
                    </div>
                  </div>
                </div>)}
          </div>

          {
    /* Customer Note */
  }
          <div className="px-4 py-2 bg-stone-50/50 border-t border-[#5A3E36]/10">
            <input
    type="text"
    value={customerNote}
    onChange={(e) => setCustomerNote(e.target.value)}
    placeholder="Order instructions (e.g. extra napkins, allergies)..."
    className="w-full text-xs bg-transparent border-none focus:outline-none text-[#5A3E36] placeholder:text-stone-400"
  />
          </div>

          {
    /* Totals & Submit Section */
  }
          <div className="p-4 border-t border-[#5A3E36]/10 bg-[#FFF9F2]/60 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#78716C]">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-[#5A3E36]">{subtotal} ETB</span>
              </div>
              <div className="flex items-center justify-between text-[#78716C]">
                <span>Campus VAT (5%)</span>
                <span className="font-mono font-semibold text-[#5A3E36]">{tax} ETB</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold pt-1.5 border-t border-[#5A3E36]/10 text-[#5A3E36]">
                <span>Total Due</span>
                <span className="text-xl font-black text-[#5A3E36]">
                  {total} <span className="text-xs font-semibold text-[#E85D75]">ETB</span>
                </span>
              </div>
            </div>

            {
    /* Large SUBMIT ORDER Button */
  }
            <button
    id="server-submit-order-btn"
    type="button"
    disabled={currentOrderItems.length === 0}
    onClick={handleQuickSubmit}
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

      </div>

      {
    /* Product Customization Modal when an ice cream is selected */
  }
      {activeCustomizingProduct && <CustomizationModal
    product={activeCustomizingProduct}
    onClose={() => setActiveCustomizingProduct(null)}
    onAddToCart={onAddToCart}
  />}

    </div>;
};
