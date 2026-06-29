import { CalendarDays, CheckCircle2, Edit3, History, Lock, Save, ShieldAlert, UserRound, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http, mediaUrl } from "../api/http";
import GoogleLoginButton from "../components/GoogleLoginButton";
import StatusBadge from "../components/StatusBadge";
import { isCustomerProfileComplete, useCustomerAuth } from "../contexts/CustomerAuthContext";

const emptyProfile = {
  name: "",
  mobileNumber: "",
  whatsappNumber: "",
  address: "",
  gender: ""
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium"
  }).format(new Date(value));

export default function Profile() {
  const { customer, loading, updateProfile, profileComplete } = useCustomerAuth();
  const [form, setForm] = useState(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    if (!customer) return;

    setForm({
      name: customer.name || "",
      mobileNumber: customer.mobileNumber || "",
      whatsappNumber: customer.whatsappNumber || "",
      address: customer.address || "",
      gender: customer.gender || ""
    });
  }, [customer]);

  const stats = useMemo(() => {
    const base = {
      total: bookings.length,
      completed: 0,
      pending: 0,
      active: 0,
      cancelled: 0
    };

    bookings.forEach((booking) => {
      const key = String(booking.status || "").toLowerCase();
      if (base[key] !== undefined) base[key] += 1;
    });

    return base;
  }, [bookings]);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const updated = await updateProfile(form);
      setMessage(isCustomerProfileComplete(updated) ? "Profile verified. You can book treatments now." : "Profile saved.");
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.[0]?.message;
      setError(validationMessage || requestError.response?.data?.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const loadHistory = async () => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setError("");

    try {
      const response = await http.get("/customers/me/bookings");
      setBookings(response.data.bookings || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load treatment history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const cancelBooking = async (booking) => {
    const confirmed = window.confirm(`Cancel booking ${booking.publicId}?`);
    if (!confirmed) return;

    setCancellingId(booking._id);
    setError("");
    setMessage("");

    try {
      const response = await http.patch(`/bookings/${booking._id}/cancel`);
      setBookings((current) => current.map((item) => (item._id === booking._id ? response.data.booking : item)));
      setMessage("Booking cancelled.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to cancel this booking.");
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-brand-cream py-20">
        <p className="text-center font-bold text-brand-maroon">Loading profile...</p>
      </section>
    );
  }

  if (!customer) {
    return (
      <section className="min-h-[70vh] bg-brand-cream py-20">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center shadow-soft ring-1 ring-black/5">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-red text-white">
            <Lock size={24} />
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-brand-charcoal">Customer Login</h1>
          <p className="mt-4 leading-8 text-slate-600">
            Log in with your Google account to create your profile, book treatments, and view your treatment history.
          </p>
          <div className="mx-auto mt-7 max-w-sm">
            <GoogleLoginButton onError={setLoginError} />
          </div>
          {loginError ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{loginError}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-brand-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white">
                  <UserRound size={26} />
                </span>
              )}
              <div>
                <p className="text-sm font-bold uppercase text-brand-red">My Profile</p>
                <h1 className="font-display text-3xl font-bold text-brand-charcoal">{customer.name}</h1>
                <p className="text-sm text-slate-500">{customer.email}</p>
              </div>
            </div>

            <div className={`mt-6 rounded-lg p-4 ${profileComplete ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-950"}`}>
              <p className="flex items-center gap-2 font-bold">
                {profileComplete ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                {profileComplete ? "Profile Verified" : "Profile Details Required"}
              </p>
              <p className="mt-2 text-sm leading-6">
                {profileComplete
                  ? "You can book treatments with this customer account."
                  : "Please fill name, mobile, WhatsApp, address, and gender before booking."}
              </p>
            </div>

            {customer.isBlacklisted ? (
              <div className="mt-4 rounded-lg bg-rose-100 p-4 text-rose-900">
                <p className="flex items-center gap-2 font-bold">
                  <XCircle size={18} /> Booking Disabled
                </p>
                <p className="mt-2 text-sm leading-6">{customer.blacklistReason || "Please contact Sethsuwa reception."}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={loadHistory}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-charcoal px-5 py-3 font-bold text-white transition hover:bg-brand-maroon"
            >
              <History size={18} /> Treatment History
            </button>
          </aside>

          <div className="space-y-6">
            <form onSubmit={saveProfile} className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
              <div className="flex items-center gap-2">
                <Edit3 className="text-brand-red" size={21} />
                <h2 className="font-display text-3xl font-bold text-brand-charcoal">Edit Profile Details</h2>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Gender</span>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Mobile Number</span>
                  <input
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">WhatsApp Number</span>
                  <input
                    name="whatsappNumber"
                    value={form.whatsappNumber}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Address</span>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    required
                    rows="3"
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
              </div>

              {message ? <p className="mt-5 rounded-md bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
              {error ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon disabled:opacity-70"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>

            {historyOpen ? (
              <section className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase text-brand-red">Treatment History</p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-brand-charcoal">Your Bookings</h2>
                  </div>
                  <button
                    type="button"
                    onClick={loadHistory}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-cream px-4 py-3 font-bold text-brand-maroon"
                  >
                    <CalendarDays size={17} /> Refresh
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    ["Total", stats.total],
                    ["Completed", stats.completed],
                    ["Pending", stats.pending],
                    ["Active", stats.active],
                    ["Cancelled", stats.cancelled]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-brand-cream p-4">
                      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                      <p className="mt-2 font-display text-3xl font-bold text-brand-maroon">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  {historyLoading ? <p className="font-bold text-brand-maroon">Loading history...</p> : null}
                  {!historyLoading && bookings.length
                    ? bookings.map((booking) => (
                        <article key={booking._id} className="grid gap-4 rounded-lg border border-brand-gold/25 p-4 md:grid-cols-[110px_1fr_auto]">
                          <img
                            src={mediaUrl(booking.treatment?.image)}
                            alt={booking.treatment?.name || "Treatment"}
                            className="h-28 w-full rounded-md object-cover md:w-28"
                          />
                          <div>
                            <p className="text-sm font-bold text-brand-gold">{booking.publicId}</p>
                            <h3 className="mt-1 font-display text-2xl font-bold text-brand-maroon">{booking.treatment?.name || booking.treatmentName}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                              {formatDate(booking.bookingDate)} at {booking.bookingTime}
                            </p>
                            {booking.adminNote ? <p className="mt-2 text-sm text-slate-600">{booking.adminNote}</p> : null}
                          </div>
                          <div className="flex flex-col items-start gap-3 md:items-end">
                            <StatusBadge status={booking.status} />
                            {["Pending", "Active"].includes(booking.status) ? (
                              <button
                                type="button"
                                onClick={() => cancelBooking(booking)}
                                disabled={cancellingId === booking._id}
                                className="rounded-md bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-200 disabled:opacity-70"
                              >
                                {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                              </button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    : null}

                  {!historyLoading && !bookings.length ? (
                    <p className="rounded-lg bg-brand-cream px-6 py-8 text-center text-slate-600">
                      No treatment bookings yet. Visit the treatments page to make your first booking.
                    </p>
                  ) : null}
                </div>

                <Link
                  to="/treatments"
                  className="mt-6 inline-flex rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon"
                >
                  Browse Treatments
                </Link>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
