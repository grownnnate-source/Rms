import { IceCream, Coffee, Sparkles, Leaf, Cookie, Sun, Utensils, Package, GlassWater, Citrus, Droplet, CircleDot } from "lucide-react";

const ICON_MAP = { Coffee, Sparkles, Leaf, Cookie, Sun, Utensils, Package, GlassWater, Citrus, Droplet, CircleDot, IceCream };
const CAT_MAP = { drinks: GlassWater, toppings: Sparkles, cups: Package, cones: IceCream };

export const ProductIcon = ({ iconName, category, colorAccent = "#5A3E36", className = "w-8 h-8" }) => {
  const Icon = ICON_MAP[iconName] || CAT_MAP[category] || IceCream;
  return (
    <div className="flex items-center justify-center rounded-xl transition-transform duration-200" style={{ backgroundColor: `${colorAccent}15` }}>
      <Icon className={className} style={{ color: colorAccent }} />
    </div>
  );
};
