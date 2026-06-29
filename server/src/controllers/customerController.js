import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { Booking } from "../models/Booking.js";
import { Customer } from "../models/Customer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signCustomerToken } from "../utils/token.js";

const googleClient = new OAuth2Client(env.googleClientId);

const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");

const customerPayload = (customer) => {
  const plain = customer.toObject ? customer.toObject({ virtuals: true }) : customer;
  return {
    _id: plain._id,
    email: plain.email,
    name: plain.name,
    avatar: plain.avatar,
    mobileNumber: plain.mobileNumber || "",
    whatsappNumber: plain.whatsappNumber || "",
    address: plain.address || "",
    gender: plain.gender || "",
    cancelCount: plain.cancelCount || 0,
    isBlacklisted: Boolean(plain.isBlacklisted),
    blacklistReason: plain.blacklistReason || "",
    profileComplete: Boolean(plain.profileComplete),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt
  };
};

export const googleLogin = asyncHandler(async (req, res) => {
  if (!env.googleClientId) {
    return res.status(503).json({ message: "Google login is not configured yet" });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.credential,
    audience: env.googleClientId
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload?.email || payload.email_verified === false) {
    return res.status(401).json({ message: "Unable to verify this Google account" });
  }

  const existing = await Customer.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
  });

  const customer = existing || new Customer({ googleId: payload.sub, email: payload.email });

  customer.googleId = payload.sub;
  customer.email = payload.email.toLowerCase();
  customer.name = customer.name || payload.name || payload.email.split("@")[0];
  customer.avatar = payload.picture || customer.avatar;
  customer.lastLoginAt = new Date();

  await customer.save();

  res.json({
    token: signCustomerToken(customer),
    customer: customerPayload(customer)
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ customer: customerPayload(req.customer) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  req.customer.name = req.body.name;
  req.customer.mobileNumber = normalizePhone(req.body.mobileNumber);
  req.customer.whatsappNumber = normalizePhone(req.body.whatsappNumber);
  req.customer.address = req.body.address;
  req.customer.gender = req.body.gender;

  await req.customer.save();

  res.json({ customer: customerPayload(req.customer) });
});

export const getMyCustomerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.customer._id })
    .populate("treatment", "name slug image category")
    .sort({ bookingDate: -1, createdAt: -1 });

  res.json({ bookings });
});

export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  const ids = customers.map((customer) => customer._id);

  const bookingStats = await Booking.aggregate([
    { $match: { customer: { $in: ids } } },
    {
      $group: {
        _id: "$customer",
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
        },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
        },
        activeBookings: {
          $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }
        },
        totalSpent: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$priceAmount", 0] }
        },
        lastBookingAt: { $max: "$bookingDate" }
      }
    }
  ]);

  const statsByCustomer = new Map(bookingStats.map((item) => [item._id.toString(), item]));

  const decorated = customers
    .map((customer) => {
      const stats = statsByCustomer.get(customer._id.toString()) || {};

      return {
        ...customerPayload(customer),
        stats: {
          totalBookings: stats.totalBookings || 0,
          completedBookings: stats.completedBookings || 0,
          pendingBookings: stats.pendingBookings || 0,
          activeBookings: stats.activeBookings || 0,
          cancelledBookings: Math.max(stats.cancelledBookings || 0, customer.cancelCount || 0),
          totalSpent: stats.totalSpent || 0,
          lastBookingAt: stats.lastBookingAt || null
        }
      };
    })
    .sort((a, b) => {
      if (b.stats.completedBookings !== a.stats.completedBookings) {
        return b.stats.completedBookings - a.stats.completedBookings;
      }

      if (b.stats.totalBookings !== a.stats.totalBookings) {
        return b.stats.totalBookings - a.stats.totalBookings;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .map((customer, index) => ({ ...customer, rank: index + 1 }));

  res.json({ customers: decorated });
});

export const updateCustomerBlacklist = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  customer.isBlacklisted = req.body.isBlacklisted === true;
  customer.blacklistReason = req.body.blacklistReason || "";
  await customer.save();

  res.json({ customer: customerPayload(customer) });
});
