import { Router } from "express";
import { getIncomeReport } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

export const reportRouter = Router();

reportRouter.get("/income", protect, getIncomeReport);
