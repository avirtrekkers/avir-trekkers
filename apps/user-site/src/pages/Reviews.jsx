import { useState, useEffect } from "react";
import {
  getPublicReviews,
  getReviewStats,
  submitReview,
  getPublicTreks,
} from "../services/api";
import { formatDate, truncate } from "../lib/utils";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  Send,
  X,
  Loader2,
  CheckCircle,
  MapPin,
} from "lucide-react";

function StarRating({ rating, size = "h-4 w-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? "text-accent fill-accent" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function ClickableStars({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <Star
            className={`h-7 w-7 transition-colors cursor-pointer ${
              i < (hover || rating)
                ? "text-accent fill-accent"
                : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 skeleton rounded w-24 mb-3" />
      <div className="h-4 skeleton rounded w-full mb-2" />
      <div className="h-4 skeleton rounded w-3/4 mb-4" />
      <div className="h-3 skeleton rounded w-1/3" />
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    reviewText: "",
    trekId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [reviewsRes, statsRes, treksRes] = await Promise.all([
          getPublicReviews(),
          getReviewStats().catch(() => null),
          getPublicTreks().catch(() => null),
        ]);
        setReviews(
          reviewsRes.data?.reviews ||
            reviewsRes.data?.data ||
            reviewsRes.data ||
            []
        );
        if (statsRes) {
          setStats(statsRes.data?.stats || statsRes.data || null);
        }
        if (treksRes) {
          setTreks(
            treksRes.data?.treks || treksRes.data?.data || treksRes.data || []
          );
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) {
      setSubmitError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitReview({
        name: form.name,
        email: form.email,
        rating: form.rating,
        reviewText: form.reviewText,
        trekId: form.trekId || undefined,
      });
      setSubmitSuccess(true);
      setForm({ name: "", email: "", rating: 0, reviewText: "", trekId: "" });
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating =
    stats?.averageRating ||
    stats?.avgRating ||
    (reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0);
  const totalReviews = stats?.totalReviews || stats?.total || reviews.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold font-heading mb-4"
          >
            Trekker Reviews
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            What our community of adventurers has to say
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-text font-heading">
                {avgRating}
              </div>
              <div>
                <StarRating rating={Math.round(Number(avgRating))} size="h-5 w-5" />
                <p className="text-sm text-text-light mt-1">
                  Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-light text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </button>
          </motion.div>
        )}

        {/* Write a Review Button (when no stats) */}
        {!loading && reviews.length === 0 && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-light text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Write the First Review
            </button>
          </div>
        )}

        {/* Review Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-text">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-text-light hover:text-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-heading font-semibold text-text mb-2">
                    Thank you!
                  </h4>
                  <p className="text-text-light">
                    Your review has been submitted and will appear after
                    approval.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        handleFormChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1">
                      Rating *
                    </label>
                    <ClickableStars
                      rating={form.rating}
                      onChange={(r) => handleFormChange("rating", r)}
                    />
                  </div>
                  {treks.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-text mb-1">
                        Trek (optional)
                      </label>
                      <select
                        value={form.trekId}
                        onChange={(e) =>
                          handleFormChange("trekId", e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      >
                        <option value="">Select a trek</option>
                        {treks.map((trek) => (
                          <option key={trek._id} value={trek._id}>
                            {trek.title || trek.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.reviewText}
                      onChange={(e) =>
                        handleFormChange("reviewText", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  {submitError && (
                    <p className="text-red-600 text-sm">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-accent/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-text mb-2">
              No reviews yet
            </h3>
            <p className="text-text-light">
              Be the first to share your trekking experience with Avir Trekkers!
            </p>
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <StarRating rating={review.rating || 0} />
                <p className="text-text text-sm mt-3 mb-4 leading-relaxed">
                  "{review.reviewText || review.comment || review.text}"
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="font-semibold text-text text-sm">
                      {review.name || review.userName || "Anonymous"}
                    </p>
                    {(review.location || review.city) && (
                      <p className="text-xs text-text-light flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {review.location || review.city}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {(review.trekName || review.trek?.name) && (
                      <p className="text-xs text-primary font-semibold">
                        {review.trekName || review.trek?.name}
                      </p>
                    )}
                    {(review.createdAt || review.date) && (
                      <p className="text-xs text-text-light mt-0.5">
                        {formatDate(review.createdAt || review.date)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
