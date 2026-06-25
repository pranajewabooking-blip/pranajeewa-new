import { Review } from "../models/Review.js";
import { Treatment } from "../models/Treatment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicReviewSelect = "customerName rating message adminReply repliedAt createdAt";

export const createReview = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.body.treatmentId);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  const review = await Review.create({
    treatment: treatment._id,
    customerName: req.body.customerName,
    contact: req.body.contact,
    rating: req.body.rating,
    message: req.body.message
  });

  res.status(201).json({
    message: "Review submitted and pending approval",
    review: {
      id: review._id,
      status: review.status
    }
  });
});

export const getTreatmentReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    treatment: req.params.treatmentId,
    status: "Approved"
  })
    .select(publicReviewSelect)
    .sort({ createdAt: -1 });

  res.json({ reviews });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.treatmentId) filter.treatment = req.query.treatmentId;

  const reviews = await Review.find(filter)
    .select("+contact")
    .populate("treatment", "name slug image category")
    .sort({ createdAt: -1 });

  res.json({ reviews });
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).select("+contact");

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.status = req.body.status;
  await review.save();
  await review.populate("treatment", "name slug image category");

  res.json({ review });
});

export const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).select("+contact");

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.adminReply = req.body.adminReply || "";
  review.repliedAt = req.body.adminReply ? new Date() : undefined;
  await review.save();
  await review.populate("treatment", "name slug image category");

  res.json({ review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ message: "Review deleted" });
});
