import mongoose from "mongoose";

export const customerGenders = ["Male", "Female"];

const customerSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    avatar: {
      type: String,
      trim: true,
      maxlength: 500
    },
    mobileNumber: {
      type: String,
      trim: true,
      maxlength: 30
    },
    whatsappNumber: {
      type: String,
      trim: true,
      maxlength: 30
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500
    },
    gender: {
      type: String,
      enum: customerGenders
    },
    cancelCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
      index: true
    },
    blacklistReason: {
      type: String,
      trim: true,
      maxlength: 500
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerSchema.virtual("profileComplete").get(function profileComplete() {
  return Boolean(
    this.name &&
      this.email &&
      this.mobileNumber &&
      this.whatsappNumber &&
      this.address &&
      this.gender
  );
});

export const Customer = mongoose.model("Customer", customerSchema);
