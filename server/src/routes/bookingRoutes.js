import { Router } from "express";
import {
  createBooking,
  cancelMyBooking,
  deleteBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { protect, protectCustomer } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { bookingIdParamRules, bookingRules, bookingStatusRules } from "../validators/bookingValidators.js";

export const bookingRouter = Router();

bookingRouter.post("/", protectCustomer, bookingRules, validate, createBooking);
bookingRouter.get("/my", protectCustomer, getMyBookings);
bookingRouter.get("/admin/all", protect, getAllBookings);
bookingRouter.patch("/:id/status", protect, bookingStatusRules, validate, updateBookingStatus);
bookingRouter.patch("/:id/cancel", protectCustomer, bookingIdParamRules, validate, cancelMyBooking);
bookingRouter.delete("/:id", protect, bookingIdParamRules, validate, deleteBooking);
