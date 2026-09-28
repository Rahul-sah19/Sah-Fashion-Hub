import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { EMAIL_RE, str } from "../utils/validate.js";

const authResponse = (user) => ({ token: signToken(user._id), user });

export const register = asyncHandler(async (req, res) => {
  const name = str(req.body.name);
  const email = str(req.body.email).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name) throw new HttpError(400, "Name is required.");
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "Please enter a valid email.");
  if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters.");

  if (await User.exists({ email })) throw new HttpError(409, "An account with this email already exists.");

  // role is intentionally NOT read from the request: public sign-ups are always "user".
  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const email = str(req.body.email).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";

  const user = await User.findOne({ email }).select("+password");
  // Same message for unknown email and wrong password (prevents account enumeration).
  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(401, "Invalid email or password.");
  }
  res.json(authResponse(user));
});

export const me = (req, res) => res.json({ user: req.user });

export const updateProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (req.body.name !== undefined) {
    const name = str(req.body.name);
    if (!name) throw new HttpError(400, "Name cannot be empty.");
    user.name = name;
  }
  for (const field of ["phone", "address", "city"]) {
    if (req.body[field] !== undefined) user[field] = str(req.body[field]);
  }
  await user.save();
  res.json({ user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const current = typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
  const next = typeof req.body.newPassword === "string" ? req.body.newPassword : "";
  if (next.length < 8) throw new HttpError(400, "New password must be at least 8 characters.");

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(current))) throw new HttpError(401, "Current password is incorrect.");

  user.password = next;
  await user.save();
  res.json({ message: "Password updated." });
});
