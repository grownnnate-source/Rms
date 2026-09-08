import React, { useState } from 'react';
import { Order, PaymentStatus } from '../../types';
import { ChapaPaymentModal } from './ChapaPaymentModal';
import { ReceiptModal } from '../receipt/ReceiptModal';
import { 
  CreditCard, 
  Printer, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  List, 
  Grid 
} from 'lucide-react';

interface CashierViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: PaymentStatus) => void;
}

export const CashierView: React.FC<CashierViewProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState<Order | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'ALL' || ord.status === filterStatus;
    const matchesSearch = 
      ord.orderNumber.toString().includes(searchQuery) ||
      ord.serverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Aggregates
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const paidCount = orders.filter((o) => o.status === 'PAID').length;
  const totalSettledToday = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const getStatusPill = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#65A30D]/15 text-[#4D7C0F] border border-[#65A30D]/30">
            <CheckCircle2 className="w-3 h-3 text-[#65A30D]" />
            <span>PAID</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>FAILED</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700 border border-stone-300">
            <Clock className="w-3 h-3 text-stone-500" />
            <span>EXPIRED</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>PAYMENT PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 space-y-5">
      
      {/* Top Cashier Counter Summary Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
          <div className="text-xs text-[#78716C]">Payment Pending Queue</div>
          <div className="text-2xl font-black text-[#5A3E36] mt-1 flex items-center gap-2">
            <span>{pendingCount}</span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                Action Required
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
          <div className="text-xs text-[#78716C]">Settled Orders Today</div>
          <div className="text-2xl font-black text-[#65A30D] mt-1">
            {paidCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs">
          <div className="text-xs text-[#78716C]">Cashier Revenue Cleared</div>
          <div className="text-2xl font-black text-[#5A3E36] mt-1">
            {totalSettledToday} <span className="text-xs font-bold text-[#E85D75]">ETB</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-[#78716C]">Chapa Gateway Node</div>
            <div className="text-xs font-bold text-[#0052FF] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse"></span>
              <span>Telebirr / CBE Live</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center font-bold text-xs">
            ET
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A3E36]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Incoming', count: orders.length },
            { id: 'PENDING', label: 'Pending Payment', count: pendingCount },
            { id: 'PAID', label: 'Paid & Completed', count: paidCount },
            { id: 'FAILED', label: 'Failed / Expired', count: orders.filter((o) => o.status === 'FAILED' || o.status === 'EXPIRED').length },
          ].map((f) => {
            const isActive = filterStatus === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#5A3E36] text-white shadow-xs'
                    : 'bg-[#FFF9F2] text-[#78716C] hover:text-[#5A3E36] border border-[#5A3E36]/10'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-white text-stone-600'}`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Layout View Mode */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, items, server..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F2] border border-[#5A3E36]/15 text-[#292524] placeholder:text-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#E85D75]"
            />
          </div>

          <div className="flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-[#5A3E36]/15">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-[#5A3E36] shadow-2xs' : 'text-[#78716C]'
              }`}
              title="Cards Layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#5A3E36] shadow-2xs' : 'text-[#78716C]'
              }`}
              title="Dense Table Layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Orders View: Card Mode (Clean cards matching prompt spec) */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'PENDING';
            const isPaid = order.status === 'PAID';

            return (
              <div
                key={order.id}
                id={`order-card-${order.orderNumber}`}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isPending
                    ? 'border-amber-300 ring-1 ring-amber-200/60'
                    : isPaid
                    ? 'border-[#65A30D]/30'
                    : 'border-stone-200'
                }`}
              >
                {/* Card Top Row */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-[#5A3E36]">
                          ORDER #{order.orderNumber}
                        </span>
                        {isPending && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Action
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#78716C] flex items-center gap-2 mt-0.5">
                        <span>{order.createdAt}</span>
                        <span>•</span>
                        <span>Server: {order.serverName}</span>
                      </div>
                    </div>

                    <div>{getStatusPill(order.status)}</div>
                  </div>

                  {/* Items list breakdown */}
                  <div className="bg-[#FFF9F2] p-3 rounded-xl border border-[#5A3E36]/10 space-y-1.5 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs text-[#292524] flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-[#5A3E36]">
                            {item.name}
                          </span>
                          <span className="text-[#E85D75] font-bold ml-1">× {item.quantity}</span>
                          
                          {/* Toppings / scoops notes */}
                          {(item.scoops > 0 || item.toppings.length > 0) && (
                            <div className="text-[11px] text-stone-500 pl-2">
                              {item.scoops > 0 && `${item.scoops} scoop • `}
                              {item.serving}
                              {item.toppings.length > 0 && ` • +${item.toppings.join(', ')}`}
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-xs font-semibold text-stone-700">
                          {item.totalItemPrice} ETB
                        </span>
                      </div>
                    ))}
                    {order.customerNote && (
                      <div className="pt-1.5 mt-1 border-t border-[#5A3E36]/10 text-[11px] text-[#78716C] italic">
                        Note: "{order.customerNote}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Total & Primary Actions */}
                <div className="pt-2 border-t border-stone-100 space-y-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                      TOTAL
                    </span>
                    <span className="text-xl font-black text-[#5A3E36]">
                      {order.total} <span className="text-xs font-semibold text-[#E85D75]">ETB</span>
                    </span>
                  </div>

                  {/* Contextual action buttons based strictly on payment status */}
                  <div className="grid grid-cols-1 gap-2">
                    {isPending ? (
                      <button
                        id={`generate-payment-btn-${order.orderNumber}`}
                        type="button"
                        onClick={() => setSelectedPaymentOrder(order)}
                        className="w-full py-2.5 rounded-xl bg-[#E85D75] hover:bg-[#d44860] active:scale-98 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Generate Payment</span>
                      </button>
                    ) : isPaid ? (
                      <button
                        id={`print-receipt-btn-${order.orderNumber}`}
                        type="button"
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="w-full py-2.5 rounded-xl bg-[#5A3E36] hover:bg-[#47302a] active:scale-98 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>PRINT RECEIPT</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentOrder(order)}
                        className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Retry Payment / Review</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode (High density for desktop shifts) */
        <div className="bg-white rounded-2xl border border-[#5A3E36]/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#292524]">
              <thead className="bg-[#FFF9F2] text-[#5A3E36] font-bold border-b border-[#5A3E36]/10 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Server</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'PENDING';
                  const isPaid = order.status === 'PAID';

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-bold font-mono text-[#5A3E36]">
                        #{order.orderNumber}
                      </td>
                      <td className="px-4 py-3.5 text-stone-500">
                        {order.createdAt}
                      </td>
                      <td className="px-4 py-3.5 font-medium">
                        {order.serverName}
                      </td>
                      <td className="px-4 py-3.5 text-stone-700 max-w-xs">
                        <div className="truncate">
                          {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-black font-mono text-sm text-[#5A3E36]">
                        {order.total} ETB
                      </td>
                      <td className="px-4 py-3.5">
                        {getStatusPill(order.status)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#E85D75] hover:bg-[#d44860] text-white font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Generate Payment</span>
                          </button>
                        ) : isPaid ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#5A3E36] hover:bg-[#47302a] text-white font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>PRINT RECEIPT</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Retry</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#5A3E36]">No incoming orders matching criteria</p>
          <p className="text-xs text-[#78716C] mt-1">
            Orders created by Server Tablet will appear here in real-time.
          </p>
        </div>
      )}

      {/* Chapa Payment Request Modal */}
      {selectedPaymentOrder && (
        <ChapaPaymentModal
          order={selectedPaymentOrder}
          onClose={() => setSelectedPaymentOrder(null)}
          onUpdateStatus={(orderId, status) => {
            onUpdateOrderStatus(orderId, status);
            // Update local order reference
            setSelectedPaymentOrder((prev) => prev ? { ...prev, status } : null);
          }}
          onOpenReceipt={(order) => {
            setSelectedPaymentOrder(null);
            setSelectedReceiptOrder(order);
          }}
        />
      )}

      {/* Printable Thermal Receipt Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}

    </div>
  );
};
