import mongoose from "mongoose";
import cleanJSON from "./toJSON.js";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    // Snapshot of the product at purchase time so old orders stay correct if the product changes.
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    shipping: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: ["cod", "card", "esewa"], default: "cod" },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
  },
  { timestamps: true }
);

orderSchema.plugin(cleanJSON);

export default mongoose.model("Order", orderSchema);
