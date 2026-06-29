import { Booking } from "../models/Booking.js";
import { Customer } from "../models/Customer.js";
import { Treatment } from "../models/Treatment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");
const therapyStatuses = new Set(["Pending", "Active"]);

const parsePriceAmount = (value = "") => {
  const match = String(value).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

const populateBooking = (booking) =>
  booking.populate([
    { path: "treatment", select: "name slug image category" },
    { path: "customer", select: "name email mobileNumber whatsappNumber address gender isBlacklisted cancelCount" }
  ]);

const syncCancellationCount = async (booking, previousStatus, nextStatus) => {
  if (!booking.customer || previousStatus === nextStatus) return;

  if (previousStatus !== "Cancelled" && nextStatus === "Cancelled") {
    await Customer.findByIdAndUpdate(booking.customer, { $inc: { cancelCount: 1 } });
  }
};

export const createBooking = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.body.treatmentId);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  if (req.customer.isBlacklisted) {
    return res.status(403).json({
      message: req.customer.blacklistReason || "This account cannot create new bookings. Please contact Sethsuwa."
    });
  }

  if (!req.customer.profileComplete) {
    return res.status(422).json({ message: "Please complete and verify your profile before booking a treatment." });
  }

  const booking = await Booking.create({
    treatment: treatment._id,
    customer: req.customer._id,
    customerName: req.customer.name,
    phoneNumber: normalizePhone(req.customer.mobileNumber),
    customerGender: req.customer.gender,
    treatmentName: treatment.name,
    treatmentCategory: treatment.category,
    priceText: treatment.price || "",
    priceAmount: parsePriceAmount(treatment.price),
    bookingDate: req.body.bookingDate,
    bookingTime: req.body.bookingTime
  });

  await populateBooking(booking);

  res.status(201).json({
    message: "Booking request submitted",
    booking
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.customer._id })
    .populate("treatment", "name slug image category")
    .sort({ bookingDate: -1, createdAt: -1 });

  res.json({ bookings });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate("treatment", "name slug image category")
    .populate("customer", "name email mobileNumber whatsappNumber gender isBlacklisted cancelCount")
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const previousStatus = booking.status;

  booking.status = req.body.status;

  if (booking.status === "Cancelled" && previousStatus !== "Cancelled") {
    booking.cancelledBy = "admin";
    booking.cancelledAt = new Date();
  }

  if (req.body.adminNote !== undefined) {
    booking.adminNote = req.body.adminNote;
  }

  await booking.save();
  await syncCancellationCount(booking, previousStatus, booking.status);
  await populateBooking(booking);

  res.json({ booking });
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    customer: req.customer._id
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (!therapyStatuses.has(booking.status)) {
    return res.status(409).json({ message: "Only pending or active bookings can be cancelled." });
  }

  const previousStatus = booking.status;
  booking.status = "Cancelled";
  booking.cancelledBy = "customer";
  booking.cancelledAt = new Date();
  await booking.save();
  await syncCancellationCount(booking, previousStatus, booking.status);
  await populateBooking(booking);

  res.json({ booking });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.json({ message: "Booking deleted" });
});
