import mongoose from "mongoose";

export const reviewStatuses = ["Pending", "Approved", "Hidden"];

const reviewSchema = new mongoose.Schema(
  {
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      select: false
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: reviewStatuses,
      default: "Pending",
      index: true
    },
    adminReply: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ treatment: 1, status: 1, createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);
