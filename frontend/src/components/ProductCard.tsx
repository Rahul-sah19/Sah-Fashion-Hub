import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useNav } from "@/context/NavContext";
import RatingStars from "./RatingStars";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { navigate } = useNav();

  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className="relative aspect-[3/4] cursor-pointer overflow-hidden bg-gray-50"
        onClick={() => navigate({ name: "product", id: product.id })}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-[300px] w-full object-top object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.category}
        </p>
        <h3
          className="cursor-pointer text-sm font-semibold text-gray-800 transition-colors hover:text-rose-600"
          onClick={() => navigate({ name: "product", id: product.id })}
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            Rs. {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 line-through">
            Rs. {product.oldPrice.toLocaleString()}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => addToCart(product, 1, product.sizes[0])}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
          <button
            onClick={() => navigate({ name: "product", id: product.id })}
            className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
