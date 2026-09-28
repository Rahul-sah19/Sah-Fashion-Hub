import type { OrderStatus } from "@/lib/types";

export const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100";

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-60";

export const money = (n: number) => `Rs. ${n.toLocaleString()}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-200 text-gray-600",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}

export function SuccessMessage({ message }: { message: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>;
}
