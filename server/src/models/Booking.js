import crypto from "node:crypto";
import mongoose from "mongoose";

export const bookingStatuses = ["Pending", "Active", "Completed", "Cancelled"];

const bookingSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      index: true
    },
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
      maxlength: 30
    },
    customerGender: {
      type: String,
      enum: ["Male", "Female"],
      index: true
    },
    treatmentName: {
      type: String,
      trim: true,
      maxlength: 140
    },
    treatmentCategory: {
      type: String,
      trim: true,
      maxlength: 80
    },
    priceText: {
      type: String,
      trim: true,
      maxlength: 80
    },
    priceAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    bookingDate: {
      type: Date,
      required: true
    },
    bookingTime: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: bookingStatuses,
      default: "Pending",
      index: true
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 500
    },
    cancelledBy: {
      type: String,
      enum: ["customer", "admin"]
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre("validate", function assignPublicId(next) {
  if (!this.publicId) {
    this.publicId = `PJ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }

  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
