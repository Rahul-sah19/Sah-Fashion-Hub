import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ErrorMessage, StatusBadge, formatDate, inputClass, money } from "@/components/ui";
import { api } from "@/lib/api";
import { ORDER_STATUSES, PAYMENT_LABELS, type Order, type OrderStatus } from "@/lib/types";

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await api.get<{ orders: Order[] }>(filter === "all" ? "/orders" : `/orders?status=${filter}`);
      setOrders(r.orders);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    setError("");
    try {
      const r = await api.put<{ order: Order }>(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? r.order : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setUpdating("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === s ? "bg-rose-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-rose-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <ErrorMessage message={error} />
      {loading && <p className="text-sm text-gray-500">Loading orders...</p>}
      {!loading && orders.length === 0 && <p className="py-10 text-center text-gray-500">No orders found.</p>}

      {orders.map((o) => {
        const customer = typeof o.user === "object" && o.user ? o.user : null;
        return (
          <div key={o.id} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex items-center gap-3 text-left">
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${open === o.id ? "rotate-180" : ""}`} />
                <div>
                  <p className="font-semibold text-gray-900">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {customer ? `${customer.name} · ` : ""}{formatDate(o.createdAt)}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{money(o.total)}</span>
                <StatusBadge status={o.status} />
                <select
                  value={o.status}
                  disabled={updating === o.id}
                  onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                  aria-label="Change order status"
                  className={`${inputClass} !w-auto !py-1.5 capitalize`}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {open === o.id && (
              <div className="grid gap-6 border-t border-gray-100 p-4 md:grid-cols-2">
                <div className="space-y-3">
                  {o.items.map((i, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={i.image} alt="" className="h-12 w-10 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{i.name}</p>
                        <p className="text-xs text-gray-500">{i.size} × {i.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{money(i.price * i.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">{o.shipping.fullName}</p>
                  <p>{o.shipping.phone} · {o.shipping.email}</p>
                  <p>{o.shipping.address}, {o.shipping.city}</p>
                  <p className="pt-2">{PAYMENT_LABELS[o.paymentMethod]}</p>
                  <p>Subtotal {money(o.subtotal)} · Shipping {o.shippingCost === 0 ? "Free" : money(o.shippingCost)}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
