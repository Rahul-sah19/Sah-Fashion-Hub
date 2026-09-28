import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { requireValidId, str } from "../utils/validate.js";

const num = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));

// Validates and whitelists product input (never spread req.body straight into the model).
async function readBody(body) {
  const name = str(body.name);
  const image = str(body.image);
  const price = num(body.price);
  const oldPrice = body.oldPrice === undefined || body.oldPrice === "" ? price : num(body.oldPrice);
  const categoryId = str(body.categoryId || body.category);

  if (!name) throw new HttpError(400, "Product name is required.");
  if (!image) throw new HttpError(400, "Product image URL is required.");
  if (!Number.isFinite(price) || price < 0) throw new HttpError(400, "Price must be a positive number.");
  if (!Number.isFinite(oldPrice) || oldPrice < 0) throw new HttpError(400, "Old price must be a positive number.");
  if (!categoryId) throw new HttpError(400, "Category is required.");
  requireValidId(categoryId, "category");
  if (!(await Category.exists({ _id: categoryId }))) throw new HttpError(400, "Selected category does not exist.");

  let sizes = body.sizes;
  if (typeof sizes === "string") sizes = sizes.split(",");
  sizes = Array.isArray(sizes) ? sizes.map((s) => String(s).trim()).filter(Boolean) : [];
  if (sizes.length === 0) sizes = ["Free Size"];

  const data = {
    name,
    image,
    price,
    oldPrice,
    category: categoryId,
    description: str(body.description),
    sizes,
    isNewArrival: !!body.isNew,
    isFeatured: !!body.isFeatured,
  };

  for (const field of ["rating", "reviews"]) {
    if (body[field] !== undefined && body[field] !== "") {
      const n = Number(body[field]);
      if (!Number.isFinite(n) || n < 0 || (field === "rating" && n > 5)) {
        throw new HttpError(400, `Invalid ${field}.`);
      }
      data[field] = n;
    }
  }
  return data;
}

export const listProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    requireValidId(req.query.category, "category");
    filter.category = req.query.category;
  }
  if (req.query.featured === "true") filter.isFeatured = true;
  if (req.query.search) {
    const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: escaped, $options: "i" };
  }
  const products = await Product.find(filter).populate("category", "name").sort({ createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (!product) throw new HttpError(404, "Product not found.");
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const created = await Product.create(await readBody(req.body));
  const product = await Product.findById(created._id).populate("category", "name");
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, await readBody(req.body), {
    new: true,
    runValidators: true,
  }).populate("category", "name");
  if (!product) throw new HttpError(404, "Product not found.");
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, "Product not found.");
  res.json({ message: "Product deleted." });
});
