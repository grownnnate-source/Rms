import { Key, CreditCard, Store } from "lucide-react";

export const ManagerSettingsTab = ({
  staff = [],
  onUpdateStaffPin
}) => {
  return (
    <div className="space-y-6">
      {/* Staff PIN Management */}
      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#E85D75]" />
          <div>
            <h3 className="font-bold text-sm text-[#5A3E36]">
              Staff Access & Security PINs
            </h3>
            <p className="text-xs text-[#78716C]">
              Configure 4-digit quick authorization codes for shift personnel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {staff.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#5A3E36] text-[#FFF9F2] font-bold text-xs flex items-center justify-center">
                  {member.avatar}
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-[#5A3E36] border border-[#5A3E36]/10">
                  {member.role}
                </span>
              </div>

              <div>
                <div className="font-bold text-sm text-[#5A3E36]">
                  {member.name}
                </div>
                <div className="text-[11px] text-[#78716C]">{member.shift}</div>
              </div>

              <div className="pt-2 border-t border-[#5A3E36]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#78716C]">Current PIN:</span>
                  <div className="font-mono font-bold text-sm tracking-widest text-[#5A3E36]">
                    •••• ({member.pin})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPin = window.prompt(
                      `Enter new 4-digit PIN for ${member.name}:`,
                      member.pin
                    );
                    if (newPin && newPin.length === 4) {
                      onUpdateStaffPin(member.id, newPin);
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-[#E85D75] hover:bg-[#F58FA3]/20 rounded-lg transition-colors cursor-pointer"
                >
                  Change PIN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapa Payment Gateway Settings */}
      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#0052FF]" />
          <div>
            <h3 className="font-bold text-sm text-[#5A3E36]">
              Chapa Gateway & Bank Integration
            </h3>
            <p className="text-xs text-[#78716C]">
              Ethiopian Telebirr, CBE Birr, and Visa/Mastercard settlement channel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5A3E36] mb-1">
              Chapa Merchant Public Key
            </label>
            <input
              type="text"
              readOnly
              value="CHASECK_TEST-384920412849102"
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5A3E36] mb-1">
              Webhook Receiver URL
            </label>
            <input
              type="text"
              readOnly
              value="https://campus-scoop.edu.et/api/chapa/webhook"
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700"
            />
          </div>
        </div>
      </div>

      {/* Store Profile */}
      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-[#5A3E36]" />
          <div>
            <h3 className="font-bold text-sm text-[#5A3E36]">
              Campus Store Parameters
            </h3>
            <p className="text-xs text-[#78716C]">
              Tax rate, currency unit and physical terminal identity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
            <span className="text-stone-500">Currency Unit</span>
            <div className="font-bold text-sm text-[#5A3E36] mt-0.5">
              ETB (Ethiopian Birr)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
            <span className="text-stone-500">Student Campus VAT</span>
            <div className="font-bold text-sm text-[#5A3E36] mt-0.5">
              5.0% flat
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
            <span className="text-stone-500">Thermal Printer Protocol</span>
            <div className="font-bold text-sm text-[#5A3E36] mt-0.5">
              ESC/POS 80mm Standard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettingsTab;
