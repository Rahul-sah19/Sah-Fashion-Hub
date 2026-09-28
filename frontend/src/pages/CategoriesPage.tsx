import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useNav } from "@/context/NavContext";

export default function CategoriesPage() {
  const { navigate } = useNav();
  const { categories, loading } = useCatalog();

  return (
    <div className="bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            All Categories
          </h1>
          <p className="mt-1 text-gray-500">
            Browse our collections by category
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!loading && categories.length === 0 && (
          <p className="py-16 text-center text-gray-500">No categories yet.</p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = cat.productCount ?? 0;
            return (
              <button
                key={cat.name}
                onClick={() => navigate({ name: "shop", category: cat.name })}
                className="group relative h-72 overflow-hidden rounded-2xl bg-gray-900 shadow-sm transition-all hover:shadow-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-[300px] object-top w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {count} {count === 1 ? "product" : "products"} available
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Shop Now
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
