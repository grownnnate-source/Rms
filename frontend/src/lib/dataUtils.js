const ICONS = [[/choco|chip|oreo|cone/i, "Cookie"], [/vanilla|caramel/i, "IceCream"], [/straw|berry|topping/i, "Sparkles"], [/mango|passion/i, "Sun"], [/mint|matcha/i, "Leaf"], [/coffee|mocha/i, "Coffee"], [/cup/i, "Package"], [/drink/i, "GlassWater"]];
const ACCENTS = [[/choco|oreo|mocha/i, "#5A3E36"], [/vanilla/i, "#F6E05E"], [/straw/i, "#F58FA3"], [/mango|passion/i, "#EA580C"], [/mint/i, "#65A30D"], [/caramel|cone/i, "#D97706"], [/sprink|m&m/i, "#E85D75"], [/cup/i, "#78716C"]];

export const getIconForProduct = (n = "", c = "") => ICONS.find(([re]) => re.test(n) || re.test(c))?.[1] || "IceCream";
export const getColorAccentForProduct = (n = "", c = "") => ACCENTS.find(([re]) => re.test(n) || re.test(c))?.[1] || "#5A3E36";

export function normalizeProduct(p) {
  const cat = (p.category || "ice_cream").toLowerCase().replace(/\s+/g, "_");
  return {
    id: p._id || p.id, name: p.name, category: cat, description: p.description || "", price: Number(p.price) || 0,
    available: p.isAvailable !== undefined ? Boolean(p.isAvailable) : (p.available !== undefined ? Boolean(p.available) : true),
    iconName: p.iconName || getIconForProduct(p.name, cat),
    colorAccent: p.colorAccent || getColorAccentForProduct(p.name, cat),
    badge: p.badge || (Number(p.price) >= 270 ? "Bestseller" : ""),
    scoopsDefault: p.scoopsDefault || 1, sizes: Array.isArray(p.sizes) ? p.sizes : []
  };
}

export function normalizeOrder(o) {
  if (!o) return null;
  const num = typeof o.orderNumber === "string" ? parseInt(o.orderNumber.replace(/\D/g, ""), 10) || 101 : Number(o.orderNumber) || 101;
  const status = o.status === "CREATED" || o.status === "PAYMENT_PENDING" ? "PENDING" : o.status || "PENDING";
  const items = (o.items || []).map((i) => ({
    id: String(i._id || i.id || `item-${Math.random().toString(36).slice(2, 6)}`),
    productId: i.product || i.productId, name: i.name, category: i.category || "ice_cream",
    scoops: i.options?.scoops || 1, serving: i.options?.containerType || "Cup", cupSize: i.options?.cupSize || "",
    toppings: i.options?.toppings || [], unitPrice: Number(i.unitPrice) || 0, quantity: Number(i.quantity) || 1,
    totalItemPrice: Number(i.itemTotal) || (Number(i.unitPrice) || 0) * (Number(i.quantity) || 1)
  }));
  const total = Number(o.totalAmount || o.total) || 0;
  const subtotal = o.subtotal ? Number(o.subtotal) : Math.round(total / 1.15);
  return {
    id: String(o._id || o.id || `ord-${num}`), orderNumber: num,
    createdAt: (o.createdAt ? new Date(o.createdAt) : new Date()).toISOString().replace("T", " ").slice(0, 16),
    serverName: o.attendant?.name || o.serverName || "Attendant Staff", cashierName: o.cashierName || "Counter Cashier",
    status, items, subtotal, tax: o.tax ? Number(o.tax) : total - subtotal, total,
    paymentMethod: o.payment?.paymentMethod || o.paymentMethod || "CHAPA_QR",
    chapaTxRef: o.payment?.txRef || o.chapaTxRef || `RMS-${num}-${Date.now()}`,
    customerNote: o.customerNote || o.note || ""
  };
}

export function upsertOrder(prev, raw) {
  const norm = normalizeOrder(raw);
  if (!norm) return prev;
  const idx = prev.findIndex((o) => (norm.id && String(o.id) === String(norm.id)) || (norm.orderNumber && o.orderNumber === norm.orderNumber));
  if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], ...norm }; return copy; }
  return [norm, ...prev];
}

const FALLBACK_SERIES = {
  Daily: ["09:00", "12:00", "15:00", "18:00", "21:00"].map((time) => ({ time, revenue: 0, ordersCount: 0, itemsSold: 0 })),
  Monthly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({ day, revenue: 0, ordersCount: 0, itemsSold: 0 })),
  Yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => ({ month, revenue: 0, ordersCount: 0, itemsSold: 0 }))
};

export function computeChartData(paidOrders, period) {
  if (!paidOrders?.length) return FALLBACK_SERIES[period] || FALLBACK_SERIES.Daily;
  const groups = {};
  paidOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = period === "Daily" ? (isNaN(d) ? "12:00" : `${String(d.getHours()).padStart(2, "0")}:00`)
      : period === "Monthly" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay() || 0]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth() || 0];
    if (!groups[key]) groups[key] = { [period === "Daily" ? "time" : period === "Monthly" ? "day" : "month"]: key, revenue: 0, ordersCount: 0, itemsSold: 0 };
    groups[key].revenue += o.total;
    groups[key].ordersCount += 1;
    groups[key].itemsSold += o.items.reduce((s, i) => s + (i.quantity || 1), 0);
  });
  return Object.values(groups);
}

export function addToCart(cart, item) {
  const tKey = (arr) => JSON.stringify((arr || []).slice().sort());
  const idx = cart.findIndex((i) => i.productId === item.productId && i.serving === item.serving && i.scoops === item.scoops && tKey(i.toppings) === tKey(item.toppings));
  if (idx > -1) {
    const updated = [...cart], cur = updated[idx], qty = cur.quantity + item.quantity;
    updated[idx] = { ...cur, quantity: qty, totalItemPrice: (cur.totalItemPrice / cur.quantity) * qty };
    return updated;
  }
  return [...cart, item];
}

export function updateCartQty(cart, index, delta) {
  const cur = cart[index];
  if (!cur) return cart;
  const qty = cur.quantity + delta;
  if (qty <= 0) return cart.filter((_, i) => i !== index);
  const updated = [...cart];
  updated[index] = { ...cur, quantity: qty, totalItemPrice: (cur.totalItemPrice / cur.quantity) * qty };
  return updated;
}

export function formatOrderItems(items, products = []) {
  const fallbackId = products.find((p) => /^[0-9a-fA-F]{24}$/.test(p.id))?.id;
  return items.map((i) => ({
    product: /^[0-9a-fA-F]{24}$/.test(i.productId) ? i.productId : (fallbackId || i.productId),
    name: i.name, unitPrice: i.unitPrice, quantity: i.quantity,
    options: { scoops: i.scoops || 1, containerType: i.serving?.includes("Cone") ? "Cone" : "Cup", cupSize: i.cupSize || "", toppings: i.toppings || [] }
  }));
}

export function createFallbackOrder(items, orderNumber, serverName = "Attendant Staff", note = "") {
  const subtotal = items.reduce((s, i) => s + i.totalItemPrice, 0), tax = Math.round(subtotal * 0.15);
  return {
    id: `ord-${Date.now()}`, orderNumber, createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    serverName: serverName || "Attendant Staff", cashierName: "Counter Cashier", status: "PENDING",
    items: [...items], subtotal, tax, total: subtotal + tax, paymentMethod: "CHAPA_QR",
    chapaTxRef: `RMS-${orderNumber}-${Date.now()}`, customerNote: (note || "").trim()
  };
}
