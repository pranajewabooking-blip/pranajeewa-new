import { MessageSquareReply, RefreshCw, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const statuses = ["Pending", "Approved", "Hidden"];

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1 text-brand-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} className={star <= rating ? "fill-current" : ""} />
      ))}
    </div>
  );
}

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export default function ReviewsManage() {
  const [reviews, setReviews] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [treatmentFilter, setTreatmentFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await http.get("/reviews/admin/all", {
        params: {
          ...(statusFilter === "All" ? {} : { status: statusFilter }),
          ...(treatmentFilter ? { treatmentId: treatmentFilter } : {})
        }
      });
      setReviews(response.data.reviews || []);
    } catch {
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTreatments = async () => {
      try {
        const response = await http.get("/treatments");
        setTreatments(response.data.treatments || []);
      } catch {
        setTreatments([]);
      }
    };

    loadTreatments();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [statusFilter, treatmentFilter]);

  const counts = useMemo(() => {
    return statuses.reduce(
      (acc, status) => ({
        ...acc,
        [status]: reviews.filter((review) => review.status === status).length
      }),
      {}
    );
  }, [reviews]);

  const updateStatus = async (review, status) => {
    try {
      const response = await http.patch(`/reviews/${review._id}/status`, { status });
      setReviews((current) =>
        current.map((item) => (item._id === review._id ? response.data.review : item))
      );
    } catch {
      setError("Unable to update review status.");
    }
  };

  const updateReply = (id, value) => {
    setReviews((current) =>
      current.map((review) => (review._id === id ? { ...review, adminReply: value } : review))
    );
  };

  const saveReply = async (review) => {
    try {
      const response = await http.patch(`/reviews/${review._id}/reply`, {
        adminReply: review.adminReply || ""
      });
      setReviews((current) =>
        current.map((item) => (item._id === review._id ? response.data.review : item))
      );
    } catch {
      setError("Unable to save reply.");
    }
  };

  const removeReview = async (review) => {
    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;

    try {
      await http.delete(`/reviews/${review._id}`);
      setReviews((current) => current.filter((item) => item._id !== review._id));
    } catch {
      setError("Unable to delete review.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-red">Review Management</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">Treatment Reviews</h1>
        </div>
        <button
          type="button"
          onClick={loadReviews}
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

        <select
          value={treatmentFilter}
          onChange={(event) => setTreatmentFilter(event.target.value)}
          className="rounded-md border border-brand-gold/35 bg-white px-4 py-2 text-sm font-bold text-brand-charcoal outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
        >
          <option value="">All Treatments</option>
          {treatments.map((treatment) => (
            <option key={treatment._id} value={treatment._id}>
              {treatment.name}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="mt-6 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
      {loading ? <p className="mt-6 font-bold text-brand-maroon">Loading reviews...</p> : null}

      <div className="mt-8 space-y-5">
        {reviews.map((review) => (
          <article key={review._id} className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
            <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-maroon">
                    {review.status}
                  </span>
                  <RatingStars rating={review.rating} />
                  <span className="text-xs font-bold text-slate-500">{formatDate(review.createdAt)}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold text-brand-maroon">{review.customerName}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{review.contact}</p>
                <p className="mt-2 text-sm font-bold text-brand-gold">{review.treatment?.name}</p>
                <p className="mt-4 leading-8 text-slate-700">{review.message}</p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-brand-charcoal">Status</span>
                  <select
                    value={review.status}
                    onChange={(event) => updateStatus(review, event.target.value)}
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                    <MessageSquareReply size={17} /> Admin Reply
                  </span>
                  <textarea
                    value={review.adminReply || ""}
                    onChange={(event) => updateReply(review._id, event.target.value)}
                    rows="4"
                    className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                  />
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <button
                    type="button"
                    onClick={() => saveReply(review)}
                    className="rounded-md bg-brand-charcoal px-4 py-3 font-bold text-white transition hover:bg-brand-maroon"
                  >
                    Save Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => removeReview(review)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-rose-100 text-rose-700 transition hover:bg-rose-200"
                    aria-label={`Delete review from ${review.customerName}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {!loading && !reviews.length ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-slate-600 shadow-soft">
            No reviews found.
          </p>
        ) : null}
      </div>
    </div>
  );
}
