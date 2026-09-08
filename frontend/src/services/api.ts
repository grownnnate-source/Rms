import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Axios instance with JWT interceptor
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rms_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.IO singleton instance
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Authentication
export async function loginWithPin(pin: string, role?: string) {
  const res = await api.post('/auth/pin-login', { pin, role });
  if (res.data.token) {
    localStorage.setItem('rms_jwt_token', res.data.token);
    localStorage.setItem('rms_user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function fetchCurrentStaff() {
  const res = await api.get('/auth/me');
  return res.data;
}

// Products
export async function fetchProducts(category?: string) {
  const params = category && category !== 'all' ? { category } : {};
  const res = await api.get('/products', { params });
  return res.data.products;
}

export async function toggleProductAvailability(productId: string, isAvailable?: boolean) {
  const res = await api.patch(`/products/${productId}/availability`, { isAvailable });
  return res.data.product;
}

export async function createProduct(productData: any) {
  const res = await api.post('/products', productData);
  return res.data.product;
}

// Orders
export async function createOrder(items: any[]) {
  const res = await api.post('/orders', { items });
  return res.data.order;
}

export async function fetchOrders(status?: string) {
  const params = status ? { status } : {};
  const res = await api.get('/orders', { params });
  return res.data.orders;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
  return res.data.order;
}

// Payments
export async function initializePayment(orderId: string) {
  const res = await api.post(`/payments/initialize/${orderId}`);
  return res.data;
}

export async function verifyPayment(txRef: string, simulate: boolean = true) {
  const res = await api.get(`/payments/verify/${txRef}`, {
    params: { simulate: simulate ? 'true' : 'false' }
  });
  return res.data;
}

export async function processCashPayment(orderId: string) {
  const res = await api.post(`/payments/cash/${orderId}`);
  return res.data;
}

// Expenses
export async function fetchExpenses(category?: string) {
  const params = category ? { category } : {};
  const res = await api.get('/expenses', { params });
  return res.data.expenses;
}

export async function createExpense(expenseData: { title: string; category: string; amount: number; date?: string }) {
  const res = await api.post('/expenses', expenseData);
  return res.data.expense;
}

export async function deleteExpense(expenseId: string) {
  const res = await api.delete(`/expenses/${expenseId}`);
  return res.data;
}

// Analytics
export async function fetchFinancialSummary(period: string = 'today') {
  const res = await api.get('/analytics/financial-summary', { params: { period } });
  return res.data.summary;
}

export async function fetchBestSellers() {
  const res = await api.get('/analytics/best-sellers');
  return res.data.bestSellers;
}

export async function fetchSalesTrends() {
  const res = await api.get('/analytics/sales-trend');
  return res.data.trends;
}
