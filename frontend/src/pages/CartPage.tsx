import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNav } from "@/context/NavContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, discount, total, itemCount } =
    useCart();
  const { navigate } = useNav();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-500">
          Looks like you haven't added anything yet. Let's fix that!
        </p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700"
        >
          Start Shopping <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  className="h-28 w-24 shrink-0 cursor-pointer rounded-lg object-cover"
                  onClick={() => navigate({ name: "product", id: item.product.id })}
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {item.product.category}
                      </p>
                      <h3
                        className="cursor-pointer text-sm font-semibold text-gray-900 hover:text-rose-600"
                        onClick={() =>
                          navigate({ name: "product", id: item.product.id })
                        }
                      >
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Size: <span className="font-medium text-gray-700">{item.size}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="inline-flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:text-rose-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:text-rose-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        Rs. {(item.product.oldPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate({ name: "shop" })}
              className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              <ArrowRight size={16} className="rotate-180" />
              Continue Shopping
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({itemCount})</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Original Total</span>
                  <span className="line-through">
                    Rs. {(subtotal + discount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-emerald-600">
                  <span>Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">
                    {subtotal >= 2000 ? "Free" : "Rs. 150"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>
                      Rs.{" "}
                      {(subtotal + (subtotal >= 2000 ? 0 : 150)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {subtotal < 2000 && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add Rs. {(2000 - subtotal).toLocaleString()} more for free shipping!
                </p>
              )}

              <button
                onClick={() => navigate({ name: "checkout" })}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
