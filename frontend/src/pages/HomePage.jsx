import { useState } from "react";
import { CustomizationModal } from "../components/CustomizationModal";
import { HomeTopBar } from "../components/home/HomeTopBar";
import { CategoryTabs } from "../components/home/CategoryTabs";
import { ProductCard } from "../components/home/ProductCard";
import { CartSidebar } from "../components/home/CartSidebar";
import { RecentOrdersBar } from "../components/home/RecentOrdersBar";
import { Sparkles } from "lucide-react";

const makeItem = (p, { serving = "Standard", containerType = "", cupSize = "", price = Number(p.price) || 0, name = p.name, idSuffix = "" } = {}) => ({
  id: `item-${p.id}-${idSuffix || Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  productId: p.id, name, category: p.category, scoops: 0, serving, containerType, cupSize, toppings: [],
  unitPrice: price, quantity: 1, totalItemPrice: price
});

export const HomePage = ({
  products, currentOrderItems, onAddToCart, onUpdateCartItemQty, onRemoveCartItem,
  onClearCart, onSubmitOrder, recentOrders, nextOrderNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState("ice_cream");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomizingProduct, setActiveCustomizingProduct] = useState(null);
  const [customerNote, setCustomerNote] = useState("");
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === p.category;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddCupWithSize = (p, sizeObj) => {
    if (!p.available) return;
    const s = sizeObj.size;
    onAddToCart(makeItem(p, { name: `${p.name} (${s.toUpperCase()})`, serving: `Paper Cup (${s.toUpperCase()})`, containerType: "Cup", cupSize: s, price: Number(sizeObj.price) || 0, idSuffix: s }));
  };

  const handleProductCardClick = (p) => {
    if (!p.available) return;
    if (p.category === "ice_cream") setActiveCustomizingProduct(p);
    else if (p.category === "cups") handleAddCupWithSize(p, p.sizes?.[0] || { size: "sm", price: 20 });
    else if (p.category === "cones") onAddToCart(makeItem(p, { serving: "Regular Waffle Cone", containerType: "Cone", price: 0 }));
    else onAddToCart(makeItem(p));
  };

  const handleQuickSubmit = () => {
    if (currentOrderItems.length === 0) return;
    const submitted = onSubmitOrder(customerNote);
    if (submitted) {
      setLastSubmittedOrder(submitted);
      setShowSubmissionSuccess(true);
      setCustomerNote("");
      setTimeout(() => setShowSubmissionSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      <HomeTopBar
        nextOrderNumber={nextOrderNumber} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onClearCart={onClearCart} hasCartItems={currentOrderItems.length > 0} showSubmissionSuccess={showSubmissionSuccess}
        lastSubmittedOrder={lastSubmittedOrder} onDismissSuccess={() => setShowSubmissionSuccess(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} products={products} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map((p) => <ProductCard key={p.id} product={p} onProductClick={handleProductCardClick} onAddCupWithSize={handleAddCupWithSize} />)}
          </div>
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-[#5A3E36]/20">
              <Sparkles className="w-8 h-8 text-[#F58FA3] mx-auto mb-2 opacity-70" /><p className="text-sm font-bold text-[#5A3E36]">No items found</p><p className="text-xs text-[#78716C] mt-1">Try switching category tabs or clearing search.</p>
            </div>
          )}
          <RecentOrdersBar recentOrders={recentOrders} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <CartSidebar
            nextOrderNumber={nextOrderNumber} cartItems={currentOrderItems} onClearCart={onClearCart}
            onUpdateQty={onUpdateCartItemQty} onRemoveItem={onRemoveCartItem} customerNote={customerNote}
            setCustomerNote={setCustomerNote} onSubmitOrder={handleQuickSubmit}
          />
        </div>
      </div>

      {activeCustomizingProduct && <CustomizationModal product={activeCustomizingProduct} products={products} onClose={() => setActiveCustomizingProduct(null)} onAddToCart={onAddToCart} />}
    </div>
  );
};

export default HomePage;
