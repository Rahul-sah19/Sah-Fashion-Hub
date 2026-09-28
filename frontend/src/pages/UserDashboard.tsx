import { useCallback, useEffect, useState } from "react";
import { ChevronDown, LayoutDashboard, Loader2, LogOut, Package, ShieldCheck, User as UserIcon } from "lucide-react";
import { ErrorMessage, StatusBadge, SuccessMessage, formatDate, inputClass, money, primaryBtn, secondaryBtn } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useNav } from "@/context/NavContext";
import { api } from "@/lib/api";
import { PAYMENT_LABELS, type Order, type User } from "@/lib/types";

type Tab = "overview" | "orders" | "profile" | "security";

const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "security", label: "Password", icon: ShieldCheck },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { navigate } = useNav();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      const r = await api.get<{ orders: Order[] }>("/orders/mine");
      setOrders(r.orders);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (!user) return null;

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
            <p className="mt-1 text-gray-500">Hello, {user.name}</p>
          </div>
          <div className="flex gap-2">
            {user.role === "admin" && (
              <button onClick={() => navigate({ name: "admin" })} className={secondaryBtn}>
                Admin Panel
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate({ name: "home" });
              }}
              className={secondaryBtn}
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-rose-600 text-white shadow" : "bg-white text-gray-700 ring-1 ring-gray-100 hover:bg-rose-50"
                }`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </nav>

          <div className="lg:col-span-3">
            {tab === "overview" && (
              <Overview orders={orders} loading={loading} error={error} onSeeAll={() => setTab("orders")} />
            )}
            {tab === "orders" && (
              <OrdersTab orders={orders} loading={loading} error={error} onChanged={loadOrders} />
            )}
            {tab === "profile" && <ProfileTab />}
            {tab === "security" && <PasswordTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">{children}</div>;
}

function Overview({ orders, loading, error, onSeeAll }: { orders: Order[]; loading: boolean; error: string; onSeeAll: () => void }) {
  const { navigate } = useNav();
  const active = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length;
  const spent = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "In Progress", value: active },
          { label: "Total Spent", value: money(spent) },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{loading ? "..." : s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          {orders.length > 3 && (
            <button onClick={onSeeAll} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
              View all
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <button onClick={() => navigate({ name: "shop" })} className={`${primaryBtn} mt-4`}>
              Start Shopping
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{money(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function OrdersTab({ orders, loading, error, onChanged }: { orders: Order[]; loading: boolean; error: string; onChanged: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this order?")) return;
    setBusy(id);
    setActionError("");
    try {
      await api.put(`/orders/${id}/cancel`);
      await onChanged();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not cancel the order.");
    } finally {
      setBusy("");
    }
  };

  if (loading) return <Card><p className="text-sm text-gray-500">Loading orders...</p></Card>;

  return (
    <div className="space-y-4">
      <ErrorMessage message={error || actionError} />
      {orders.length === 0 && <Card><p className="text-center text-gray-500">No orders yet.</p></Card>}
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <button
            onClick={() => setOpen(open === o.id ? null : o.id)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5"
          >
            <div>
              <p className="font-semibold text-gray-900">{o.orderNumber}</p>
              <p className="text-xs text-gray-500">
                {formatDate(o.createdAt)} · {o.items.reduce((s, i) => s + i.quantity, 0)} item(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-semibold text-gray-900 sm:inline">{money(o.total)}</span>
              <StatusBadge status={o.status} />
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${open === o.id ? "rotate-180" : ""}`} />
            </div>
          </button>
          {open === o.id && (
            <div className="border-t border-gray-100 p-4 sm:p-5">
              <div className="space-y-3">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="h-14 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{i.name}</p>
                      <p className="text-xs text-gray-500">{i.size} × {i.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{money(i.price * i.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{o.shippingCost === 0 ? "Free" : money(o.shippingCost)}</span></div>
                <div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>{money(o.total)}</span></div>
                <p className="pt-2 text-xs text-gray-500">
                  {PAYMENT_LABELS[o.paymentMethod]} · Deliver to {o.shipping.address}, {o.shipping.city}
                </p>
              </div>
              {o.status === "pending" && (
                <button onClick={() => cancel(o.id)} disabled={busy === o.id} className={`${secondaryBtn} mt-4`}>
                  {busy === o.id && <Loader2 size={16} className="animate-spin" />} Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");
    try {
      const r = await api.put<{ user: User }>("/auth/profile", form);
      setUser(r.user);
      setOk("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Profile Details</h2>
      <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-3">
          <ErrorMessage message={error} />
          <SuccessMessage message={ok} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input value={user?.email ?? ""} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98XXXXXXXX" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">City</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
          <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
          </button>
        </div>
      </form>
    </Card>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (form.newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (form.newPassword !== form.confirm) return setError("New passwords do not match.");
    setSaving(true);
    try {
      await api.put("/auth/password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setOk("Password updated.");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Change Password</h2>
      <form onSubmit={save} className="max-w-md space-y-4">
        <ErrorMessage message={error} />
        <SuccessMessage message={ok} />
        <input type="password" required autoComplete="current-password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={inputClass} />
        <input type="password" required minLength={8} autoComplete="new-password" placeholder="New password (min 8 characters)" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={inputClass} />
        <input type="password" required autoComplete="new-password" placeholder="Confirm new password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputClass} />
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving && <Loader2 size={16} className="animate-spin" />} Update Password
        </button>
      </form>
    </Card>
  );
}
