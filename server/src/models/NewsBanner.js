import mongoose from "mongoose";

const newsBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 120
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    altText: {
      type: String,
      trim: true,
      maxlength: 160
    },
    linkUrl: {
      type: String,
      trim: true,
      maxlength: 300
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const NewsBanner = mongoose.model("NewsBanner", newsBannerSchema);
