import { useState } from "react";
import { FolderTree, LayoutDashboard, LogOut, Package, ShoppingCart, Users } from "lucide-react";
import AdminOverview from "@/components/admin/AdminOverview";
import CategoriesManager from "@/components/admin/CategoriesManager";
import OrdersManager from "@/components/admin/OrdersManager";
import ProductsManager from "@/components/admin/ProductsManager";
import UsersList from "@/components/admin/UsersList";
import { secondaryBtn } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useNav } from "@/context/NavContext";

type Tab = "overview" | "products" | "categories" | "orders" | "users";

const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "users", label: "Customers", icon: Users },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { navigate } = useNav();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-500">Signed in as {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate({ name: "home" })} className={secondaryBtn}>View Store</button>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
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

          <div className="min-w-0">
            {tab === "overview" && <AdminOverview />}
            {tab === "products" && <ProductsManager />}
            {tab === "categories" && <CategoriesManager />}
            {tab === "orders" && <OrdersManager />}
            {tab === "users" && <UsersList />}
          </div>
        </div>
      </div>
    </div>
  );
}
