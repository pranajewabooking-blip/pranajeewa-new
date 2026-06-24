import { body, param } from "express-validator";

export const newsBannerRules = [
  body("title").optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body("image").optional({ checkFalsy: true }).isString().trim(),
  body("altText").optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body("linkUrl").optional({ checkFalsy: true }).isURL().withMessage("Link must be a valid URL"),
  body("isActive").optional().toBoolean().isBoolean(),
  body("sortOrder").optional().toInt().isInt({ min: 0 })
];

export const newsBannerIdRules = [
  param("id").isMongoId().withMessage("Valid news banner id is required")
];
