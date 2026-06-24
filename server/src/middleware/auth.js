import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin account not found" });
    }

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
});
