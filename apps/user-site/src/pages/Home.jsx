import { useState, useEffect, useRef } from "react";
import { getFeaturedTreks, getPublicReviews } from "../services/api";
import { formatPrice, formatDate, truncate } from "../lib/utils";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Calendar,
  Mountain,
  Users,
  Star,
  ArrowRight,
  Heart,
  Bike,
  GraduationCap,
} from "lucide-react";

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard: "bg-orange-100 text-orange-700",
  Expert: "bg-rose-100 text-rose-700",
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function TrekCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/2" />
        <div className="h-4 skeleton rounded w-1/3" />
      </div>
    </div>
  );
}

export default function Home() {
  const [treks, setTreks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [treksRes, reviewsRes] = await Promise.all([
          getFeaturedTreks(),
          getPublicReviews(),
        ]);
        setTreks(
          treksRes.data?.treks || treksRes.data?.data || treksRes.data || []
        );
        setReviews(
          reviewsRes.data?.reviews ||
            reviewsRes.data?.data ||
            reviewsRes.data ||
            []
        );
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-primary-dark to-primary text-white py-28 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold font-heading mb-6"
          >
            Explore Maharashtra's{" "}
            <span className="inline-block">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent"
              >
                Majestic Forts
              </motion.span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Join Avir Trekkers for unforgettable adventures and meaningful
            social impact
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/treks"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-light text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-lg shadow-lg shadow-secondary/20"
              >
                <MapPin className="h-5 w-5" />
                Explore Treks
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors border border-white/20 text-lg"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              {
                icon: Users,
                label: "Happy Trekkers",
                value: 500,
                suffix: "+",
              },
              {
                icon: Mountain,
                label: "Treks Completed",
                value: 50,
                suffix: "+",
              },
              {
                icon: GraduationCap,
                label: "Schools Helped",
                value: 20,
                suffix: "+",
              },
              {
                icon: Bike,
                label: "Cycles Donated",
                value: 100,
                suffix: "+",
              },
            ].map(({ icon: Icon, label, value, suffix }) => (
              <motion.div
                key={label}
                variants={fadeInUp}
                className="p-4"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold font-heading text-text">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-sm text-text-light mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-xs mx-auto" />

      {/* Featured Treks Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold font-heading text-text mb-2">
              Featured Treks
            </h2>
            <p className="text-text-light">
              Discover our most popular upcoming adventures
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <TrekCardSkeleton key={i} />
              ))}
            </div>
          ) : treks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <Mountain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <p className="text-text-light text-lg">
                No featured treks available right now. Check back soon!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {treks.slice(0, 6).map((trek, index) => (
                <motion.div
                  key={trek._id || index}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    {trek.images?.[0] ? (
                      <img
                        src={trek.images[0]}
                        alt={trek.title || trek.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="font-heading font-semibold text-text text-lg mb-2 group-hover:text-primary transition-colors">
                      {trek.title || trek.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-text-light mb-3">
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
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {trek.price ? formatPrice(trek.price) : "Free"}
                      </span>
                      <Link
                        to={`/treks/${trek._id}`}
                        className="inline-flex items-center gap-1 text-secondary hover:text-secondary-light font-semibold text-sm transition-colors group/link"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {treks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-10"
            >
              <Link
                to="/treks"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors group"
              >
                View All Treks
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Social Impact Highlight */}
      <section className="py-16 px-4 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
            >
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Our Social Impact
            </h2>
            <p className="text-text-light max-w-2xl mx-auto mb-4">
              Beyond trekking, we are committed to uplifting rural communities
              across Maharashtra. We support schools with essential supplies,
              donate cycles to students who walk long distances, and organize
              community welfare drives.
            </p>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              Every trek you join contributes to these meaningful causes. When
              you trek with us, you are part of something bigger.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/our-work"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/20"
              >
                <Heart className="h-5 w-5" />
                See Our Work
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold font-heading text-text mb-2">
              What Trekkers Say
            </h2>
            <p className="text-text-light">
              Hear from our community of adventurers
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <div className="h-4 skeleton rounded w-24 mb-3" />
                  <div className="h-4 skeleton rounded w-full mb-2" />
                  <div className="h-4 skeleton rounded w-3/4 mb-4" />
                  <div className="h-3 skeleton rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-accent/30 mx-auto mb-4" />
              <p className="text-text-light text-lg">
                No reviews yet. Be the first to share your experience!
              </p>
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary-light font-semibold transition-colors"
              >
                Write a Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {reviews.slice(0, 6).map((review, index) => (
                <motion.div
                  key={review._id || index}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (review.rating || 0) ? "text-accent fill-accent" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-text text-sm mb-4 leading-relaxed">
                    "{truncate(review.reviewText || review.comment || review.text, 150)}"
                  </p>
                  <div>
                    <p className="font-semibold text-text text-sm">
                      {review.name || review.userName || "Anonymous"}
                    </p>
                    {(review.trekName || review.trek?.name) && (
                      <p className="text-xs text-text-light">
                        {review.trekName || review.trek?.name}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-10"
            >
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors group"
              >
                See All Reviews
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
