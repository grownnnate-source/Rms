import axios from "axios";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rms_jwt_token");
  if (token) {
    if (config.headers?.set) config.headers.set("Authorization", `Bearer ${token}`);
    else config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("rms_jwt_token");
      localStorage.removeItem("rms_user");
    }
    return Promise.reject(err);
  }
);

export const socket = io(SOCKET_URL, { autoConnect: true, reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000 });

export async function loginWithPin(pin, role) {
  const res = await api.post("/auth/pin-login", role ? { pin, role } : { pin });
  if (res.data.token) {
    localStorage.setItem("rms_jwt_token", res.data.token);
    localStorage.setItem("rms_user", JSON.stringify(res.data.user));
  }
  return res.data;
}

export const fetchCurrentStaff = () => api.get("/auth/me").then((r) => r.data);
export const fetchStaff = () => api.get("/auth/staff").then((r) => r.data.staff);
export const updateStaffPinApi = (id, pin) => api.patch(`/auth/staff/${id}/pin`, { pin }).then((r) => r.data);

export const fetchProducts = (category) => api.get("/products", { params: category && category !== "all" ? { category } : {} }).then((r) => r.data.products);
export const toggleProductAvailability = (id, isAvailable) => api.patch(`/products/${id}/availability`, { isAvailable }).then((r) => r.data.product);
export const createProduct = (data) => api.post("/products", data).then((r) => r.data.product);

export const createOrder = (items, note = "") => api.post("/orders", { items, note }).then((r) => r.data.order);
export const fetchOrders = (status) => api.get("/orders", { params: status ? { status } : {} }).then((r) => r.data.orders);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data.order);

export const initializePayment = (id) => api.post(`/payments/initialize/${id}`).then((r) => r.data);
export const verifyPayment = (txRef, simulate = true) => api.get(`/payments/verify/${txRef}`, { params: { simulate: simulate ? "true" : "false" } }).then((r) => r.data);
export const processCashPayment = (id) => api.post(`/payments/cash/${id}`).then((r) => r.data);

export const fetchExpenses = (category) => api.get("/expenses", { params: category ? { category } : {} }).then((r) => r.data.expenses);
export const createExpense = (data) => api.post("/expenses", data).then((r) => r.data.expense);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`).then((r) => r.data);

export { api };
export default api;
