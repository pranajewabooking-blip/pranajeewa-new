import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { http, mediaUrl } from "../api/http";
import StatusBadge from "../components/StatusBadge";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium"
  }).format(new Date(value));

export default function MyBookings() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPhone = window.localStorage.getItem("pranajeewa_booking_phone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const searchBookings = async (event) => {
    event?.preventDefault();

    if (!phone.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await http.get("/bookings/my", { params: { phone } });
      setBookings(response.data.bookings || []);
      window.localStorage.setItem("pranajeewa_booking_phone", phone);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-brand-cream py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-bold uppercase text-brand-red">My Bookings</span>
          <h1 className="mt-3 font-display text-5xl font-bold text-brand-charcoal">Track Your Treatment Status</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-700">
            Enter the phone number used during booking to view your appointment status.
          </p>
        </div>

        <form onSubmit={searchBookings} className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-lg bg-white p-4 shadow-soft sm:flex-row">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="min-h-12 flex-1 rounded-md border border-brand-gold/35 px-4 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-6 font-bold text-white transition hover:bg-brand-maroon"
          >
            <Search size={18} /> Search
          </button>
        </form>

        {error ? <p className="mx-auto mt-6 max-w-2xl rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

        <div className="mt-12 space-y-5">
          {loading ? (
            <p className="text-center font-bold text-brand-maroon">Loading bookings...</p>
          ) : bookings.length ? (
            bookings.map((booking) => (
              <article key={booking._id} className="grid gap-5 rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5 md:grid-cols-[140px_1fr_auto]">
                <img
                  src={mediaUrl(booking.treatment?.image)}
                  alt={booking.treatment?.name || "Treatment"}
                  className="h-32 w-full rounded-md object-cover md:w-36"
                />
                <div>
                  <p className="text-sm font-bold text-brand-gold">{booking.publicId}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-brand-maroon">{booking.treatment?.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {formatDate(booking.bookingDate)} at {booking.bookingTime}
                  </p>
                  {booking.adminNote ? <p className="mt-3 text-sm text-slate-600">{booking.adminNote}</p> : null}
                </div>
                <div className="flex items-start md:justify-end">
                  <StatusBadge status={booking.status} />
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg bg-white px-6 py-8 text-center text-slate-600 shadow-soft">
              No bookings found for this phone number yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
