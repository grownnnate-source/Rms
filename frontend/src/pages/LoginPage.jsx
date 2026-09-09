import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { loginWithPin } from "../lib/axios";
import { IceCream, KeyRound, Delete, ArrowRight, AlertCircle, Radio } from "lucide-react";

export const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const attemptLogin = useCallback(async (pinToSubmit) => {
    if (pinToSubmit.length !== 4) return setErrorMsg("Please enter your 4-digit staff PIN");
    setIsLoading(true);
    try {
      const result = await loginWithPin(pinToSubmit);
      if (result?.success && result?.user) {
        onLoginSuccess?.(result.user, result.token);
        navigate(`/${result.user.role}`, { replace: true });
      } else {
        setErrorMsg(result?.message || "Authentication failed");
        setPin("");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid staff PIN. Please check your code and try again.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onLoginSuccess]);

  const handleKeyPress = useCallback((digit) => {
    if (pin.length < 4 && !isLoading) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg("");
      if (nextPin.length === 4) attemptLogin(nextPin);
    }
  }, [pin, isLoading, attemptLogin]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") handleKeyPress(e.key);
      else if (e.key === "Backspace") { setPin((p) => p.slice(0, -1)); setErrorMsg(""); }
      else if (e.key === "Escape") { setPin(""); setErrorMsg(""); }
      else if (e.key === "Enter" && pin.length === 4) attemptLogin(pin);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKeyPress, pin, attemptLogin]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#5A3E36]/15 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gradient-to-b from-[#FFF9F2] to-[#F5ECE1] p-8 flex flex-col justify-center gap-5 border-b md:border-b-0 md:border-r border-[#5A3E36]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5A3E36] text-[#FFF9F2] flex items-center justify-center shadow-md">
              <IceCream className="w-6 h-6 text-[#F58FA3]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#5A3E36]">Campus Scoop</h1>
              <p className="text-xs text-[#78716C]">Staff POS Terminal</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 border border-[#5A3E36]/10 text-xs text-[#78716C] leading-relaxed flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-[#E85D75] shrink-0 mt-0.5 animate-pulse" />
            <span>Enter your 4-digit PIN to automatically open your assigned terminal (Attendant, Cashier, or Manager).</span>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A3E36] mb-3">
            <KeyRound className="w-3.5 h-3.5 text-[#E85D75]" />
            <span>Enter Staff PIN</span>
          </div>

          <div className="flex gap-3 mb-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${pin.length > i ? "border-[#E85D75] bg-[#FFF9F2] scale-105" : "border-[#5A3E36]/20 bg-stone-50"}`}>
                {pin.length > i && <span className="w-3 h-3 rounded-full bg-[#E85D75]" />}
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-3 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Del"].map((key) => (
              <button
                key={key}
                type="button"
                disabled={isLoading || (typeof key === "string" && pin.length === 0)}
                onClick={() => {
                  if (key === "Clear") { setPin(""); setErrorMsg(""); }
                  else if (key === "Del") { setPin((p) => p.slice(0, -1)); setErrorMsg(""); }
                  else handleKeyPress(String(key));
                }}
                className="h-12 rounded-xl bg-[#FFF9F2] hover:bg-[#5A3E36] text-[#5A3E36] hover:text-white font-mono font-bold text-lg border border-[#5A3E36]/15 transition-all flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-95"
              >
                {key === "Del" ? <Delete className="w-4 h-4" /> : key}
              </button>
            ))}
          </div>

          <button
            id="login-submit-btn"
            type="button"
            disabled={isLoading || pin.length !== 4}
            onClick={() => attemptLogin(pin)}
            className="w-full max-w-[240px] py-3 rounded-xl bg-[#E85D75] hover:bg-[#d44860] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-sm"
          >
            <span>{isLoading ? "Authenticating..." : "Authenticate"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
