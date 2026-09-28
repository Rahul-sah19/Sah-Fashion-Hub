import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useNav } from "@/context/NavContext";
import ProductCard from "@/components/ProductCard";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopPage() {
  const { searchQuery, setSearchQuery, page } = useNav();
  const { products, categories, loading, error } = useCatalog();
  const categoryOptions = ["All", ...categories.map((c) => c.name)];
  const maxPrice = Math.max(8000, Math.ceil(Math.max(0, ...products.map((p) => p.price)) / 1000) * 1000);
  const initialCategory =
    page.name === "shop" && page.category ? page.category : "All";

  const [category, setCategory] = useState(initialCategory);
  const [priceCap, setPriceCap] = useState<number | null>(null); // null = no cap
  const priceRange = priceCap ?? maxPrice;
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (page.name === "shop" && page.category) {
      setCategory(page.category);
    }
  }, [page]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => p.price <= priceRange);

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return result;
  }, [products, category, searchQuery, priceRange, sortBy]);

  const resetFilters = () => {
    setCategory("All");
    setPriceCap(null);
    setSortBy("featured");
    setSearchQuery("");
  };

  return (
    <div className="bg-gray-50">
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shop All Products
          </h1>
          <p className="mt-1 text-gray-500">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 md:hidden"
        >
          <SlidersHorizontal size={16} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } w-full shrink-0 space-y-6 md:block md:w-64`}
          >
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  Reset
                </button>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCategory(opt)}
                      className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        category === opt
                          ? "bg-rose-50 font-semibold text-rose-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Max Price
                </h4>
                <input
                  type="range"
                  min={500}
                  max={maxPrice}
                  step={100}
                  value={priceRange}
                  onChange={(e) => setPriceCap(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rs. 500</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {priceRange.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {loading && products.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">Loading products...</p>
            )}
            {/* Sort bar */}
            <div className="mb-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">
                Showing {filtered.length} results
              </p>
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-gray-500 sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active search indicator */}
            {searchQuery.trim() && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                <span>
                  Results for "<strong>{searchQuery}</strong>"
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800"
                >
                  <X size={14} /> Clear
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-semibold text-gray-700">
                  No products found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
