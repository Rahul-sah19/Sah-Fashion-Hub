import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { ErrorMessage, inputClass, primaryBtn, secondaryBtn } from "@/components/ui";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/api";
import type { Category } from "@/data/products";

export default function CategoriesManager() {
  const { categories, refresh } = useCatalog();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const remove = async (c: Category) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    setDeletingId(c.id);
    setError("");
    try {
      await api.delete(`/categories/${c.id}`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete category.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing("new")} className={primaryBtn}>
          <Plus size={16} /> Add Category
        </button>
      </div>
      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <img src={c.image} alt={c.name} className="h-40 w-full object-cover object-top" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-xs text-gray-500">
                    {c.productCount ?? 0} {(c.productCount ?? 0) === 1 ? "product" : "products"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(c)} disabled={deletingId === c.id} aria-label={`Delete ${c.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50">
                    {deletingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
              {c.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{c.description}</p>}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="col-span-full py-10 text-center text-gray-500">No categories yet.</p>}
      </div>

      {editing && (
        <CategoryForm
          category={editing === "new" ? null : editing}
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

function CategoryForm({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    name: category?.name ?? "",
    image: category?.image ?? "",
    description: category?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (category) await api.put(`/categories/${category.id}`, form);
      else await api.post("/categories", form);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
      setSaving(false);
    }
  };

  return (
    <Modal title={category ? "Edit Category" : "Add Category"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <ErrorMessage message={error} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Image URL *</label>
          <input required type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inputClass} />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 w-20 rounded-lg object-cover ring-1 ring-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving && <Loader2 size={16} className="animate-spin" />} {category ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
