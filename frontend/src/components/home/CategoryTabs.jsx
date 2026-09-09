const CATEGORIES = [
  { id: "ice_cream", label: "Ice Cream" },
  { id: "toppings", label: "Toppings" },
  { id: "cones", label: "Cones" },
  { id: "cups", label: "Cups" },
  { id: "drinks", label: "Drinks" }
];

export const CategoryTabs = ({
  categories = CATEGORIES,
  selectedCategory,
  onSelectCategory,
  products = []
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = products.filter((p) => p.category === cat.id).length;
        return (
          <button
            key={cat.id}
            id={`cat-tab-${cat.id}`}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isActive
                ? "bg-[#5A3E36] text-[#FFF9F2] shadow-sm ring-2 ring-[#5A3E36]/20"
                : "bg-white text-[#78716C] hover:text-[#5A3E36] hover:bg-stone-50 border border-[#5A3E36]/10"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive
                  ? "bg-[#F58FA3]/30 text-[#FFF9F2]"
                  : "bg-[#FFF9F2] text-[#78716C]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
