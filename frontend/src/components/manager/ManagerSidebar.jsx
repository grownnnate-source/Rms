import { Store, LayoutDashboard, ShoppingBag, Layers, DollarSign, BarChart3, Settings } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders Archive", icon: ShoppingBag, key: "ordersCount" },
  { id: "products", label: "Products", icon: Layers, key: "productsCount" },
  { id: "expenses", label: "Expenses", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings & PIN", icon: Settings }
];

export const ManagerSidebar = ({ activeTab, setActiveTab, ordersCount = 0, productsCount = 0, todaySales = 0 }) => {
  const counts = { ordersCount, productsCount };

  return (
    <aside className="w-full md:w-64 bg-[#FFF9F2] border-r border-[#5A3E36]/10 p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-[#5A3E36] font-bold text-base">
            <Store className="w-5 h-5 text-[#E85D75]" />
            <span>Manager Suite</span>
          </div>
          <p className="text-xs text-[#78716C] mt-0.5">Admin Operations & ERP</p>
        </div>

        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.key ? counts[tab.key] : undefined;
            return (
              <button
                key={tab.id}
                id={`manager-nav-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive ? "bg-[#5A3E36] text-[#FFF9F2] shadow-sm" : "text-[#78716C] hover:text-[#5A3E36] hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#F58FA3]" : "text-[#78716C]"}`} />
                  <span>{tab.label}</span>
                </div>
                {count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#5A3E36]/10 text-[#5A3E36]"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#5A3E36]/10 space-y-2 text-xs">
        <div className="bg-white p-3 rounded-xl border border-[#5A3E36]/10 shadow-2xs">
          <div className="text-[11px] text-[#78716C]">Today&apos;s Settlement</div>
          <div className="font-bold text-sm text-[#5A3E36] mt-0.5 font-mono">{todaySales.toLocaleString()} ETB</div>
          <div className="flex items-center gap-1 text-[10px] text-[#65A30D] mt-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D]" />Chapa Instant Verified
          </div>
        </div>
        <div className="text-[11px] text-[#78716C] text-center">Campus Scoop v2.4 &bull; Addis Ababa Univ</div>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
