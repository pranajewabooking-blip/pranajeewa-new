import { Booking } from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const money = (value) => Math.round((Number(value) || 0) * 100) / 100;

const parsePriceAmount = (value = "") => {
  const match = String(value).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

const monthName = (monthIndex) =>
  new Intl.DateTimeFormat("en-LK", { month: "long" }).format(new Date(Date.UTC(2026, monthIndex, 1)));

const getReportPeriod = (query) => {
  const now = new Date();
  const parsedYear = Number(query.year);
  const parsedMonth = Number(query.month);
  const year = Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100
    ? parsedYear
    : now.getFullYear();
  const month = Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
    ? parsedMonth
    : now.getMonth() + 1;

  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  return {
    year,
    month,
    label: `${monthName(month - 1)} ${year}`,
    start,
    end
  };
};

export const getIncomeReport = asyncHandler(async (req, res) => {
  const period = getReportPeriod(req.query);

  const bookings = await Booking.find({
    bookingDate: { $gte: period.start, $lt: period.end },
    status: "Completed"
  })
    .populate("treatment", "name category price")
    .populate("customer", "name email gender")
    .sort({ bookingDate: -1, createdAt: -1 });

  const totals = bookings.reduce(
    (acc, booking) => {
      const amount = Number(booking.priceAmount || parsePriceAmount(booking.priceText || booking.treatment?.price));
      const gender = booking.customerGender || booking.customer?.gender || "Unknown";

      acc.completedCount += 1;
      acc.totalIncome += amount;

      if (gender === "Male") {
        acc.maleIncome += amount;
        acc.maleTherapyShare += amount * 0.2;
      } else if (gender === "Female") {
        acc.femaleIncome += amount;
        acc.femaleTherapyShare += amount * 0.2;
      } else {
        acc.unassignedIncome += amount;
      }

      return acc;
    },
    {
      completedCount: 0,
      totalIncome: 0,
      maleIncome: 0,
      femaleIncome: 0,
      unassignedIncome: 0,
      maleTherapyShare: 0,
      femaleTherapyShare: 0
    }
  );

  const normalizedTotals = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, key.endsWith("Count") ? value : money(value)])
  );

  normalizedTotals.netClinicIncome = money(
    normalizedTotals.totalIncome -
      normalizedTotals.maleTherapyShare -
      normalizedTotals.femaleTherapyShare
  );

  res.json({
    period,
    totals: normalizedTotals,
    bookings: bookings.map((booking) => ({
      _id: booking._id,
      publicId: booking.publicId,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      customerName: booking.customer?.name || booking.customerName,
      customerGender: booking.customerGender || booking.customer?.gender || "",
      treatmentName: booking.treatmentName || booking.treatment?.name,
      treatmentCategory: booking.treatmentCategory || booking.treatment?.category,
      priceText: booking.priceText,
      priceAmount: money(booking.priceAmount || parsePriceAmount(booking.priceText || booking.treatment?.price))
    }))
  });
});
