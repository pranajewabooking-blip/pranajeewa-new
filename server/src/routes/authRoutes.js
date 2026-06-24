import { Router } from "express";
import { login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginRules } from "../validators/authValidators.js";

export const authRouter = Router();

authRouter.post("/login", loginRules, validate, login);
authRouter.get("/me", protect, me);
