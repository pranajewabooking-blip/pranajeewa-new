import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      role: admin.role
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
