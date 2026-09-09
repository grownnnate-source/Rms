import { useState } from "react";
import { CustomizationModal } from "../components/CustomizationModal";
import { HomeTopBar } from "../components/home/HomeTopBar";
import { CategoryTabs } from "../components/home/CategoryTabs";
import { ProductCard } from "../components/home/ProductCard";
import { CartSidebar } from "../components/home/CartSidebar";
import { RecentOrdersBar } from "../components/home/RecentOrdersBar";
import { Sparkles } from "lucide-react";

const createQuickItemId = (productId) =>
  `item-${productId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

export const HomePage = ({
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
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddCupWithSize = (product, cupSizeObj) => {
    if (!product.available) return;
    const price = Number(cupSizeObj.price) || 0;
    const newItem = {
      id: createQuickItemId(`${product.id}-${cupSizeObj.size}`),
      productId: product.id,
      name: `${product.name} (${cupSizeObj.size.toUpperCase()})`,
      category: product.category,
      scoops: 0,
      serving: `Paper Cup (${cupSizeObj.size.toUpperCase()})`,
      containerType: "Cup",
      cupSize: cupSizeObj.size,
      toppings: [],
      unitPrice: price,
      quantity: 1,
      totalItemPrice: price
    };
    onAddToCart(newItem);
  };

  const handleProductCardClick = (product) => {
    if (!product.available) return;
    if (product.category === "ice_cream") {
      setActiveCustomizingProduct(product);
    } else if (product.category === "cups") {
      const defaultSize =
        product.sizes && product.sizes.length > 0
          ? product.sizes[0]
          : { size: "sm", price: 20 };
      handleAddCupWithSize(product, defaultSize);
    } else if (product.category === "cones") {
      // Cone does NOT have a price: 0 ETB
      const newItem = {
        id: createQuickItemId(product.id),
        productId: product.id,
        name: product.name,
        category: product.category,
        scoops: 0,
        serving: "Regular Waffle Cone",
        containerType: "Cone",
        cupSize: "",
        toppings: [],
        unitPrice: 0,
        quantity: 1,
        totalItemPrice: 0
      };
      onAddToCart(newItem);
    } else {
      const newItem = {
        id: createQuickItemId(product.id),
        productId: product.id,
        name: product.name,
        category: product.category,
        scoops: 0,
        serving: "Standard",
        toppings: [],
        unitPrice: Number(product.price) || 0,
        quantity: 1,
        totalItemPrice: Number(product.price) || 0
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
      }, 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
      {/* Top Search, Order # & Notification Banner */}
      <HomeTopBar
        nextOrderNumber={nextOrderNumber}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearCart={onClearCart}
        hasCartItems={currentOrderItems.length > 0}
        showSubmissionSuccess={showSubmissionSuccess}
        lastSubmittedOrder={lastSubmittedOrder}
        onDismissSuccess={() => setShowSubmissionSuccess(false)}
      />

      {/* Main Grid: Left Products Catalog & Right Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Categories, Product Cards & Recent Submissions */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            products={products}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductCardClick}
                onAddCupWithSize={handleAddCupWithSize}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-[#5A3E36]/20">
              <Sparkles className="w-8 h-8 text-[#F58FA3] mx-auto mb-2 opacity-70" />
              <p className="text-sm font-bold text-[#5A3E36]">No items found</p>
              <p className="text-xs text-[#78716C] mt-1">
                Try switching category tabs or clearing search.
              </p>
            </div>
          )}

          <RecentOrdersBar recentOrders={recentOrders} />
        </div>

        {/* Right Column: Sticky Cart Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CartSidebar
            nextOrderNumber={nextOrderNumber}
            cartItems={currentOrderItems}
            onClearCart={onClearCart}
            onUpdateQty={onUpdateCartItemQty}
            onRemoveItem={onRemoveCartItem}
            customerNote={customerNote}
            setCustomerNote={setCustomerNote}
            onSubmitOrder={handleQuickSubmit}
          />
        </div>
      </div>

      {/* Product Customization Modal when an ice cream flavor is selected */}
      {activeCustomizingProduct && (
        <CustomizationModal
          product={activeCustomizingProduct}
          onClose={() => setActiveCustomizingProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export const ServerView = HomePage;
export default HomePage;
