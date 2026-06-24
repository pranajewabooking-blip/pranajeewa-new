import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  listAllBanners,
  listPublicBanners,
  updateBanner
} from "../controllers/newsBannerController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { newsBannerIdRules, newsBannerRules } from "../validators/newsBannerValidators.js";

export const newsBannerRouter = Router();

newsBannerRouter.get("/", listPublicBanners);
newsBannerRouter.get("/admin/all", protect, listAllBanners);
newsBannerRouter.post("/", protect, uploadImage.single("imageFile"), newsBannerRules, validate, createBanner);
newsBannerRouter.put("/:id", protect, uploadImage.single("imageFile"), newsBannerIdRules, newsBannerRules, validate, updateBanner);
newsBannerRouter.delete("/:id", protect, newsBannerIdRules, validate, deleteBanner);
