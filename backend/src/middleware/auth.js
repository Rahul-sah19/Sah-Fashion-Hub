import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Requires a valid "Authorization: Bearer <token>" header.
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Not authenticated. Please log in.");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) throw new HttpError(401, "This account no longer exists.");
  req.user = user;
  next();
});

// Use AFTER protect. The role is always read from the database, never from the token or request body.
export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new HttpError(403, "Admin access required."));
  }
  next();
};
