import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { getAllEnrollments, getAllTreks, updateEnrollment, cancelEnrollment } from "../services/api";
import { formatPrice, formatDate, formatDateTime } from "../lib/utils";
import {
  Search, Download, Users, ChevronDown, ChevronUp, AlertCircle, X,
  Loader2, Edit2, Ban, CheckCircle2,
} from "lucide-react";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 10;

const PAYMENT_STATUS_STYLES = {
  paid:      "bg-emerald-500/15 text-emerald-400",
  confirmed: "bg-emerald-500/15 text-emerald-400",
  pending:   "bg-amber-500/15 text-amber-400",
  failed:    "bg-red-500/15 text-red-400",
  cancelled: "bg-white/10 text-white/50",
  refunded:  "bg-blue-500/15 text-blue-400",
};

const ENROLLMENT_STATUS_STYLES = {
  confirmed: "bg-emerald-500/15 text-emerald-400",
  pending:   "bg-amber-500/15 text-amber-400",
  cancelled: "bg-red-500/15 text-red-400",
  completed: "bg-blue-500/15 text-blue-400",
};

const getName  = (e) => e.enrollmentData?.fullName  || e.primaryContact?.fullName  || e.participantName || e.name  || "";
const getEmail = (e) => e.enrollmentData?.email     || e.primaryContact?.email     || e.email           || "";
const getMobile= (e) => e.enrollmentData?.mobile    || e.primaryContact?.mobile    || e.phone           || "";
const getTrekName=(e)=> e.trek?.title || e.trek?.name || e.trekName || "";

// ── Edit Status Modal ──────────────────────────────────────────────────────────
function EditStatusModal({ enrollment, onClose, onSave, saving }) {
  const [enrollmentStatus, setEnrollmentStatus] = useState(enrollment?.enrollmentStatus || "Pending");
  const [paymentStatus, setPaymentStatus]       = useState(enrollment?.paymentStatus    || "Pending");
  const [paymentAmount, setPaymentAmount]        = useState(enrollment?.paymentAmount    ?? "");
  const [paymentMethod, setPaymentMethod]        = useState(enrollment?.paymentMethod   || "");
  const [transactionId, setTransactionId]        = useState(enrollment?.transactionId   || "");

  if (!enrollment) return null;

  const isPaid = paymentStatus === "Paid";
  const selectCls = "w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40";
  const inputCls  = "w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40";
  const labelCls  = "block text-xs font-medium text-white/50 mb-1.5";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Update Enrollment</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.06] text-white/50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-white/60 mb-4 truncate">
            {getName(enrollment) || "Participant"}
          </p>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Enrollment Status</label>
              <select value={enrollmentStatus} onChange={(e) => setEnrollmentStatus(e.target.value)} className={selectCls}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={selectCls}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="e.g. 1799"
                className={inputCls}
              />
            </div>

            {/* Payment method + transaction — shown only when status is Paid */}
            {isPaid && (
              <>
                <div>
                  <label className={labelCls}>Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={selectCls}>
                    <option value="">-- Select --</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>
                    Transaction ID {paymentMethod === "Cash" ? "(optional)" : "*"}
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. TXN123456789"
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({
                enrollmentStatus,
                paymentStatus,
                ...(paymentAmount !== "" && { paymentAmount: Number(paymentAmount) }),
                ...(isPaid && paymentMethod && { paymentMethod }),
                ...(isPaid && transactionId  && { transactionId }),
              })}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Cancel Confirm Modal ───────────────────────────────────────────────────────
function CancelConfirmModal({ enrollment, onClose, onConfirm, loading }) {
  if (!enrollment) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl p-6 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <Ban className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Cancel Enrollment</h3>
          <p className="text-sm text-white/50 mb-1">Cancel enrollment for</p>
          <p className="text-sm font-medium text-white mb-4 truncate px-2">{getName(enrollment) || "this participant"}?</p>
          <p className="text-xs text-red-400/80 mb-6">This will mark the enrollment as Cancelled.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              Keep
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              {loading ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-4 bg-white/10 rounded w-20" /></td>
      ))}
    </tr>
  );
}

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments]     = useState([]);
  const [treks, setTreks]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [search, setSearch]               = useState("");
  const [trekFilter, setTrekFilter]       = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [expandedId, setExpandedId]       = useState(null);
  const [page, setPage]                   = useState(1);
  const [exporting, setExporting]         = useState(false);

  // Action states
  const [actionLoading, setActionLoading] = useState(null); // id of row being acted on
  const [editTarget, setEditTarget]       = useState(null); // enrollment for edit modal
  const [cancelTarget, setCancelTarget]   = useState(null); // enrollment for cancel modal
  const [toast, setToast]                 = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [enrollRes, trekRes] = await Promise.allSettled([getAllEnrollments(), getAllTreks()]);

      if (enrollRes.status === "fulfilled") {
        const data = enrollRes.value.data?.data || enrollRes.value.data?.enrollments || enrollRes.value.data || [];
        setEnrollments(Array.isArray(data) ? data : []);
      } else {
        throw new Error(enrollRes.reason?.response?.data?.message || "Failed to load enrollments");
      }

      if (trekRes.status === "fulfilled") {
        const data = trekRes.value.data?.data || trekRes.value.data?.treks || trekRes.value.data || [];
        setTreks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { setPage(1); }, [search, trekFilter, statusFilter]);

  // Open edit modal pre-focused on payment (rupee button click)
  const handleQuickPay = (enrollment) => {
    setEditTarget(enrollment);
  };

  // Full edit modal save
  const handleEditSave = async (updates) => {
    const id = editTarget._id || editTarget.id;
    setActionLoading(id + "_edit");
    try {
      await updateEnrollment(id, updates);
      setEditTarget(null);
      await fetchData();
      showToast("success", "Enrollment updated");
    } catch {
      showToast("error", "Failed to update enrollment");
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel enrollment
  const handleCancelConfirm = async () => {
    const id = cancelTarget._id || cancelTarget.id;
    setActionLoading(id + "_cancel");
    try {
      await cancelEnrollment(id);
      setCancelTarget(null);
      await fetchData();
      showToast("success", "Enrollment cancelled");
    } catch (err) {
      // Fallback: use updateEnrollment if cancel endpoint fails
      try {
        await updateEnrollment(id, { enrollmentStatus: "Cancelled" });
        setCancelTarget(null);
        await fetchData();
        showToast("success", "Enrollment cancelled");
      } catch {
        showToast("error", "Failed to cancel enrollment");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = enrollments.filter((e) => {
    const name = getName(e).toLowerCase();
    const email = getEmail(e).toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const trekId = e.trek?._id || e.trek?.id || e.trekId || "";
    const matchTrek = !trekFilter || trekId === trekFilter;
    const payStatus = (e.paymentStatus || "").toLowerCase();
    const enrStatus = (e.enrollmentStatus || "").toLowerCase();
    const matchStatus = !statusFilter || payStatus === statusFilter || enrStatus === statusFilter;
    return matchSearch && matchTrek && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    setExporting(true);
    try {
      const rows = filtered.map((e) => ({
        "Booking ID":          e.bookingId || (e._id || e.id || "").toString().slice(-8).toUpperCase(),
        "Participant Name":    getName(e)   || "—",
        "Email":               getEmail(e)  || "—",
        "Mobile":              getMobile(e) || "—",
        "Trek":                getTrekName(e)|| "—",
        "Age":                 e.enrollmentData?.age            || "—",
        "Gender":              e.enrollmentData?.gender         || "—",
        "Blood Group":         e.enrollmentData?.bloodGroup     || "—",
        "Pickup Point":        e.enrollmentData?.pickupPoint    || "—",
        "Food Preference":     e.enrollmentData?.foodPreference || "—",
        "Medical Condition":   e.enrollmentData?.medicalCondition || "—",
        "Emergency Contact":   e.enrollmentData?.emergencyName  || "—",
        "Emergency Phone":     e.enrollmentData?.emerContactNumber || "—",
        "Emergency Relation":  e.enrollmentData?.emergencyRelation || "—",
        "Payment Status":      e.paymentStatus    || "—",
        "Payment Method":      e.paymentMethod    || "—",
        "Transaction ID":      e.transactionId    || "—",
        "Enrollment Status":   e.enrollmentStatus || "—",
        "Amount":              e.paymentAmount != null ? e.paymentAmount : "—",
        "Enrolled On":         e.enrolledAt || e.createdAt ? formatDateTime(e.enrolledAt || e.createdAt) : "—",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Enrollments");

      const colWidths = Object.keys(rows[0] || {}).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2,
      }));
      ws["!cols"] = colWidths;

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `enrollments-${date}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Failed to load enrollments</h2>
        <p className="text-text-light mb-4">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-text">Enrollment Management</h1>
        <button
          onClick={handleExport}
          disabled={exporting || filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <select
          value={trekFilter}
          onChange={(e) => setTrekFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">All Treks</option>
          {treks.map((t) => (
            <option key={t._id || t.id} value={t._id || t.id}>{t.title || t.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
        {(search || trekFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setTrekFilter(""); setStatusFilter(""); }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-text-light hover:text-text hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-text-light border-b border-border">
                <th className="px-4 py-3 font-medium w-8" />
                <th className="px-4 py-3 font-medium">Booking ID</th>
                <th className="px-4 py-3 font-medium">Participant</th>
                <th className="px-4 py-3 font-medium">Trek</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-text-light/50 mx-auto mb-3" />
                    <p className="text-text-light">
                      {search || trekFilter || statusFilter ? "No enrollments match your filters" : "No enrollments found"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((enrollment) => {
                  const id = enrollment._id || enrollment.id;
                  const isExpanded = expandedId === id;
                  const paymentStatus    = (enrollment.paymentStatus    || "pending").toLowerCase();
                  const enrollmentStatus = (enrollment.enrollmentStatus || "pending").toLowerCase();
                  const isPaid       = paymentStatus === "paid";
                  const isCancelled  = enrollmentStatus === "cancelled";
                  const isEditLoading= actionLoading === id + "_edit";
                  const isCancelLoad = actionLoading === id + "_cancel";

                  return (
                    <Fragment key={id}>
                      <tr className="border-b border-border/50 hover:bg-white/[0.04] transition-colors">
                        <td className="px-4 py-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : id)}>
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-text-light" />
                            : <ChevronDown className="w-4 h-4 text-text-light" />}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-text-light">
                          {enrollment.bookingId || (id || "").toString().slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-text">{getName(enrollment) || "—"}</p>
                          <p className="text-xs text-text-light">{getMobile(enrollment) || getEmail(enrollment) || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-text-light">{getTrekName(enrollment) || "—"}</td>
                        <td className="px-4 py-3 text-text-light">
                          {enrollment.enrolledAt || enrollment.createdAt
                            ? formatDate(enrollment.enrolledAt || enrollment.createdAt)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-text">
                          {enrollment.paymentAmount != null ? formatPrice(enrollment.paymentAmount) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PAYMENT_STATUS_STYLES[paymentStatus] || "bg-white/10 text-white/50"}`}>
                            {paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ENROLLMENT_STATUS_STYLES[enrollmentStatus] || "bg-white/10 text-white/50"}`}>
                            {enrollmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* Edit status */}
                            <button
                              onClick={() => setEditTarget(enrollment)}
                              disabled={isEditLoading || isCancelLoad}
                              title="Edit status"
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors disabled:opacity-40"
                            >
                              {isEditLoading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Edit2 className="w-4 h-4" />}
                            </button>

                            {/* Cancel */}
                            {!isCancelled && (
                              <button
                                onClick={() => setCancelTarget(enrollment)}
                                disabled={isCancelLoad || isEditLoading}
                                title="Cancel enrollment"
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-40"
                              >
                                {isCancelLoad
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Ban className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="bg-white/[0.02]">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-text-light text-xs mb-1">Email</p>
                                <p className="text-text">{getEmail(enrollment) || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Age</p>
                                <p className="text-text">{enrollment.enrollmentData?.age || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Gender</p>
                                <p className="text-text">{enrollment.enrollmentData?.gender || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Blood Group</p>
                                <p className="text-text">{enrollment.enrollmentData?.bloodGroup || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Pickup Point</p>
                                <p className="text-text">{enrollment.enrollmentData?.pickupPoint || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Food Preference</p>
                                <p className="text-text">{enrollment.enrollmentData?.foodPreference || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Medical Condition</p>
                                <p className="text-text">{enrollment.enrollmentData?.medicalCondition || "None"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Emergency Contact</p>
                                <p className="text-text">
                                  {enrollment.enrollmentData?.emergencyName
                                    ? `${enrollment.enrollmentData.emergencyName} (${enrollment.enrollmentData.emergencyRelation || ""}) · ${enrollment.enrollmentData.emerContactNumber || ""}`
                                    : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Address</p>
                                <p className="text-text">{enrollment.enrollmentData?.address || "—"}</p>
                              </div>
                              <div>
                                <p className="text-text-light text-xs mb-1">Enrolled On</p>
                                <p className="text-text">
                                  {enrollment.enrolledAt || enrollment.createdAt
                                    ? formatDateTime(enrollment.enrolledAt || enrollment.createdAt)
                                    : "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        label="enrollments"
      />

      {/* Edit Status Modal */}
      {editTarget && (
        <EditStatusModal
          enrollment={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
          saving={actionLoading === (editTarget._id || editTarget.id) + "_edit"}
        />
      )}

      {/* Cancel Confirm Modal */}
      {cancelTarget && (
        <CancelConfirmModal
          enrollment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
          loading={actionLoading === (cancelTarget._id || cancelTarget.id) + "_cancel"}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/20 border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
