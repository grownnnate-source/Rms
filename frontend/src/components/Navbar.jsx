import { Link, useLocation } from "react-router";
import {
  IceCream,
  CreditCard,
  LayoutDashboard,
  Clock,
  RotateCcw,
  PlusCircle,
  LogIn,
  LogOut,
  UserCheck
} from "lucide-react";

export const Navbar = ({
  pendingOrdersCount = 0,
  onResetData,
  onAddSampleOrder,
  activeStaffName = "Staff User",
  currentUser,
  onLogout
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isServer = currentPath === "/" || currentPath === "/server";
  const isCashier = currentPath === "/cashier";
  const isManager = currentPath === "/manager";
  const isLogin = currentPath === "/login";

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#5A3E36]/10 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Campus Identity */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <IceCream className="w-5 h-5 text-[#F58FA3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#5A3E36]">Campus Scoop</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#65A30D]/15 text-[#4D7C0F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] mr-1.5 animate-pulse" />
                  Shop Open
                </span>
              </div>
              <p className="text-xs text-[#78716C]">University Student Center • Term II POS</p>
            </div>
          </Link>

          {/* Quick Staff Badge (Mobile) */}
          <div className="md:hidden flex items-center gap-1.5 text-xs text-[#5A3E36] bg-[#FFF9F2] px-2.5 py-1 rounded-lg border border-[#5A3E36]/10 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#E85D75]" />
            <span>{activeStaffName}</span>
          </div>
        </div>

        {/* Role Switcher Pills via React Router */}
        <nav aria-label="System role navigation" className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15 shadow-inner">
          <Link
            id="role-server-tab"
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isServer
                ? "bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10"
                : "text-[#78716C] hover:text-[#5A3E36]"
            }`}
          >
            <IceCream className={`w-4 h-4 ${isServer ? "text-[#E85D75]" : "text-[#78716C]"}`} />
            <span>1. Server</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F58FA3]/20 text-[#5A3E36]">Tablet</span>
          </Link>

          <Link
            id="role-cashier-tab"
            to="/cashier"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
              isCashier
                ? "bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10"
                : "text-[#78716C] hover:text-[#5A3E36]"
            }`}
          >
            <CreditCard className={`w-4 h-4 ${isCashier ? "text-[#E85D75]" : "text-[#78716C]"}`} />
            <span>2. Cashier</span>
            {pendingOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#E85D75] rounded-full animate-bounce">
                {pendingOrdersCount}
              </span>
            )}
          </Link>

          <Link
            id="role-manager-tab"
            to="/manager"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isManager
                ? "bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10"
                : "text-[#78716C] hover:text-[#5A3E36]"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${isManager ? "text-[#E85D75]" : "text-[#78716C]"}`} />
            <span>3. Manager</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#5A3E36]/10 text-[#5A3E36]">Desktop</span>
          </Link>

          <Link
            id="role-login-tab"
            to="/login"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isLogin
                ? "bg-white text-[#E85D75] shadow-sm font-bold border border-[#E85D75]/30"
                : "text-[#78716C] hover:text-[#5A3E36]"
            }`}
          >
            <LogIn className={`w-4 h-4 ${isLogin ? "text-[#E85D75]" : "text-[#78716C]"}`} />
            <span>Login</span>
          </Link>
        </nav>

        {/* System Meta, Staff Profile & Demo Helpers */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#5A3E36] flex items-center justify-end gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#65A30D]" />
              <span>{currentUser?.name || activeStaffName}</span>
            </div>
            <div className="text-[11px] text-[#78716C] flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-[#E85D75]" />
              <span className="capitalize">{currentUser?.role || "Staff"} Session Active</span>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Sign out or switch staff"
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <div className="h-7 w-[1px] bg-[#5A3E36]/15" />

          {/* Quick Demo action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="demo-add-order-btn"
              type="button"
              onClick={onAddSampleOrder}
              title="Add a sample incoming order for demonstration"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#5A3E36] bg-[#FFF9F2] hover:bg-[#F58FA3]/20 border border-[#5A3E36]/15 rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#E85D75]" />
              <span>+ Sample Order</span>
            </button>

            <button
              id="demo-reset-btn"
              type="button"
              onClick={onResetData}
              title="Reset data to initial state"
              className="p-1.5 text-[#78716C] hover:text-[#5A3E36] hover:bg-[#FFF9F2] rounded-lg transition-colors border border-transparent hover:border-[#5A3E36]/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
