import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, Clock3, Image as ImageIcon, Phone, Sparkles, User, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http, mediaUrl } from "../api/http";
import LoadingState from "../components/LoadingState";
import { fallbackTreatments } from "../data/fallbacks";

const today = new Date().toISOString().split("T")[0];

export default function TreatmentDetails() {
  const { idOrSlug } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    bookingDate: today,
    bookingTime: "09:00"
  });

  useEffect(() => {
    const loadTreatment = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await http.get(`/treatments/${idOrSlug}`);
        setTreatment(response.data.treatment);
      } catch {
        const fallback = fallbackTreatments.find((item) => item.slug === idOrSlug);
        setTreatment(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    loadTreatment();
  }, [idOrSlug]);

  const canBook = useMemo(() => Boolean(treatment?._id), [treatment]);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    if (!canBook) {
      setSubmitting(false);
      setError("Online booking is temporarily unavailable for this treatment. Please choose another live treatment or contact Sethsuwa.");
      return;
    }

    try {
      const response = await http.post("/bookings", {
        treatmentId: treatment._id,
        ...form
      });

      window.localStorage.setItem("pranajeewa_booking_phone", form.phoneNumber);
      setMessage(`Booking submitted. Reference ${response.data.booking.publicId}`);
      setForm((current) => ({ ...current, customerName: "" }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit the booking right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading treatment" />;

  if (!treatment) {
    return (
      <section className="bg-white py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-maroon">Treatment not found</h1>
        <Link to="/treatments" className="mt-6 inline-flex rounded-md bg-brand-red px-5 py-3 font-bold text-white">
          Back to Treatments
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="bg-brand-charcoal py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-bold uppercase text-brand-gold">{treatment.category}</span>
            <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">{treatment.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">{treatment.shortDescription}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {treatment.duration ? (
                <span className="inline-flex items-center gap-2 rounded-md bg-white/12 px-4 py-2 font-bold text-brand-gold ring-1 ring-white/15">
                  <Clock3 size={18} /> {treatment.duration}
                </span>
              ) : null}
              {treatment.price ? (
                <span className="inline-flex items-center gap-2 rounded-md bg-white/12 px-4 py-2 font-bold text-brand-gold ring-1 ring-white/15">
                  <Wallet size={18} /> {treatment.price}
                </span>
              ) : null}
            </div>
          </motion.div>
          <motion.div
            className="overflow-hidden rounded-lg shadow-soft"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <img src={mediaUrl(treatment.image)} alt={treatment.name} className="aspect-[4/3] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-brand-charcoal">Treatment Details</h2>
            <p className="mt-6 text-base leading-8 text-slate-700">{treatment.description}</p>

            {treatment.keyFeatures?.length ? (
              <div className="mt-10">
                <h3 className="font-display text-2xl font-bold text-brand-maroon">Key Features</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {treatment.keyFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-lg bg-brand-cream p-4">
                      <CheckCircle2 className="mt-1 shrink-0 text-brand-red" size={20} />
                      <span className="font-semibold text-brand-charcoal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {treatment.keyBenefits?.length ? (
              <div className="mt-10">
                <h3 className="font-display text-2xl font-bold text-brand-maroon">Key Benefits</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {treatment.keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-brand-gold/25">
                      <Sparkles className="mt-1 shrink-0 text-brand-gold" size={20} />
                      <span className="font-semibold text-brand-charcoal">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {treatment.includedTreatments?.length ? (
              <div className="mt-10">
                <h3 className="font-display text-2xl font-bold text-brand-maroon">Included Treatments</h3>
                <div className="mt-4 space-y-4">
                  {treatment.includedTreatments.map((item) => (
                    <div key={item.name} className="rounded-lg bg-brand-cream p-5">
                      <h4 className="font-display text-xl font-bold text-brand-charcoal">{item.name}</h4>
                      {item.description ? <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {treatment.suitability || treatment.process ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {treatment.suitability ? (
                  <div className="rounded-lg bg-brand-charcoal p-5 text-white">
                    <h3 className="font-display text-2xl font-bold text-brand-gold">Suitable For</h3>
                    <p className="mt-3 text-sm leading-7 text-white/76">{treatment.suitability}</p>
                  </div>
                ) : null}
                {treatment.process ? (
                  <div className="rounded-lg bg-brand-maroon p-5 text-white">
                    <h3 className="font-display text-2xl font-bold text-brand-gold">Process</h3>
                    <p className="mt-3 text-sm leading-7 text-white/76">{treatment.process}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {treatment.galleryImages?.length ? (
              <div className="mt-10">
                <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-brand-maroon">
                  <ImageIcon size={22} /> Gallery
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {treatment.galleryImages.slice(0, 6).map((image) => (
                    <img key={image} src={mediaUrl(image)} alt={treatment.name} className="aspect-[4/3] rounded-lg object-cover shadow-sm" loading="lazy" />
                  ))}
                </div>
              </div>
            ) : null}

            {(treatment.videoUrl || treatment.videos?.length) ? (
              <div className="mt-10 overflow-hidden rounded-lg shadow-soft">
                <iframe
                  title={`${treatment.name} video`}
                  src={treatment.videoUrl || treatment.videos[0]}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>

          <motion.form
            onSubmit={submitBooking}
            className="luxury-border rounded-lg bg-brand-cream p-6 shadow-soft ring-1 ring-black/5 md:p-8"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <h2 className="font-display text-3xl font-bold text-brand-maroon">Book This Treatment</h2>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                  <User size={17} /> Customer Name
                </span>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={updateField}
                  required
                  className="w-full rounded-md border border-brand-gold/35 bg-white px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                  <Phone size={17} /> Phone Number
                </span>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={updateField}
                  required
                  className="w-full rounded-md border border-brand-gold/35 bg-white px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                    <CalendarDays size={17} /> Booking Date
                  </span>
                  <input
                    type="date"
                    name="bookingDate"
                    min={today}
                    value={form.bookingDate}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 bg-white px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                    <Clock size={17} /> Booking Time
                  </span>
                  <input
                    type="time"
                    name="bookingTime"
                    value={form.bookingTime}
                    onChange={updateField}
                    required
                    className="w-full rounded-md border border-brand-gold/35 bg-white px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
              </div>
            </div>

            {message ? <p className="mt-5 rounded-md bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
            {error ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-maroon disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : treatment.buttonLabel || "Submit Booking"}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
