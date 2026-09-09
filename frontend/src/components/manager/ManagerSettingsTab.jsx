import { useState } from "react";
import { Key, CreditCard, Store, Check, X } from "lucide-react";

export const ManagerSettingsTab = ({ staff = [], onUpdateStaffPin }) => {
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [newPin, setNewPin] = useState("");

  const handleSavePin = (memberId) => {
    if (newPin.length === 4) {
      onUpdateStaffPin(memberId, newPin);
      setEditingMemberId(null);
      setNewPin("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#E85D75]" />
          <div><h3 className="font-bold text-sm text-[#5A3E36]">Staff Access & Security PINs</h3><p className="text-xs text-[#78716C]">View and edit 4-digit terminal authorization codes for shift personnel</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {staff.map((m) => {
            const initials = (m.name || "S").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const isEditing = editingMemberId === m.id;
            return (
              <div key={m.id} className="p-4 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#5A3E36] text-[#FFF9F2] font-bold text-xs flex items-center justify-center">{initials}</div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-[#5A3E36] border border-[#5A3E36]/10">{m.role}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#5A3E36]">{m.name}</div>
                  <div className="text-[11px] text-[#78716C] capitalize">{m.isActive !== false ? "Active Staff" : "Deactivated"}</div>
                </div>
                {isEditing ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSavePin(m.id); }} className="pt-2 border-t border-[#5A3E36]/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5A3E36]"><span>New PIN:</span><span className="text-[10px] font-mono text-[#78716C]">{newPin.length}/4</span></div>
                    <div className="flex items-center gap-2">
                      <input type="text" inputMode="numeric" maxLength={4} autoFocus placeholder="5555" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))} className="w-24 px-2 py-1 text-center font-mono font-bold tracking-widest text-sm bg-white border-2 border-[#E85D75] rounded-lg focus:outline-none text-[#5A3E36]" />
                      <button type="submit" disabled={newPin.length !== 4} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E85D75] hover:bg-[#d44860] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"><Check className="w-3.5 h-3.5" /><span>Save</span></button>
                      <button type="button" onClick={() => { setEditingMemberId(null); setNewPin(""); }} className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-2 border-t border-[#5A3E36]/10 flex items-center justify-between">
                    <div><span className="text-[10px] text-[#78716C] block">PIN:</span><span className="px-2 py-0.5 rounded-lg bg-white border border-[#5A3E36]/15 font-mono font-bold text-sm text-[#5A3E36] tracking-widest">{m.pin || "----"}</span></div>
                    <button type="button" onClick={() => { setEditingMemberId(m.id); setNewPin(""); }} className="px-2.5 py-1 text-xs font-bold text-[#E85D75] hover:bg-[#F58FA3]/20 bg-white border border-[#E85D75]/30 rounded-lg transition-colors cursor-pointer">Change PIN</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#0052FF]" /><div><h3 className="font-bold text-sm text-[#5A3E36]">Chapa Gateway & Bank Integration</h3><p className="text-xs text-[#78716C]">Ethiopian Telebirr, CBE Birr, and Visa/Mastercard settlement channel</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-bold text-[#5A3E36] mb-1">Chapa Public Key</label><input type="text" readOnly value="CHASECK_TEST-384920412849102" className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700" /></div>
          <div><label className="block text-xs font-bold text-[#5A3E36] mb-1">Webhook Receiver URL</label><input type="text" readOnly value="https://campus-scoop.edu.et/api/chapa/webhook" className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-300 text-stone-700" /></div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#5A3E36]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2"><Store className="w-5 h-5 text-[#5A3E36]" /><div><h3 className="font-bold text-sm text-[#5A3E36]">Campus Store Parameters</h3><p className="text-xs text-[#78716C]">Tax rate, currency unit and physical terminal identity</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {[
            { label: "Currency Unit", val: "ETB (Ethiopian Birr)" },
            { label: "Student Campus VAT", val: "15.0% flat" },
            { label: "Thermal Printer Protocol", val: "ESC/POS 80mm Standard" }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/10">
              <span className="text-stone-500">{item.label}</span>
              <div className="font-bold text-sm text-[#5A3E36] mt-0.5">{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerSettingsTab;
