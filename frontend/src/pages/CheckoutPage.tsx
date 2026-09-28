import { useState } from "react";
import { CheckCircle2, ChevronLeft, Banknote, CreditCard, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
};

export default function CheckoutPage() {
  const { items, subtotal, discount, total, itemCount, clearCart } = useCart();
  const { navigate } = useNav();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState<FormData>({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    paymentMethod: "cod",
  });

  const shippingCost = subtotal >= 2000 ? 0 : 150;
  const grandTotal = subtotal + shippingCost;

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={56} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-3 text-gray-500">
          Thank you for your purchase. Your order has been confirmed and will be
          on its way soon.
        </p>

        <div className="mt-8 rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-500">Order Number</span>
            <span className="font-bold text-gray-900">{orderId}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="font-bold text-gray-900">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-500">Payment Method</span>
            <span className="font-semibold text-gray-700">
              {form.paymentMethod === "cod"
                ? "Cash on Delivery"
                : form.paymentMethod === "card"
                ? "Card Payment"
                : "eSewa / Khalti"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Delivery Address</span>
            <span className="max-w-[60%] text-right text-sm font-medium text-gray-700">
              {form.address}, {form.city}
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          You can track this order from your account dashboard.
          Expected delivery: 3-5 business days.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate({ name: "home" })}
            className="rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="rounded-full border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-500">Add some products before checking out.</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-6 rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      // Only ids/sizes/quantities are sent; the server looks up the real prices.
      const { order } = await api.post<{ order: Order }>("/orders", {
        items: items.map((i) => ({ productId: i.product.id, size: i.size, quantity: i.quantity })),
        shipping: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        paymentMethod: form.paymentMethod,
      });
      setOrderId(order.orderNumber);
      setOrderPlaced(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
    { id: "card", label: "Card Payment", icon: CreditCard, desc: "Credit / Debit Card" },
    { id: "esewa", label: "eSewa / Khalti", icon: Wallet, desc: "Digital Wallet" },
  ];

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: "cart" })}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-rose-600"
        >
          <ChevronLeft size={16} /> Back to Cart
        </button>

        <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form fields */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Sita Sharma"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. sita@example.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Kathmandu"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. House No. 123, New Road, near City Mall"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                      form.paymentMethod === method.id
                        ? "border-rose-600 bg-rose-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                      className="accent-rose-600"
                    />
                    <method.icon
                      size={20}
                      className={
                        form.paymentMethod === method.id
                          ? "text-rose-600"
                          : "text-gray-500"
                      }
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Your Order</h2>

              <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                      className="h-14 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-emerald-600" : ""}>
                    {shippingCost === 0 ? "Free" : `Rs. ${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2.5 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {submitError && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing order..." : "Place Order"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
