import { body, param } from "express-validator";
import { customerGenders } from "../models/Customer.js";

export const googleLoginRules = [
  body("credential").trim().isLength({ min: 20 }).withMessage("Google credential is required")
];

export const customerProfileRules = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name is required"),
  body("mobileNumber").trim().isLength({ min: 7, max: 30 }).withMessage("Mobile number is required"),
  body("whatsappNumber").trim().isLength({ min: 7, max: 30 }).withMessage("WhatsApp number is required"),
  body("address").trim().isLength({ min: 5, max: 500 }).withMessage("Address is required"),
  body("gender").isIn(customerGenders).withMessage(`Gender must be one of: ${customerGenders.join(", ")}`)
];

export const customerIdRules = [
  param("id").isMongoId().withMessage("Valid customer id is required")
];

export const blacklistRules = [
  param("id").isMongoId().withMessage("Valid customer id is required"),
  body("isBlacklisted").isBoolean().withMessage("Blacklist status is required"),
  body("blacklistReason").optional({ checkFalsy: true }).trim().isLength({ max: 500 })
];
