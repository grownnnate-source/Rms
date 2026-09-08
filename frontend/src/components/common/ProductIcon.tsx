import React from 'react';
import { 
  IceCream, 
  Coffee, 
  Sparkles, 
  Leaf, 
  Cookie, 
  Sun, 
  Utensils, 
  Package, 
  GlassWater, 
  Citrus, 
  Droplet, 
  CircleDot 
} from 'lucide-react';
import { ProductCategory } from '../../types';

interface ProductIconProps {
  iconName?: string;
  category: ProductCategory;
  colorAccent?: string;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ 
  iconName, 
  category, 
  colorAccent = '#5A3E36', 
  className = 'w-8 h-8' 
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className={className} style={{ color: colorAccent }} />;
      case 'Sparkles':
        return <Sparkles className={className} style={{ color: colorAccent }} />;
      case 'Leaf':
        return <Leaf className={className} style={{ color: colorAccent }} />;
      case 'Cookie':
        return <Cookie className={className} style={{ color: colorAccent }} />;
      case 'Sun':
        return <Sun className={className} style={{ color: colorAccent }} />;
      case 'Utensils':
        return <Utensils className={className} style={{ color: colorAccent }} />;
      case 'Package':
        return <Package className={className} style={{ color: colorAccent }} />;
      case 'GlassWater':
        return <GlassWater className={className} style={{ color: colorAccent }} />;
      case 'Citrus':
        return <Citrus className={className} style={{ color: colorAccent }} />;
      case 'Droplet':
        return <Droplet className={className} style={{ color: colorAccent }} />;
      case 'CircleDot':
        return <CircleDot className={className} style={{ color: colorAccent }} />;
      case 'IceCream':
      default:
        if (category === 'drinks') {
          return <GlassWater className={className} style={{ color: colorAccent }} />;
        }
        if (category === 'toppings') {
          return <Sparkles className={className} style={{ color: colorAccent }} />;
        }
        if (category === 'cones') {
          return <IceCream className={className} style={{ color: colorAccent }} />;
        }
        if (category === 'cups') {
          return <Package className={className} style={{ color: colorAccent }} />;
        }
        return <IceCream className={className} style={{ color: colorAccent }} />;
    }
  };

  return (
    <div 
      className="flex items-center justify-center rounded-xl transition-transform duration-200"
      style={{ backgroundColor: `${colorAccent}15` }}
    >
      {getIcon()}
    </div>
  );
};
