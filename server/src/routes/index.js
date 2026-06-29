import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { customerAuthRouter } from "./customerAuthRoutes.js";
import { customerRouter } from "./customerRoutes.js";
import { newsBannerRouter } from "./newsBannerRoutes.js";
import { reportRouter } from "./reportRoutes.js";
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
apiRouter.use("/customer-auth", customerAuthRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/treatments", treatmentRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/news-banners", newsBannerRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/uploads", uploadRouter);
