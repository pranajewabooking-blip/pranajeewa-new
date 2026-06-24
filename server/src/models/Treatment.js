import mongoose from "mongoose";
import { slugify } from "../utils/slug.js";

export const treatmentCategories = [
  "Clinic",
  "Wellness Treatment",
  "Sport Massage Therapy",
  "Beauty Treatment"
];

const treatmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      enum: treatmentCategories,
      required: true
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 60
    },
    price: {
      type: String,
      trim: true,
      maxlength: 60
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    galleryImages: {
      type: [String],
      default: []
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    keyFeatures: {
      type: [String],
      default: [],
      validate: {
        validator: (features) => features.length <= 12,
        message: "A treatment can include up to 12 key features"
      }
    },
    keyBenefits: {
      type: [String],
      default: [],
      validate: {
        validator: (benefits) => benefits.length <= 12,
        message: "A treatment can include up to 12 key benefits"
      }
    },
    includedTreatments: {
      type: [
        {
          name: {
            type: String,
            trim: true,
            maxlength: 120
          },
          description: {
            type: String,
            trim: true,
            maxlength: 700
          }
        }
      ],
      default: []
    },
    suitability: {
      type: String,
      trim: true,
      maxlength: 1200
    },
    process: {
      type: String,
      trim: true,
      maxlength: 1200
    },
    videos: {
      type: [String],
      default: []
    },
    videoUrl: {
      type: String,
      trim: true,
      maxlength: 500
    },
    buttonLabel: {
      type: String,
      trim: true,
      maxlength: 80
    },
    isFeatured: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

treatmentSchema.pre("validate", function ensureSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  next();
});

export const Treatment = mongoose.model("Treatment", treatmentSchema);
