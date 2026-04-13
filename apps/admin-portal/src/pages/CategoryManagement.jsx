import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCategories, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from "../services/api";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, FolderOpen, Save, X, AlertCircle, Loader2 } from "lucide-react";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 15;

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);

  // Inline add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Inline edit
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories();
      const data = res.data?.data || res.data?.categories || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setAddLoading(true);
      await createCategory({ name: newName.trim(), description: newDescription.trim() });
      setNewName("");
      setNewDescription("");
      setShowAddForm(false);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (cat) => {
    const id = cat._id || cat.id;
    setEditId(id);
    setEditName(cat.name || "");
    setEditDescription(cat.description || "");
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    try {
      setActionLoading(editId);
      await updateCategory(editId, { name: editName.trim(), description: editDescription.trim() });
      setEditId(null);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (cat) => {
    const id = cat._id || cat.id;
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    try {
      setActionLoading(id);
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (cat) => {
    const id = cat._id || cat.id;
    try {
      setActionLoading(id);
      await toggleCategoryStatus(id);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle category status");
    } finally {
      setActionLoading(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Failed to load categories</h2>
        <p className="text-text-light mb-4">{error}</p>
        <button onClick={fetchCategories} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-text">Category Management</h1>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditId(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="glass rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-text mb-3">New Category</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addLoading}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 rounded-lg border border-white/10 text-text-light hover:bg-white/[0.06] text-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded animate-pulse animate-shimmer" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-10 h-10 text-text-light/50 mx-auto mb-3" />
            <p className="text-text-light">No categories yet. Add your first category!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((cat) => {
              const id = cat._id || cat.id;
              const isActive = cat.isActive !== false;
              const isEditing = editId === id;

              return (
                <div key={id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                  {isEditing ? (
                    <>
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={handleSaveEdit}
                          disabled={actionLoading === id}
                          className="p-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                        >
                          {actionLoading === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-1.5 rounded-lg border border-white/10 text-text-light hover:bg-white/[0.06] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text">{cat.name}</h3>
                        {cat.description && (
                          <p className="text-sm text-text-light mt-0.5 truncate">{cat.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/50"}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          disabled={actionLoading === id}
                          title={isActive ? "Deactivate" : "Activate"}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-light transition-colors disabled:opacity-50"
                        >
                          {actionLoading === id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isActive ? (
                            <ToggleRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={actionLoading === id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(categories.length / PAGE_SIZE))}
        onPageChange={setPage}
        totalItems={categories.length}
        pageSize={PAGE_SIZE}
        label="categories"
      />
    </motion.div>
  );
}
