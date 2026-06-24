import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

const serializeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  res.json({
    token: signToken(admin),
    admin: serializeAdmin(admin)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ admin: serializeAdmin(req.admin) });
});
