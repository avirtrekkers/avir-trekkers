import { useState, useEffect } from "react";
import { getPublicTreks, getCategories } from "../services/api";
import { formatPrice, formatDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Mountain,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";

const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Hard", "Expert"];
const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard: "bg-orange-100 text-orange-700",
  Expert: "bg-rose-100 text-rose-700",
};

function TrekCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/2" />
        <div className="h-4 skeleton rounded w-1/3" />
        <div className="flex justify-between">
          <div className="h-5 skeleton rounded w-20" />
          <div className="h-5 skeleton rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default function Treks() {
  const [treks, setTreks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  async function fetchTreks() {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (category) params.category = category;

      const res = await getPublicTreks(params);
      setTreks(res.data?.treks || res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch treks:", err);
      setError("Failed to load treks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await getCategories();
      setCategories(
        res.data?.categories || res.data?.data || res.data || []
      );
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTreks();
  }, [difficulty, category]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchTreks();
  }

  function clearFilters() {
    setSearch("");
    setDifficulty("");
    setCategory("");
  }

  const hasFilters = search || difficulty || category;

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
            Explore Our Treks
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Find your next adventure across Maharashtra's stunning forts, hills,
            and nature trails
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
              <input
                type="text"
                placeholder="Search treks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.name} value={cat._id || cat.name}>
                  {cat.name || cat.title || cat}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2.5 text-text-light hover:text-text rounded-xl border border-border transition-colors inline-flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTreks}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TrekCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && treks.length === 0 && (
          <div className="text-center py-16">
            <Mountain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-text mb-2">
              No treks found
            </h3>
            <p className="text-text-light mb-4">
              Try adjusting your filters or search terms
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Trek Grid */}
        {!loading && !error && treks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((trek, index) => (
              <motion.div
                key={trek._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 overflow-hidden relative">
                  {trek.images?.[0] ? (
                    <img
                      src={trek.images[0]}
                      alt={trek.title || trek.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center">
                      <Mountain className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  {trek.difficulty && (
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[trek.difficulty] || "bg-slate-100 text-slate-700"}`}
                    >
                      {trek.difficulty}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-text text-lg mb-2 line-clamp-1">
                    {trek.title || trek.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-text-light mb-3">
                    {(trek.date || trek.startDate) && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(trek.date || trek.startDate)}
                      </span>
                    )}
                    {trek.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {trek.location}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-lg font-bold text-primary">
                      {trek.price ? formatPrice(trek.price) : "Free"}
                    </span>
                    <Link
                      to={`/treks/${trek._id}`}
                      className="inline-flex items-center gap-1 text-secondary hover:text-secondary-light font-semibold text-sm transition-colors"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
