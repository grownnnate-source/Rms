import { IceCream, CreditCard, LayoutDashboard, LogOut, UserCheck } from "lucide-react";

const BADGES = {
  cashier: { label: "Cashier Terminal", icon: CreditCard, cls: "bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20" },
  manager: { label: "Manager Administration", icon: LayoutDashboard, cls: "bg-[#5A3E36]/10 text-[#5A3E36] border-[#5A3E36]/20" },
  attendant: { label: "Server POS Terminal", icon: IceCream, cls: "bg-[#E85D75]/10 text-[#E85D75] border-[#E85D75]/20" }
};

export const Navbar = ({ activeStaffName = "Staff User", currentUser, onLogout }) => {
  const badge = BADGES[currentUser?.role] || BADGES.attendant;
  const BadgeIcon = badge.icon;

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#5A3E36]/10 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center shadow-sm">
            <IceCream className="w-5 h-5 text-[#F58FA3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#5A3E36]">Campus Scoop</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#65A30D]/15 text-[#4D7C0F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] mr-1.5 animate-pulse" />Live Session
              </span>
            </div>
            <p className="text-xs text-[#78716C]">University Student Center POS Terminal</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-center">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs border ${badge.cls}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#5A3E36] flex items-center justify-end gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#65A30D]" />
              <span>{currentUser?.name || activeStaffName}</span>
            </div>
            <div className="text-[11px] text-[#78716C] flex items-center justify-end gap-1">
              <span className="capitalize font-medium text-[#E85D75]">{currentUser?.role || "Staff"}</span>
              <span>&bull; Active</span>
            </div>
          </div>
          {onLogout && (
            <button
              id="staff-sign-out-btn"
              type="button"
              onClick={onLogout}
              title="Sign out of current staff session"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-rose-600 bg-[#FFF9F2] hover:bg-rose-50 rounded-xl border border-[#5A3E36]/15 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
