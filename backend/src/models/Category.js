import mongoose from "mongoose";
import cleanJSON from "./toJSON.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    image: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

categorySchema.plugin(cleanJSON);

export default mongoose.model("Category", categorySchema);
