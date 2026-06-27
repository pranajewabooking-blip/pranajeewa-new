import { RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { http, mediaUrl } from "../api/http";
import StatusBadge from "../components/StatusBadge";

const statuses = ["Pending", "Active", "Completed", "Cancelled"];

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium"
  }).format(new Date(value));

export default function BookingsManage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

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

  const removeBooking = async (booking) => {
    const confirmed = window.confirm(`Delete booking ${booking.publicId || ""} for ${booking.customerName}?`);
    if (!confirmed) return;

    setDeletingId(booking._id);
    setError("");

    try {
      await http.delete(`/bookings/${booking._id}`);
      setBookings((current) => current.filter((item) => item._id !== booking._id));
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
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {booking.treatment?.name} | {formatDate(booking.bookingDate)} at {booking.bookingTime}
                </p>
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
                  onClick={() => removeBooking(booking)}
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
    </div>
  );
}
