import { useState } from "react";
import { Minus, Plus, ShoppingBag, Zap, ChevronLeft, Check } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { useNav } from "@/context/NavContext";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";

type ProductDetailsPageProps = {
  productId: string;
};

export default function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const { products, loading } = useCatalog();
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const { navigate } = useNav();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product && loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-4 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate({ name: "checkout" });
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-rose-600"
        >
          <ChevronLeft size={16} />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-20 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[3/4] w-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-rose-600">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} size={18} />
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-lg text-gray-400 line-through">
                Rs. {product.oldPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
                  Save Rs. {(product.oldPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Quantity
              </h3>
              <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:text-rose-600"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-base font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:text-rose-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg transition-all ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900">Free Shipping</p>
                <p className="mt-0.5 text-[11px] text-gray-500">Over Rs. 2000</p>
              </div>
              <div className="border-x border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                <p className="mt-0.5 text-[11px] text-gray-500">7 days</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900">Cash on</p>
                <p className="mt-0.5 text-[11px] text-gray-500">Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
