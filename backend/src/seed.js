import "dotenv/config";
import { readFileSync } from "fs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

const data = JSON.parse(readFileSync(new URL("./data/seedData.json", import.meta.url)));

async function run() {
  await connectDB();

  // Admin account (created once; existing accounts are never overwritten)
  const email = (process.env.ADMIN_EMAIL || "admin@sahfashionhub.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({ name: process.env.ADMIN_NAME || "Admin", email, password, role: "admin" });
    console.log(`Admin created: ${email}`);
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    await admin.save();
    console.log(`Existing user promoted to admin: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  // Catalog is only seeded into an empty database, so re-running never wipes admin edits.
  if ((await Category.countDocuments()) === 0 && (await Product.countDocuments()) === 0) {
    const cats = await Category.insertMany(data.categories);
    const byName = new Map(cats.map((c) => [c.name, c._id]));
    await Product.insertMany(
      data.products.map(({ isNew, category, ...p }) => ({
        ...p,
        category: byName.get(category),
        isNewArrival: !!isNew,
      }))
    );
    console.log(`Seeded ${cats.length} categories and ${data.products.length} products`);
  } else {
    console.log("Catalog already has data; skipped product/category seeding.");
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
