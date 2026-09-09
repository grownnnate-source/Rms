import { useState } from "react";
import { ChapaPaymentModal } from "../components/ChapaPaymentModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { CashierStatsRibbon } from "../components/cashier/CashierStatsRibbon";
import { CashierFilterBar } from "../components/cashier/CashierFilterBar";
import { CashierOrderCard } from "../components/cashier/CashierOrderCard";
import { CashierOrdersTable } from "../components/cashier/CashierOrdersTable";
import { Clock } from "lucide-react";

export const CashierPage = ({ orders = [], onUpdateOrderStatus }) => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [viewMode, setViewMode] = useState("cards");

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const paidCount = orders.filter((o) => o.status === "PAID").length;
  const failedCount = orders.filter(
    (o) => o.status === "FAILED" || o.status === "EXPIRED"
  ).length;
  const totalSettledToday = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      filterStatus === "ALL" || ord.status === filterStatus;
    const matchesSearch =
      ord.orderNumber.toString().includes(searchQuery) ||
      ord.serverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20 space-y-5">
      {/* 1. Summary Ribbon: Pending, Settled, Revenue, Gateway */}
      <CashierStatsRibbon
        pendingCount={pendingCount}
        paidCount={paidCount}
        totalSettledToday={totalSettledToday}
      />

      {/* 2. Filter Bar & Search */}
      <CashierFilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalOrdersCount={orders.length}
        pendingCount={pendingCount}
        paidCount={paidCount}
        failedCount={failedCount}
      />

      {/* 3. Orders Display: Cards or Table */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order, idx) => (
            <CashierOrderCard
              key={`${order.id || "card"}-${idx}`}
              order={order}
              onGeneratePayment={setSelectedPaymentOrder}
              onPrintReceipt={setSelectedReceiptOrder}
            />
          ))}
        </div>
      ) : (
        <CashierOrdersTable
          orders={filteredOrders}
          onGeneratePayment={setSelectedPaymentOrder}
          onPrintReceipt={setSelectedReceiptOrder}
        />
      )}

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#5A3E36]">
            No incoming orders matching criteria
          </p>
          <p className="text-xs text-[#78716C] mt-1">
            Orders created by Server Tablet will appear here in real-time.
          </p>
        </div>
      )}

      {/* Chapa QR Payment Modal */}
      {selectedPaymentOrder && (
        <ChapaPaymentModal
          order={selectedPaymentOrder}
          onClose={() => setSelectedPaymentOrder(null)}
          onUpdateStatus={(orderId, status) => {
            onUpdateOrderStatus(orderId, status);
            setSelectedPaymentOrder((prev) =>
              prev ? { ...prev, status } : null
            );
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

export const CashierView = CashierPage;
export default CashierPage;
