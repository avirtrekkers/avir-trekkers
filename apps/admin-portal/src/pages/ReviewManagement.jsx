import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAdminReviews, updateReviewStatus, deleteReview } from "../services/api";
import { formatDate } from "../lib/utils";
import { Star, Check, Trash2, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 12;

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "all", label: "All" },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse animate-shimmer">
      <div className="h-4 w-32 bg-white/10 rounded mb-3" />
      <div className="h-3 w-full bg-white/10 rounded mb-2" />
      <div className="h-3 w-3/4 bg-white/10 rounded mb-4" />
      <div className="h-8 w-24 bg-white/10 rounded" />
    </div>
  );
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminReviews();
      const data = res.data?.data || res.data?.reviews || res.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);
  useEffect(() => { setPage(1); }, [activeTab]);

  const handleApprove = async (review) => {
    const id = review._id || review.id;
    try {
      setActionLoading(id);
      await updateReviewStatus(id, { isApproved: true, status: "approved" });
      await fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (review) => {
    const id = review._id || review.id;
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    try {
      setActionLoading(id);
      await deleteReview(id);
      await fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return !r.isApproved && r.status !== "approved";
    if (activeTab === "approved") return r.isApproved || r.status === "approved";
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved && r.status !== "approved").length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Failed to load reviews</h2>
        <p className="text-text-light mb-4">{error}</p>
        <button onClick={fetchReviews} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold font-heading text-text mb-6">Review Management</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/[0.06] rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white/10 text-white shadow-sm"
                : "text-text-light hover:text-text"
            }`}
          >
            {tab.label}
            {tab.key === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500/15 text-amber-400 rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <MessageSquare className="w-10 h-10 text-text-light/50 mx-auto mb-3" />
          <p className="text-text-light">
            {activeTab === "pending" ? "No pending reviews" : activeTab === "approved" ? "No approved reviews" : "No reviews found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((review) => {
            const id = review._id || review.id;
            const isApproved = review.isApproved || review.status === "approved";

            return (
              <div key={id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-text">{review.reviewerName || review.name || review.userName || "Anonymous"}</h3>
                    <p className="text-xs text-text-light">{review.email || review.reviewerEmail || ""}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isApproved ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                  }`}>
                    {isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                <StarRating rating={review.rating || 0} />

                <p className="text-sm text-text mt-3 mb-2 line-clamp-3">{review.comment || review.review || review.text || "No comment"}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-text-light">
                    <span className="font-medium">{review.trekName || review.trek?.name || "Unknown trek"}</span>
                    {review.createdAt && <span className="ml-2">{formatDate(review.createdAt)}</span>}
                  </div>
                  <div className="flex gap-1">
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(review)}
                        disabled={actionLoading === id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading === id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review)}
                      disabled={actionLoading === id}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        label="reviews"
      />
    </motion.div>
  );
}
