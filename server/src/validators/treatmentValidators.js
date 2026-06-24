import { body, param } from "express-validator";
import { treatmentCategories } from "../models/Treatment.js";

export const treatmentRules = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Treatment name is required"),
  body("category")
    .isIn(treatmentCategories)
    .withMessage(`Category must be one of: ${treatmentCategories.join(", ")}`),
  body("duration").optional({ checkFalsy: true }).trim().isLength({ max: 60 }),
  body("price").optional({ checkFalsy: true }).trim().isLength({ max: 60 }),
  body("image").optional({ checkFalsy: true }).isString().trim(),
  body("shortDescription")
    .trim()
    .isLength({ min: 12, max: 220 })
    .withMessage("Short description must be 12 to 220 characters"),
  body("description").trim().isLength({ min: 20 }).withMessage("Description is required"),
  body("keyFeatures").optional({ checkFalsy: true }),
  body("keyBenefits").optional({ checkFalsy: true }),
  body("galleryImages").optional({ checkFalsy: true }),
  body("includedTreatments").optional({ checkFalsy: true }),
  body("suitability").optional({ checkFalsy: true }).trim().isLength({ max: 1200 }),
  body("process").optional({ checkFalsy: true }).trim().isLength({ max: 1200 }),
  body("videos").optional({ checkFalsy: true }),
  body("videoUrl").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("buttonLabel").optional({ checkFalsy: true }).trim().isLength({ max: 80 })
];

export const treatmentIdParamRules = [
  param("id").isMongoId().withMessage("Valid treatment id is required")
];
