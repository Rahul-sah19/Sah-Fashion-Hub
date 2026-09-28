import { useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { ErrorMessage, inputClass, money, primaryBtn, secondaryBtn } from "@/components/ui";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import type { Product } from "@/data/products";

type FormState = {
  name: string;
  categoryId: string;
  price: string;
  oldPrice: string;
  image: string;
  description: string;
  sizes: string;
  rating: string;
  reviews: string;
  isNew: boolean;
  isFeatured: boolean;
};

const emptyForm = (categoryId = ""): FormState => ({
  name: "",
  categoryId,
  price: "",
  oldPrice: "",
  image: "",
  description: "",
  sizes: "Free Size",
  rating: "",
  reviews: "",
  isNew: false,
  isFeatured: false,
});

const fromProduct = (p: Product): FormState => ({
  name: p.name,
  categoryId: p.categoryId ?? "",
  price: String(p.price),
  oldPrice: String(p.oldPrice),
  image: p.image,
  description: p.description,
  sizes: p.sizes.join(", "),
  rating: String(p.rating ?? ""),
  reviews: String(p.reviews ?? ""),
  isNew: !!p.isNew,
  isFeatured: !!p.isFeatured,
});

export default function ProductsManager() {
  const { products, categories, refresh } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : products;
  }, [products, search]);

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeletingId(p.id);
    setError("");
    try {
      await api.delete(`/products/${p.id}`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete product.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={`${inputClass} pl-9`} />
        </div>
        <button
          onClick={() => setEditing("new")}
          disabled={categories.length === 0}
          title={categories.length === 0 ? "Create a category first" : undefined}
          className={primaryBtn}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
      {categories.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">Create at least one category before adding products.</p>
      )}
      <ErrorMessage message={error} />

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-12 w-10 rounded-md object-cover" />
                    <span className="max-w-[220px] truncate font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-900">{money(p.price)}</span>
                  {p.oldPrice > p.price && <span className="ml-2 text-xs text-gray-400 line-through">{money(p.oldPrice)}</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.isNew && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">New</span>}
                    {p.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(p)} disabled={deletingId === p.id} aria-label={`Delete ${p.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50">
                      {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const { categories } = useCatalog();
  const [form, setForm] = useState<FormState>(product ? fromProduct(product) : emptyForm(categories[0]?.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      price: form.price,
      oldPrice: form.oldPrice,
      image: form.image,
      description: form.description,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      rating: form.rating,
      reviews: form.reviews,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
    };
    try {
      if (product) await api.put(`/products/${product.id}`, payload);
      else await api.post("/products", payload);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
      setSaving(false);
    }
  };

  return (
    <Modal title={product ? "Edit Product" : "Add Product"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><ErrorMessage message={error} /></div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
          <select required value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
            <option value="" disabled>Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
          <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (Rs.) *</label>
          <input required type="number" min={0} step="any" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Old price (Rs.)</label>
          <input type="number" min={0} step="any" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} placeholder="Before discount" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Image URL *</label>
          <input required type="url" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." className={inputClass} />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 w-20 rounded-lg object-cover ring-1 ring-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Rating (0–5)</label>
          <input type="number" min={0} max={5} step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Review count</label>
          <input type="number" min={0} step={1} value={form.reviews} onChange={(e) => set("reviews", e.target.value)} className={inputClass} />
        </div>
        <div className="flex gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} className="accent-rose-600" /> New arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="accent-rose-600" /> Featured
          </label>
        </div>
        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={16} className="animate-spin" />} {product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
