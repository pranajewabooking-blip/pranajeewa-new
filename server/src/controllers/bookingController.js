import { Booking } from "../models/Booking.js";
import { Treatment } from "../models/Treatment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");

export const createBooking = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.body.treatmentId);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  const booking = await Booking.create({
    treatment: treatment._id,
    customerName: req.body.customerName,
    phoneNumber: normalizePhone(req.body.phoneNumber),
    bookingDate: req.body.bookingDate,
    bookingTime: req.body.bookingTime
  });

  await booking.populate("treatment", "name slug image category");

  res.status(201).json({
    message: "Booking request submitted",
    booking
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const phoneNumber = normalizePhone(req.query.phone);

  const bookings = await Booking.find({ phoneNumber })
    .populate("treatment", "name slug image category")
    .sort({ bookingDate: -1, createdAt: -1 });

  res.json({ bookings });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate("treatment", "name slug image category")
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  booking.status = req.body.status;

  if (req.body.adminNote !== undefined) {
    booking.adminNote = req.body.adminNote;
  }

  await booking.save();
  await booking.populate("treatment", "name slug image category");

  res.json({ booking });
});
