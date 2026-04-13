import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTreks, deleteTrek, toggleTrekStatus } from "../services/api";
import { formatPrice, formatDate } from "../lib/utils";
import {
  Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight,
  Mountain, AlertCircle, Loader2, Eye, AlertTriangle, X,
} from "lucide-react";
import TrekFormDrawer from "../components/treks/TrekFormDrawer";
import TrekViewDrawer from "../components/treks/TrekViewDrawer";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 10;

const DIFFICULTY_COLORS = {
  easy:     "bg-emerald-500/15 text-emerald-400",
  moderate: "bg-amber-500/15 text-amber-400",
  hard:     "bg-orange-500/15 text-orange-400",
  difficult:"bg-red-500/15 text-red-400",
  expert:   "bg-red-500/15 text-red-400",
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/10 rounded w-20" />
        </td>
      ))}
    </tr>
  );
}

function DeleteConfirmModal({ trek, onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {trek && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>

              {/* Text */}
              <h3 className="text-base font-semibold text-white text-center mb-1">
                Delete Trek
              </h3>
              <p className="text-sm text-text-light text-center mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-sm font-medium text-white text-center mb-4 px-2 truncate">
                "{trek.title || trek.name}"
              </p>
              <p className="text-xs text-red-400/80 text-center mb-6">
                This action cannot be undone. All trek data will be permanently removed.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-text-light text-sm font-medium hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function TrekManagement() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Form drawer (create / edit)
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTrekId, setEditTrekId] = useState(null);

  // View drawer
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [viewTrekId, setViewTrekId] = useState(null);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openCreate = () => { setEditTrekId(null); setDrawerOpen(true); };
  const openEdit   = (id) => { setEditTrekId(id); setDrawerOpen(true); };
  const closeDrawer = () => setDrawerOpen(false);

  const openView  = (id) => { setViewTrekId(id); setViewDrawerOpen(true); };
  const closeView = () => setViewDrawerOpen(false);

  const fetchTreks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllTreks();
      const data = res.data?.data || res.data?.treks || res.data || [];
      setTreks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load treks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTreks(); }, []);
  useEffect(() => { setPage(1); }, [search]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteTrek(id);
      setDeleteTarget(null);
      await fetchTreks();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete trek. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (trek) => {
    const id = trek._id || trek.id;
    try {
      setActionLoading(id);
      await toggleTrekStatus(id);
      await fetchTreks();
    } catch (err) {
      console.error("Failed to toggle trek status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = treks.filter((t) =>
    (t.title || t.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Failed to load treks</h2>
        <p className="text-text-light mb-4">{error}</p>
        <button
          onClick={fetchTreks}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-text">Trek Management</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Trek
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder="Search treks by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-text-light border-b border-border">
                <th className="px-4 py-3 font-medium">Trek Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Max Participants</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Mountain className="w-10 h-10 text-text-light/50 mx-auto mb-3" />
                    <p className="text-text-light">
                      {search ? "No treks match your search" : "No treks found. Create your first trek!"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((trek) => {
                  const id = trek._id || trek.id;
                  const isActive = trek.isActive !== false;
                  const difficulty = (trek.difficulty || "moderate").toLowerCase();
                  const isProcessing = actionLoading === id;

                  return (
                    <tr key={id} className="border-b border-border/50 hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-3 font-medium text-text">{trek.title || trek.name}</td>
                      <td className="px-4 py-3 text-text-light">
                        {trek.category?.name || trek.categoryName || trek.category || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-text-light">
                        {trek.startDate ? formatDate(trek.startDate) : trek.date ? formatDate(trek.date) : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DIFFICULTY_COLORS[difficulty] || "bg-white/10 text-white/50"}`}>
                          {difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text">
                        {trek.price != null ? formatPrice(trek.price) : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/50"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-light">{trek.maxParticipants ?? "N/A"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => openView(id)}
                            title="View details"
                            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-light hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Toggle active */}
                          <button
                            onClick={() => handleToggleStatus(trek)}
                            disabled={isProcessing}
                            title={isActive ? "Deactivate" : "Activate"}
                            className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin text-text-light" />
                            ) : isActive ? (
                              <ToggleRight className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-white/30" />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEdit(id)}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => { setDeleteError(null); setDeleteTarget(trek); }}
                            disabled={isProcessing}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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
        label="treks"
      />

      {/* Delete error toast */}
      <AnimatePresence>
        {deleteError && !deleteTarget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm shadow-xl"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {deleteError}
            <button onClick={() => setDeleteError(null)} className="ml-2 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        trek={deleteTarget}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
      />

      {/* Edit / Create drawer */}
      <TrekFormDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        trekId={editTrekId}
        onSuccess={fetchTreks}
      />

      {/* View drawer */}
      <TrekViewDrawer
        open={viewDrawerOpen}
        onClose={closeView}
        trekId={viewTrekId}
        onEdit={openEdit}
      />
    </motion.div>
  );
}
