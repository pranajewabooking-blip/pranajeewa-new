import { body, param, query } from "express-validator";
import { bookingStatuses } from "../models/Booking.js";

export const bookingRules = [
  body("treatmentId").isMongoId().withMessage("A valid treatment is required"),
  body("customerName").trim().isLength({ min: 2, max: 100 }).withMessage("Customer name is required"),
  body("phoneNumber").trim().isLength({ min: 7, max: 30 }).withMessage("Phone number is required"),
  body("bookingDate").isISO8601().withMessage("Booking date must be a valid date"),
  body("bookingTime").trim().isLength({ min: 3, max: 20 }).withMessage("Booking time is required")
];

export const bookingStatusRules = [
  param("id").isMongoId().withMessage("Valid booking id is required"),
  body("status").isIn(bookingStatuses).withMessage(`Status must be one of: ${bookingStatuses.join(", ")}`),
  body("adminNote").optional({ checkFalsy: true }).trim().isLength({ max: 500 })
];

export const bookingIdParamRules = [
  param("id").isMongoId().withMessage("Valid booking id is required")
];

export const myBookingRules = [
  query("phone").trim().isLength({ min: 7, max: 30 }).withMessage("Phone number is required")
];
