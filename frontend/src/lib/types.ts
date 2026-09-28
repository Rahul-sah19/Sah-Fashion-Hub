export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone: string;
  address: string;
  city: string;
  createdAt: string;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  user: string | { id: string; name: string; email: string };
  items: OrderItem[];
  shipping: { fullName: string; email: string; phone: string; address: string; city: string };
  paymentMethod: "cod" | "card" | "esewa";
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const PAYMENT_LABELS: Record<Order["paymentMethod"], string> = {
  cod: "Cash on Delivery",
  card: "Card Payment",
  esewa: "eSewa / Khalti",
};
