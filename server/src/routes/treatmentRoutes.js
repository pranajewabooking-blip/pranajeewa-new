import { Router } from "express";
import {
  createTreatment,
  deleteTreatment,
  getTreatment,
  listTreatments,
  updateTreatment
} from "../controllers/treatmentController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { treatmentIdParamRules, treatmentRules } from "../validators/treatmentValidators.js";

export const treatmentRouter = Router();

treatmentRouter.get("/", listTreatments);
treatmentRouter.get("/:idOrSlug", getTreatment);
treatmentRouter.post("/", protect, uploadImage.single("imageFile"), treatmentRules, validate, createTreatment);
treatmentRouter.put("/:id", protect, uploadImage.single("imageFile"), treatmentIdParamRules, treatmentRules, validate, updateTreatment);
treatmentRouter.delete("/:id", protect, treatmentIdParamRules, validate, deleteTreatment);
