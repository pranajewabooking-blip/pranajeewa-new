import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { bookingIdParamRules, bookingRules, bookingStatusRules, myBookingRules } from "../validators/bookingValidators.js";

export const bookingRouter = Router();

bookingRouter.post("/", bookingRules, validate, createBooking);
bookingRouter.get("/my", myBookingRules, validate, getMyBookings);
bookingRouter.get("/admin/all", protect, getAllBookings);
bookingRouter.patch("/:id/status", protect, bookingStatusRules, validate, updateBookingStatus);
bookingRouter.delete("/:id", protect, bookingIdParamRules, validate, deleteBooking);
