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
