import { Router } from "express";
import { uploadSingleImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

export const uploadRouter = Router();

uploadRouter.post("/single", protect, uploadImage.single("imageFile"), uploadSingleImage);
