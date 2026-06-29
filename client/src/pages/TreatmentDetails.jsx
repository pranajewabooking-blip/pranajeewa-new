import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, Clock3, Image as ImageIcon, LogIn, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http, mediaUrl } from "../api/http";
import LoadingState from "../components/LoadingState";
import StarRating from "../components/StarRating";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";
import { fallbackTreatments } from "../data/fallbacks";

const today = new Date().toISOString().split("T")[0];

export default function TreatmentDetails() {
  const { idOrSlug } = useParams();
  const { customer, profileComplete, openLogin } = useCustomerAuth();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [form, setForm] = useState({
    bookingDate: today,
    bookingTime: "09:00"
  });
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    contact: "",
    rating: 5,
    message: ""
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

  useEffect(() => {
    const loadReviews = async () => {
      if (!treatment?._id) {
        setReviews([]);
        return;
      }

      try {
        const response = await http.get(`/reviews/treatment/${treatment._id}`);
        setReviews(response.data.reviews || []);
      } catch {
        setReviews([]);
      }
    };

    loadReviews();
  }, [treatment?._id]);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const updateReviewField = (event) => {
    setReviewForm((current) => ({
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

    if (!customer) {
      setSubmitting(false);
      setError("Please log in with Google before booking a treatment.");
      openLogin();
      return;
    }

    if (!profileComplete) {
      setSubmitting(false);
      setError("Please complete and verify your profile details before booking a treatment.");
      return;
    }

    if (customer.isBlacklisted) {
      setSubmitting(false);
      setError(customer.blacklistReason || "This account cannot create new bookings. Please contact Sethsuwa.");
      return;
    }

    try {
      const response = await http.post("/bookings", {
        treatmentId: treatment._id,
        ...form
      });

      setMessage(`Booking submitted. Reference ${response.data.booking.publicId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit the booking right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    setReviewMessage("");

    if (!treatment?._id) {
      setReviewSubmitting(false);
      setReviewError("Reviews are temporarily unavailable for this treatment.");
      return;
    }

    try {
      await http.post("/reviews", {
        treatmentId: treatment._id,
        ...reviewForm
      });

      setReviewMessage("Thank you. Your review is pending approval.");
      setReviewForm({
        customerName: "",
        contact: "",
        rating: 5,
        message: ""
      });
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.[0]?.message;
      setReviewError(validationMessage || requestError.response?.data?.message || "Unable to submit your review right now.");
    } finally {
      setReviewSubmitting(false);
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
            <StarRating
              value={treatment.reviewStats?.averageRating || 0}
              count={treatment.reviewStats?.reviewCount || 0}
              className="mt-5"
              countClassName="text-white/75"
            />
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
            {!customer ? (
              <div className="mt-5 rounded-lg bg-amber-100 p-4 text-amber-950">
                <p className="flex items-center gap-2 font-bold">
                  <ShieldAlert size={18} /> Customer login required
                </p>
                <p className="mt-2 text-sm leading-6">Please log in with Google before creating a treatment booking.</p>
                <button
                  type="button"
                  onClick={openLogin}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-sm font-bold text-white"
                >
                  <LogIn size={16} /> Log in
                </button>
              </div>
            ) : !profileComplete ? (
              <div className="mt-5 rounded-lg bg-amber-100 p-4 text-amber-950">
                <p className="flex items-center gap-2 font-bold">
                  <ShieldAlert size={18} /> Profile verification required
                </p>
                <p className="mt-2 text-sm leading-6">
                  Fill your name, mobile number, WhatsApp number, address, and gender on the profile page before booking.
                </p>
                <Link
                  to="/profile"
                  className="mt-4 inline-flex rounded-md bg-brand-charcoal px-4 py-2 text-sm font-bold text-white"
                >
                  Complete Profile
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-lg bg-emerald-100 p-4 text-emerald-900">
                <p className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={18} /> Booking as {customer.name}
                </p>
                <p className="mt-2 text-sm leading-6">
                  Mobile: {customer.mobileNumber} | Gender: {customer.gender}
                </p>
              </div>
            )}
            <div className="mt-6 space-y-4">
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
              disabled={submitting || !customer || !profileComplete || customer?.isBlacklisted}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-maroon disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : treatment.buttonLabel || "Submit Booking"}
            </button>
          </motion.form>
        </div>
      </section>

      <section className="bg-brand-sage py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase text-brand-leaf">Reviews & Questions</span>
            <h2 className="mt-3 font-display text-4xl font-bold text-brand-charcoal">Guest Experiences</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-700">
              Approved reviews appear here after our team checks them. Please avoid sharing private medical details in a public review.
            </p>

            <div className="mt-8 space-y-5">
              {reviews.length ? (
                reviews.map((review) => (
                  <article key={review._id} className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-xl font-bold text-brand-maroon">{review.customerName}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(new Date(review.createdAt))}
                        </p>
                      </div>
                      <StarRating value={review.rating} size={16} />
                    </div>
                    <p className="mt-4 leading-8 text-slate-700">{review.message}</p>
                    {review.adminReply ? (
                      <div className="mt-5 rounded-lg bg-brand-mist p-4">
                        <p className="text-xs font-bold uppercase text-brand-leaf">Sethsuwa Reply</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{review.adminReply}</p>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="rounded-lg bg-white p-6 text-slate-600 shadow-soft">
                  No approved reviews yet. Be the first to share your experience.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={submitReview} className="luxury-border rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5 md:p-8">
            <h2 className="font-display text-3xl font-bold text-brand-maroon">Leave a Review</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your contact details are only visible to the Sethsuwa admin team.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-charcoal">Star Rating</span>
                <StarRating
                  value={reviewForm.rating}
                  interactive
                  onChange={(rating) => setReviewForm((current) => ({ ...current, rating }))}
                  size={24}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-charcoal">Name</span>
                <input
                  name="customerName"
                  value={reviewForm.customerName}
                  onChange={updateReviewField}
                  required
                  className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-charcoal">Phone or Email</span>
                <input
                  name="contact"
                  value={reviewForm.contact}
                  onChange={updateReviewField}
                  required
                  className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-charcoal">Review or Question</span>
                <textarea
                  name="message"
                  value={reviewForm.message}
                  onChange={updateReviewField}
                  required
                  rows="5"
                  className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/15"
                />
              </label>
            </div>

            {reviewMessage ? <p className="mt-5 rounded-md bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{reviewMessage}</p> : null}
            {reviewError ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{reviewError}</p> : null}

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-leaf px-6 py-3 font-bold text-white transition hover:bg-brand-red disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
