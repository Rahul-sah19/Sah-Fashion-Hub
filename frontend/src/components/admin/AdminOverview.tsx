import { useEffect, useState } from "react";
import { ErrorMessage, StatusBadge, formatDate, money } from "@/components/ui";
import { api } from "@/lib/api";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";

type Stats = {
  users: number;
  products: number;
  categories: number;
  orders: number;
  revenue: number;
  ordersByStatus: Record<OrderStatus, number>;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<{ stats: Stats; recentOrders: Order[] }>("/admin/stats")
      .then((r) => {
        setStats(r.stats);
        setRecent(r.recentOrders);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load stats."));
  }, []);

  const cards = stats
    ? [
        { label: "Revenue", value: money(stats.revenue), hint: "excludes cancelled orders" },
        { label: "Orders", value: stats.orders },
        { label: "Customers", value: stats.users },
        { label: "Products", value: stats.products },
        { label: "Categories", value: stats.categories },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />
      {!stats && !error && <p className="text-sm text-gray-500">Loading...</p>}
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {cards.map((c) => (
              <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{c.value}</p>
                {"hint" in c && <p className="mt-1 text-[11px] text-gray-400">{c.hint}</p>}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-3 text-lg font-bold text-gray-900">Orders by status</h2>
              <ul className="space-y-2">
                {ORDER_STATUSES.map((s) => (
                  <li key={s} className="flex items-center justify-between text-sm">
                    <StatusBadge status={s} />
                    <span className="font-semibold text-gray-900">{stats.ordersByStatus[s]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
              <h2 className="mb-3 text-lg font-bold text-gray-900">Recent orders</h2>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-500">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recent.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {typeof o.user === "object" && o.user ? `${o.user.name} · ` : ""}{formatDate(o.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{money(o.total)}</span>
                        <StatusBadge status={o.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
