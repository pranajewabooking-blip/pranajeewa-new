import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { newsBannerRouter } from "./newsBannerRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { treatmentRouter } from "./treatmentRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Pranajeewa booking API",
    timestamp: new Date().toISOString()
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/treatments", treatmentRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/news-banners", newsBannerRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/uploads", uploadRouter);
