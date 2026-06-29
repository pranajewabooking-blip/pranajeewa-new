import { Router } from "express";
import {
  getMyCustomerBookings,
  getProfile,
  listCustomers,
  updateCustomerBlacklist,
  updateProfile
} from "../controllers/customerController.js";
import { protect, protectCustomer } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { blacklistRules, customerProfileRules } from "../validators/customerValidators.js";

export const customerRouter = Router();

customerRouter.get("/me", protectCustomer, getProfile);
customerRouter.put("/me", protectCustomer, customerProfileRules, validate, updateProfile);
customerRouter.get("/me/bookings", protectCustomer, getMyCustomerBookings);
customerRouter.get("/admin/all", protect, listCustomers);
customerRouter.patch("/:id/blacklist", protect, blacklistRules, validate, updateCustomerBlacklist);
