import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrekById } from "../services/api";
import { formatPrice, formatDate } from "../lib/utils";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Mountain,
  ArrowLeft,
  Clock,
  Users,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  IndianRupee,
} from "lucide-react";

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard: "bg-orange-100 text-orange-700",
  Expert: "bg-rose-100 text-rose-700",
};

export default function TrekDetail() {
  const { id } = useParams();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  async function fetchTrek() {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrekById(id);
      setTrek(res.data?.trek || res.data?.data || res.data || null);
    } catch (err) {
      console.error("Failed to fetch trek:", err);
      setError("Failed to load trek details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrek();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 skeleton rounded w-48" />
            <div className="h-96 skeleton rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-4 skeleton rounded w-2/3" />
              </div>
              <div className="h-64 skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Mountain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchTrek}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            <Link
              to="/treks"
              className="inline-flex items-center gap-2 border border-border text-text px-6 py-2.5 rounded-xl font-semibold transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Treks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Mountain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-text mb-2">
            Trek Not Found
          </h2>
          <p className="text-text-light mb-4">
            This trek may have been removed or doesn't exist.
          </p>
          <Link
            to="/treks"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Treks
          </Link>
        </div>
      </div>
    );
  }

  const images = trek.images || [];
  const coverImage = images[selectedImage] || images[0];
  const title = trek.title || trek.name || "Untitled Trek";
  const itinerary = trek.itinerary || [];
  const inclusions = trek.inclusions || trek.includes || [];
  const exclusions = trek.exclusions || trek.excludes || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          to="/treks"
          className="inline-flex items-center gap-2 text-text-light hover:text-text transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Treks
        </Link>
      </div>

      {/* Cover Image */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl overflow-hidden h-72 md:h-96 relative"
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-dark/30 flex items-center justify-center">
              <Mountain className="h-20 w-20 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-2xl md:text-4xl font-bold font-heading mb-2">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {trek.difficulty && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[trek.difficulty] || "bg-slate-100 text-slate-700"}`}
                >
                  {trek.difficulty}
                </span>
              )}
              {trek.location && (
                <span className="inline-flex items-center gap-1 text-sm text-white/90">
                  <MapPin className="h-4 w-4" />
                  {trek.location}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-colors ${
                  i === selectedImage
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Bar */}
            <div className="flex flex-wrap gap-6 py-4 border-b border-border">
              {(trek.date || trek.startDate) && (
                <div className="flex items-center gap-2 text-text">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-light">Date</p>
                    <p className="font-semibold text-sm">
                      {formatDate(trek.date || trek.startDate)}
                      {trek.endDate &&
                        ` - ${formatDate(trek.endDate)}`}
                    </p>
                  </div>
                </div>
              )}
              {trek.duration && (
                <div className="flex items-center gap-2 text-text">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-light">Duration</p>
                    <p className="font-semibold text-sm">{trek.duration}</p>
                  </div>
                </div>
              )}
              {(trek.maxParticipants || trek.slots) && (
                <div className="flex items-center gap-2 text-text">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-text-light">Slots</p>
                    <p className="font-semibold text-sm">
                      {trek.maxParticipants || trek.slots}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-heading font-bold text-text mb-4">
                About This Trek
              </h2>
              {trek.description ? (
                trek.description.includes("<") ? (
                  <div
                    className="prose prose-sm max-w-none text-text-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: trek.description }}
                  />
                ) : (
                  <p className="text-text-light leading-relaxed whitespace-pre-line">
                    {trek.description}
                  </p>
                )
              ) : (
                <p className="text-text-light">
                  No description available for this trek.
                </p>
              )}
            </div>

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h2 className="text-xl font-heading font-bold text-text mb-4">
                  Itinerary
                </h2>
                <div className="space-y-4">
                  {itinerary.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {item.day || index + 1}
                        </div>
                        {index < itinerary.length - 1 && (
                          <div className="w-0.5 flex-1 bg-primary/20 mt-1" />
                        )}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-heading font-semibold text-text mb-1">
                          {item.title || `Day ${item.day || index + 1}`}
                        </h3>
                        <div className="text-text-light text-sm leading-relaxed">
                          {item.description && <p>{item.description}</p>}
                          {Array.isArray(item.activities) && item.activities.map((act, i) => (
                            <p key={i} className="mt-1">
                              {act.time && <span className="font-medium text-primary">{act.time} — </span>}
                              {act.title || act.description || String(act)}
                            </p>
                          ))}
                          {typeof item.activities === 'string' && <p>{item.activities}</p>}
                          {item.details && typeof item.details === 'string' && <p>{item.details}</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-heading font-bold text-text mb-4">
                      What's Included
                    </h2>
                    <ul className="space-y-2">
                      {inclusions.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-text-light text-sm"
                        >
                          <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{typeof item === "string" ? item : item.text || item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-heading font-bold text-text mb-4">
                      What's Not Included
                    </h2>
                    <ul className="space-y-2">
                      {exclusions.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-text-light text-sm"
                        >
                          <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{typeof item === "string" ? item : item.text || item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6 shadow-md">
              <div className="text-center mb-6">
                <p className="text-sm text-text-light mb-1">Price per person</p>
                <p className="text-3xl font-bold text-primary font-heading">
                  {trek.price ? formatPrice(trek.price) : "Free"}
                </p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                {(trek.date || trek.startDate) && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-text-light flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </span>
                    <span className="font-semibold text-text">
                      {formatDate(trek.date || trek.startDate)}
                    </span>
                  </div>
                )}
                {trek.difficulty && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-text-light flex items-center gap-2">
                      <Mountain className="h-4 w-4" />
                      Difficulty
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[trek.difficulty] || "bg-slate-100 text-slate-700"}`}
                    >
                      {trek.difficulty}
                    </span>
                  </div>
                )}
                {trek.location && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-text-light flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </span>
                    <span className="font-semibold text-text">
                      {trek.location}
                    </span>
                  </div>
                )}
                {trek.duration && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-text-light flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span className="font-semibold text-text">
                      {trek.duration}
                    </span>
                  </div>
                )}
              </div>

              <Link
                to={`/book/${trek._id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-light text-white py-3 rounded-xl font-semibold transition-colors text-lg"
              >
                <IndianRupee className="h-5 w-5" />
                Enroll Now
              </Link>

              <p className="text-xs text-text-light text-center mt-3">
                Secure your spot today. Limited slots available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
