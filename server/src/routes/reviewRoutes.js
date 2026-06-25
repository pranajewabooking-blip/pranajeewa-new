import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getTreatmentReviews,
  replyToReview,
  updateReviewStatus
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  adminReviewListRules,
  createReviewRules,
  reviewIdRules,
  reviewReplyRules,
  reviewStatusRules,
  treatmentReviewRules
} from "../validators/reviewValidators.js";

export const reviewRouter = Router();

reviewRouter.post("/", createReviewRules, validate, createReview);
reviewRouter.get("/treatment/:treatmentId", treatmentReviewRules, validate, getTreatmentReviews);
reviewRouter.get("/admin/all", protect, adminReviewListRules, validate, getAllReviews);
reviewRouter.patch("/:id/status", protect, reviewStatusRules, validate, updateReviewStatus);
reviewRouter.patch("/:id/reply", protect, reviewReplyRules, validate, replyToReview);
reviewRouter.delete("/:id", protect, reviewIdRules, validate, deleteReview);
