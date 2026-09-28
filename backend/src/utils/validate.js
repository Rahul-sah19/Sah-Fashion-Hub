import mongoose from "mongoose";
import { HttpError } from "./httpError.js";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireValidId(id, label = "id") {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, `Invalid ${label}.`);
}

export function str(value) {
  return typeof value === "string" ? value.trim() : "";
}
