import { Router } from "express";
import rateLimit from "express-rate-limit";
import { adminOnly, protect } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as categories from "../controllers/categoryController.js";
import * as products from "../controllers/productController.js";
import * as orders from "../controllers/orderController.js";
import * as admin from "../controllers/adminController.js";

const router = Router();

// Brute-force protection on login/register.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

router.get("/health", (_req, res) => res.json({ ok: true }));

// Auth
router.post("/auth/register", authLimiter, auth.register);
router.post("/auth/login", authLimiter, auth.login);
router.get("/auth/me", protect, auth.me);
router.put("/auth/profile", protect, auth.updateProfile);
router.put("/auth/password", protect, auth.changePassword);

// Catalog: public read, admin write
router.get("/categories", categories.listCategories);
router.post("/categories", protect, adminOnly, categories.createCategory);
router.put("/categories/:id", protect, adminOnly, categories.updateCategory);
router.delete("/categories/:id", protect, adminOnly, categories.deleteCategory);

router.get("/products", products.listProducts);
router.get("/products/:id", products.getProduct);
router.post("/products", protect, adminOnly, products.createProduct);
router.put("/products/:id", protect, adminOnly, products.updateProduct);
router.delete("/products/:id", protect, adminOnly, products.deleteProduct);

// Orders
router.post("/orders", protect, orders.createOrder);
router.get("/orders/mine", protect, orders.myOrders);
router.put("/orders/:id/cancel", protect, orders.cancelMyOrder);
router.get("/orders", protect, adminOnly, orders.listAllOrders);
router.put("/orders/:id/status", protect, adminOnly, orders.updateOrderStatus);

// Admin
router.get("/admin/stats", protect, adminOnly, admin.getStats);
router.get("/admin/users", protect, adminOnly, admin.listUsers);

export default router;
