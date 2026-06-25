import { body, param, query } from "express-validator";
import { reviewStatuses } from "../models/Review.js";

export const createReviewRules = [
  body("treatmentId").isMongoId().withMessage("A valid treatment is required"),
  body("customerName").trim().isLength({ min: 2, max: 100 }).withMessage("Name is required"),
  body("contact").trim().isLength({ min: 5, max: 120 }).withMessage("Phone or email is required"),
  body("rating").toInt().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review must be 10 to 1000 characters")
];

export const treatmentReviewRules = [
  param("treatmentId").isMongoId().withMessage("A valid treatment id is required")
];

export const adminReviewListRules = [
  query("status").optional({ checkFalsy: true }).isIn(reviewStatuses),
  query("treatmentId").optional({ checkFalsy: true }).isMongoId()
];

export const reviewStatusRules = [
  param("id").isMongoId().withMessage("A valid review id is required"),
  body("status").isIn(reviewStatuses).withMessage(`Status must be one of: ${reviewStatuses.join(", ")}`)
];

export const reviewReplyRules = [
  param("id").isMongoId().withMessage("A valid review id is required"),
  body("adminReply").optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

export const reviewIdRules = [
  param("id").isMongoId().withMessage("A valid review id is required")
];
