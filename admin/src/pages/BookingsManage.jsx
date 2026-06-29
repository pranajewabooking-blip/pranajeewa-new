import { KeyRound, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { http, mediaUrl } from "../api/http";
import StatusBadge from "../components/StatusBadge";

const statuses = ["Pending", "Active", "Completed", "Cancelled"];
const deleteCode = "100200";
const deleteCodeHint = "100-200";
const formspreeEndpoint = "https://formspree.io/f/mkolzyzo";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium"
  }).format(new Date(value));

export default function BookingsManage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDigits, setDeleteDigits] = useState(Array(6).fill(""));
  const [deleteError, setDeleteError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const deleteInputRefs = useRef([]);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await http.get("/bookings/admin/all", {
        params: statusFilter === "All" ? {} : { status: statusFilter }
      });
      setBookings(response.data.bookings || []);
    } catch {
      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const counts = useMemo(() => {
    return statuses.reduce(
      (acc, status) => ({
        ...acc,
        [status]: bookings.filter((booking) => booking.status === status).length
      }),
      {}
    );
  }, [bookings]);

  const updateStatus = async (booking, status) => {
    setError("");
    setNotice("");

    try {
      const response = await http.patch(`/bookings/${booking._id}/status`, {
        status,
        adminNote: booking.adminNote || ""
      });
      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? response.data.booking : item))
      );
    } catch {
      setError("Unable to update booking status.");
    }
  };

  const updateNote = (id, value) => {
    setBookings((current) =>
      current.map((booking) => (booking._id === id ? { ...booking, adminNote: value } : booking))
    );
  };

  const saveNote = async (booking) => {
    setError("");
    setNotice("");

    try {
      const response = await http.patch(`/bookings/${booking._id}/status`, {
        status: booking.status,
        adminNote: booking.adminNote || ""
      });
      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? response.data.booking : item))
      );
    } catch {
      setError("Unable to save note.");
    }
  };

  const openDeleteDialog = (booking) => {
    setDeleteTarget(booking);
    setDeleteDigits(Array(6).fill(""));
    setDeleteError("");
    setError("");
    setNotice("");

    window.setTimeout(() => {
      deleteInputRefs.current[0]?.focus();
    }, 0);
  };

  const closeDeleteDialog = () => {
    if (deletingId) return;

    setDeleteTarget(null);
    setDeleteDigits(Array(6).fill(""));
    setDeleteError("");
  };

  const updateDeleteDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setDeleteDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
      deleteInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDeleteKeyDown = (index, event) => {
    if (event.key === "Backspace" && !deleteDigits[index] && index > 0) {
      deleteInputRefs.current[index - 1]?.focus();
    }
  };

  const handleDeletePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = Array(6).fill("");

    pastedDigits.forEach((digit, index) => {
      next[index] = digit;
    });

    setDeleteDigits(next);
    deleteInputRefs.current[Math.min(pastedDigits.length, 5)]?.focus();
  };

  const sendDeleteNotification = async (booking) => {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _subject: `Sethsuwa booking deleted: ${booking.publicId || booking._id}`,
        message: "A treatment booking was deleted from the Sethsuwa admin panel.",
        bookingReference: booking.publicId || "",
        customerName: booking.customerName || "",
        phoneNumber: booking.phoneNumber || "",
        customerEmail: booking.customer?.email || "",
        treatment: booking.treatment?.name || booking.treatmentName || "",
        bookingDate: booking.bookingDate ? formatDate(booking.bookingDate) : "",
        bookingTime: booking.bookingTime || "",
        status: booking.status || "",
        price: booking.priceText || "",
        deletedAt: new Date().toLocaleString("en-LK")
      })
    });

    if (!response.ok) {
      throw new Error("Unable to send delete notification.");
    }
  };

  const removeBooking = async () => {
    if (!deleteTarget) return;

    if (deleteDigits.join("") !== deleteCode) {
      setDeleteError(`Wrong code. Type ${deleteCodeHint} to delete this booking.`);
      return;
    }

    setDeletingId(deleteTarget._id);
    setError("");
    setNotice("");
    setDeleteError("");

    try {
      await http.delete(`/bookings/${deleteTarget._id}`);
      setBookings((current) => current.filter((item) => item._id !== deleteTarget._id));

      try {
        await sendDeleteNotification(deleteTarget);
        setNotice("Booking deleted and email notification sent.");
      } catch {
        setError("Booking deleted, but the email notification could not be sent.");
      }

      setDeleteTarget(null);
      setDeleteDigits(Array(6).fill(""));
    } catch {
      setError("Unable to delete booking.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-red">Booking Management</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">Treatment Bookings</h1>
        </div>
        <button
          type="button"
          onClick={loadBookings}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {["All", ...statuses].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-md px-4 py-2 text-sm font-bold ring-1 transition ${
              statusFilter === status
                ? "bg-brand-red text-white ring-brand-red"
                : "bg-white text-brand-charcoal ring-brand-gold/35 hover:bg-brand-cream"
            }`}
          >
            {status}
            {status !== "All" ? ` (${counts[status] || 0})` : ""}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
      {notice ? <p className="mt-6 rounded-md bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{notice}</p> : null}
      {loading ? <p className="mt-6 font-bold text-brand-maroon">Loading bookings...</p> : null}

      <div className="mt-8 space-y-5">
        {bookings.map((booking) => (
          <article key={booking._id} className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
            <div className="grid gap-5 xl:grid-cols-[130px_1fr_260px]">
              <img
                src={mediaUrl(booking.treatment?.image)}
                alt={booking.treatment?.name || "Treatment"}
                className="h-32 w-full rounded-md object-cover xl:w-32"
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={booking.status} />
                  <span className="text-xs font-bold text-brand-gold">{booking.publicId}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold text-brand-maroon">{booking.customerName}</h2>
                <p className="mt-1 text-sm text-slate-600">{booking.phoneNumber}</p>
                {booking.customer ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {booking.customer.email} | {booking.customer.gender || "Gender not set"}
                    {booking.customer.isBlacklisted ? " | Blacklisted" : ""}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {booking.treatment?.name} | {formatDate(booking.bookingDate)} at {booking.bookingTime}
                </p>
                {booking.priceText ? (
                  <p className="mt-1 text-sm font-bold text-brand-leaf">
                    Price: {booking.priceText}
                  </p>
                ) : null}
              </div>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Status</span>
                  <select
                    value={booking.status}
                    onChange={(event) => updateStatus(booking, event.target.value)}
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Admin Note</span>
                  <textarea
                    value={booking.adminNote || ""}
                    onChange={(event) => updateNote(booking._id, event.target.value)}
                    rows="3"
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => saveNote(booking)}
                  className="w-full rounded-md bg-brand-charcoal px-4 py-3 font-bold text-white transition hover:bg-brand-maroon"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteDialog(booking)}
                  disabled={deletingId === booking._id}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-rose-100 px-4 py-3 font-bold text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 size={17} />
                  {deletingId === booking._id ? "Deleting..." : "Delete Booking"}
                </button>
              </div>
            </div>
          </article>
        ))}

        {!loading && !bookings.length ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-slate-600 shadow-soft">
            No bookings found.
          </p>
        ) : null}
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-brand-charcoal/55 backdrop-blur-sm"
            aria-label="Close delete confirmation"
            onClick={closeDeleteDialog}
          />
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/10">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={Boolean(deletingId)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-brand-charcoal transition hover:bg-slate-200 disabled:opacity-50"
              aria-label="Close delete confirmation"
            >
              <X size={18} />
            </button>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-rose-100 text-rose-700">
              <KeyRound size={23} />
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-brand-charcoal">Confirm Booking Delete</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Type the security code to permanently delete{" "}
              <span className="font-bold text-brand-maroon">{deleteTarget.publicId || "this booking"}</span>.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              {deleteDigits.map((digit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    ref={(element) => {
                      deleteInputRefs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) => updateDeleteDigit(index, event.target.value)}
                    onKeyDown={(event) => handleDeleteKeyDown(index, event)}
                    onPaste={handleDeletePaste}
                    inputMode="numeric"
                    maxLength="1"
                    className="h-12 w-10 rounded-md border border-brand-gold/45 text-center text-xl font-bold text-brand-charcoal outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15 sm:h-14 sm:w-12"
                    aria-label={`Delete code digit ${index + 1}`}
                  />
                  {index === 2 ? <span className="text-xl font-bold text-brand-maroon">-</span> : null}
                </div>
              ))}
            </div>

            {deleteError ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{deleteError}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={removeBooking}
                disabled={Boolean(deletingId)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 size={18} />
                {deletingId ? "Deleting..." : "Delete Booking"}
              </button>
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingId)}
                className="rounded-md bg-slate-100 px-5 py-3 font-bold text-brand-charcoal transition hover:bg-slate-200 disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
