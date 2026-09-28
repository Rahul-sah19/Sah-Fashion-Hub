import Category from "../models/Category.js";
import Order, { ORDER_STATUSES } from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/httpError.js";

export const getStats = asyncHandler(async (_req, res) => {
  const [users, products, categories, orders, revenueAgg, statusAgg, recentOrders] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
  ]);

  const ordersByStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]));
  statusAgg.forEach((s) => (ordersByStatus[s._id] = s.count));

  res.json({
    stats: { users, products, categories, orders, revenue: revenueAgg[0]?.revenue || 0, ordersByStatus },
    recentOrders,
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});
