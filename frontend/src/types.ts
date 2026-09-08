export type Role = 'server' | 'cashier' | 'manager';

export type ProductCategory = 'ice_cream' | 'toppings' | 'cones' | 'cups' | 'drinks';

export type ServingType = 'Cup' | 'Cone' | 'Waffle Bowl';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

export type PaymentMethod = 'CHAPA_QR' | 'CHAPA_CARD' | 'TELEBIRR' | 'CBE_BIRR' | 'CASH';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // in ETB
  available: boolean;
  scoopsDefault?: number;
  calories?: number;
  popular?: boolean;
  badge?: string;
  iconName: string; // lucide icon identifier or visual category
  colorAccent?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  scoops: number;
  serving: ServingType;
  toppings: string[];
  unitPrice: number;
  quantity: number;
  totalItemPrice: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  serverName: string;
  cashierName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number; // ETB
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  chapaTxRef: string;
  paidAt?: string;
  customerNote?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Dairy & Cream' | 'Cones & Packaging' | 'Equipment & Chiller' | 'Utilities & Power' | 'Staff Stipend' | 'Platform & Fees';
  amount: number; // ETB
  date: string;
  status: 'Paid' | 'Pending';
  approvedBy: string;
}

export interface SalesDataPoint {
  label: string;
  revenue: number;
  ordersCount: number;
  itemsSold: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  pin: string;
  avatar: string;
  shift: string;
}
