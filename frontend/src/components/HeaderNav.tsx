import React from 'react';
import { Role } from '../types';
import { IceCream, CreditCard, LayoutDashboard, Clock, Store, RotateCcw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface HeaderNavProps {
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  pendingOrdersCount: number;
  onResetData: () => void;
  onAddSampleOrder: () => void;
  activeStaffName: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentRole,
  onSelectRole,
  pendingOrdersCount,
  onResetData,
  onAddSampleOrder,
  activeStaffName,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#5A3E36]/10 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Campus Identity */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center shadow-sm">
              <IceCream className="w-5 h-5 text-[#F58FA3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#5A3E36]">Campus Scoop</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#65A30D]/15 text-[#4D7C0F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] mr-1.5 animate-pulse"></span>
                  Shop Open
                </span>
              </div>
              <p className="text-xs text-[#78716C]">University Student Center • Term II POS</p>
            </div>
          </div>

          {/* Quick Staff Badge (Mobile) */}
          <div className="md:hidden flex items-center gap-1.5 text-xs text-[#5A3E36] bg-[#FFF9F2] px-2.5 py-1 rounded-lg border border-[#5A3E36]/10 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#E85D75]"></span>
            {activeStaffName}
          </div>
        </div>

        {/* 3 Role Switcher Pills */}
        <nav aria-label="System role navigation" className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15 shadow-inner">
          <button
            id="role-server-tab"
            type="button"
            onClick={() => onSelectRole('server')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentRole === 'server'
                ? 'bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10'
                : 'text-[#78716C] hover:text-[#5A3E36]'
            }`}
          >
            <IceCream className={`w-4 h-4 ${currentRole === 'server' ? 'text-[#E85D75]' : 'text-[#78716C]'}`} />
            <span>1. Server</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F58FA3]/20 text-[#5A3E36]">Tablet</span>
          </button>

          <button
            id="role-cashier-tab"
            type="button"
            onClick={() => onSelectRole('cashier')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
              currentRole === 'cashier'
                ? 'bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10'
                : 'text-[#78716C] hover:text-[#5A3E36]'
            }`}
          >
            <CreditCard className={`w-4 h-4 ${currentRole === 'cashier' ? 'text-[#E85D75]' : 'text-[#78716C]'}`} />
            <span>2. Cashier</span>
            {pendingOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#E85D75] rounded-full animate-bounce">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            id="role-manager-tab"
            type="button"
            onClick={() => onSelectRole('manager')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentRole === 'manager'
                ? 'bg-white text-[#5A3E36] shadow-sm font-bold border border-[#5A3E36]/10'
                : 'text-[#78716C] hover:text-[#5A3E36]'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${currentRole === 'manager' ? 'text-[#E85D75]' : 'text-[#78716C]'}`} />
            <span>3. Manager</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#5A3E36]/10 text-[#5A3E36]">Desktop</span>
          </button>
        </nav>

        {/* System Meta & Demo Helper */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#5A3E36]">{activeStaffName}</div>
            <div className="text-[11px] text-[#78716C] flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-[#E85D75]" />
              <span>Shift Active</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#5A3E36]/15"></div>

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
