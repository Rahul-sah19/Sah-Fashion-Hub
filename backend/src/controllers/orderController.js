import Order, { ORDER_STATUSES } from "../models/Order.js";
import Product from "../models/Product.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { EMAIL_RE, requireValidId, str } from "../utils/validate.js";

const FREE_SHIPPING_OVER = 2000;
const SHIPPING_FEE = 150;
const PAYMENT_METHODS = ["cod", "card", "esewa"];

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod = "cod" } = req.body;

  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, "Your cart is empty.");
  if (items.length > 50) throw new HttpError(400, "Too many items in one order.");
  if (!PAYMENT_METHODS.includes(paymentMethod)) throw new HttpError(400, "Invalid payment method.");

  const ship = {
    fullName: str(shipping?.fullName),
    email: str(shipping?.email),
    phone: str(shipping?.phone),
    address: str(shipping?.address),
    city: str(shipping?.city),
  };
  if (Object.values(ship).some((v) => !v)) throw new HttpError(400, "Please fill in all delivery details.");
  if (!EMAIL_RE.test(ship.email)) throw new HttpError(400, "Please enter a valid email.");

  const ids = items.map((i) => {
    if (!i || typeof i !== "object") throw new HttpError(400, "Invalid cart item.");
    requireValidId(i.productId, "product");
    return i.productId;
  });
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  // Prices always come from the database, never from the browser.
  const orderItems = items.map((i) => {
    const product = byId.get(String(i.productId));
    if (!product) throw new HttpError(400, "A product in your cart is no longer available.");
    const quantity = Number(i.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new HttpError(400, "Invalid quantity.");
    const size = str(i.size);
    if (!product.sizes.includes(size)) throw new HttpError(400, `Size "${size}" is not available for ${product.name}.`);
    return { product: product._id, name: product.name, image: product.image, price: product.price, size, quantity };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;

  const order = await Order.create({
    orderNumber: `SAH${Date.now().toString().slice(-8)}${Math.floor(10 + Math.random() * 90)}`,
    user: req.user._id,
    items: orderItems,
    shipping: ship,
    paymentMethod,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
  });
  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const cancelMyOrder = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new HttpError(404, "Order not found.");
  if (order.status !== "pending") throw new HttpError(400, "Only pending orders can be cancelled.");
  order.status = "cancelled";
  await order.save();
  res.json({ order });
});

// ---- admin ----
export const listAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) {
    if (!ORDER_STATUSES.includes(req.query.status)) throw new HttpError(400, "Invalid status.");
    filter.status = req.query.status;
  }
  const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw new HttpError(400, "Invalid status.");
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "name email");
  if (!order) throw new HttpError(404, "Order not found.");
  res.json({ order });
});
