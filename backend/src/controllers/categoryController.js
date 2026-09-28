import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { requireValidId, str } from "../utils/validate.js";

async function withCounts(categories) {
  const counts = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const map = new Map(counts.map((c) => [String(c._id), c.count]));
  return categories.map((c) => ({ ...c.toJSON(), productCount: map.get(String(c._id)) || 0 }));
}

function readBody(body) {
  const name = str(body.name);
  const image = str(body.image);
  if (!name) throw new HttpError(400, "Category name is required.");
  if (!image) throw new HttpError(400, "Category image URL is required.");
  return { name, image, description: str(body.description) };
}

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json({ categories: await withCounts(categories) });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(readBody(req.body));
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const category = await Category.findByIdAndUpdate(req.params.id, readBody(req.body), {
    new: true,
    runValidators: true,
  });
  if (!category) throw new HttpError(404, "Category not found.");
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    throw new HttpError(409, `Cannot delete: ${inUse} product(s) still use this category. Move or delete them first.`);
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new HttpError(404, "Category not found.");
  res.json({ message: "Category deleted." });
});
