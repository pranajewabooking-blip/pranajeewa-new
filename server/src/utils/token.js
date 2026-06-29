import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const signAppToken = (payload) =>
  jwt.sign(
    payload,
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );

export const signToken = (admin) =>
  signAppToken({
    id: admin._id,
    role: admin.role
  });

export const signCustomerToken = (customer) =>
  signAppToken({
    id: customer._id,
    role: "customer"
  });
