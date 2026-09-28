import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    image: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    sizes: { type: [String], default: ["Free Size"] },
    // `isNew` is a reserved Mongoose property, so it is stored as isNewArrival and exposed as `isNew` in JSON.
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// The storefront expects `category` to be the category NAME (string) and `id` to be a string.
// When the category is populated we flatten it here; `categoryId` keeps the reference for admin forms.
productSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    if (ret.category && typeof ret.category === "object" && ret.category.name) {
      // Populated category. It may already have been cleaned (id) or still be raw (_id).
      ret.categoryId = String(ret.category._id ?? ret.category.id);
      ret.category = ret.category.name;
    } else if (ret.category) {
      ret.categoryId = ret.category.toString();
    }
    if (!ret.oldPrice) ret.oldPrice = ret.price;
    ret.isNew = !!ret.isNewArrival;
    delete ret.isNewArrival;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Product", productSchema);
