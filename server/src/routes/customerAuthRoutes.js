import { Router } from "express";
import { googleLogin } from "../controllers/customerController.js";
import { validate } from "../middleware/validate.js";
import { googleLoginRules } from "../validators/customerValidators.js";

export const customerAuthRouter = Router();

customerAuthRouter.post("/google", googleLoginRules, validate, googleLogin);
