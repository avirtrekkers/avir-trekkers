import { useState, useEffect } from "react";
import { getTrekStats, getEnrollmentStats, getAdminReviews, getCategories } from "../services/api";
import { formatDate, formatPrice } from "../lib/utils";
import { Mountain, Users, Star, FolderOpen, TrendingUp, AlertCircle, Activity, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-shimmer">
      <div className="h-4 w-24 bg-white/10 rounded mb-3" />
      <div className="h-8 w-16 bg-white/10 rounded" />
    </div>
  );
}

function AnimatedNumber({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return typeof value === "number" ? display : value;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-sm">
        <p className="text-white font-medium">{label}</p>
        <p className="text-blue-400">{payload[0].value} enrollments</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [trekRes, enrollRes, reviewRes, catRes] = await Promise.allSettled([
          getTrekStats(),
          getEnrollmentStats(),
          getAdminReviews(),
          getCategories(),
        ]);

        if (trekRes.status === "fulfilled") {
          setStats(trekRes.value.data?.data || trekRes.value.data || {});
        }
        if (enrollRes.status === "fulfilled") {
          setEnrollmentStats(enrollRes.value.data?.data || enrollRes.value.data || {});
        }
        if (reviewRes.status === "fulfilled") {
          const revData = reviewRes.value.data?.data || reviewRes.value.data?.reviews || reviewRes.value.data || [];
          setReviews(Array.isArray(revData) ? revData : []);
        }
        if (catRes.status === "fulfilled") {
          const catData = catRes.value.data?.data || catRes.value.data?.categories || catRes.value.data || [];
          setCategories(Array.isArray(catData) ? catData : []);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalTreks = stats?.totalTreks ?? stats?.total ?? "--";
  const totalEnrollments = enrollmentStats?.totalEnrollments ?? enrollmentStats?.total ?? "--";
  const pendingReviews = Array.isArray(reviews)
    ? reviews.filter((r) => !r.isApproved && r.status !== "approved").length
    : "--";
  const activeCategories = Array.isArray(categories)
    ? categories.filter((c) => c.isActive !== false).length
    : "--";

  const recentEnrollments = enrollmentStats?.recentEnrollments || enrollmentStats?.recent || [];
  const trekDistribution = enrollmentStats?.byTrek || enrollmentStats?.distribution || stats?.enrollmentsByTrek || [];

  const chartData = Array.isArray(trekDistribution)
    ? trekDistribution.slice(0, 8).map((item) => ({
        name: (item.trekName || item.name || "Trek").length > 15
          ? (item.trekName || item.name || "Trek").slice(0, 15) + "..."
          : item.trekName || item.name || "Trek",
        enrollments: item.count || item.enrollments || item.total || 0,
      }))
    : [];

  const statCards = [
    { label: "Total Treks", value: totalTreks, icon: Mountain, gradient: "from-blue-500 to-blue-600", glow: "glow-blue", iconBg: "bg-blue-500/20", ring: "ring-blue-500/20" },
    { label: "Total Enrollments", value: totalEnrollments, icon: Users, gradient: "from-emerald-500 to-emerald-600", glow: "glow-green", iconBg: "bg-emerald-500/20", ring: "ring-emerald-500/20" },
    { label: "Pending Reviews", value: pendingReviews, icon: Star, gradient: "from-amber-500 to-orange-500", glow: "glow-yellow", iconBg: "bg-amber-500/20", ring: "ring-amber-500/20" },
    { label: "Active Categories", value: activeCategories, icon: FolderOpen, gradient: "from-violet-500 to-purple-600", glow: "glow-purple", iconBg: "bg-violet-500/20", ring: "ring-violet-500/20" },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center max-w-md"
        >
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to load dashboard</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold font-heading bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 mt-1"
          >
            Welcome back! Here's your overview.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl px-4 py-2 flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white/70">Live</span>
        </motion.div>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  variants={item}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`glass-card rounded-2xl p-5 cursor-default group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.iconBg} p-3 rounded-xl ring-1 ${card.ring} transition-all group-hover:scale-110`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <p className="text-sm text-white/50 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">
                    <AnimatedNumber value={typeof card.value === 'number' ? card.value : parseInt(card.value) || card.value} />
                  </p>
                </motion.div>
              );
            })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Enrollments by Trek</h2>
          </div>
          {loading ? (
            <div className="h-64 bg-white/5 rounded-xl animate-shimmer" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrollments" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/40">
              <p>No enrollment data available yet</p>
            </div>
          )}
        </motion.div>

        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Recent Enrollments</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-lg animate-shimmer" />
              ))}
            </div>
          ) : recentEnrollments.length > 0 ? (
            <div className="space-y-2">
              {recentEnrollments.slice(0, 5).map((enrollment, idx) => (
                <motion.div
                  key={enrollment._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                      {(enrollment.participantName || enrollment.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{enrollment.participantName || enrollment.name || "N/A"}</p>
                      <p className="text-xs text-white/40">{enrollment.trekName || enrollment.trek?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        enrollment.paymentStatus === "paid" || enrollment.status === "confirmed"
                          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                          : enrollment.paymentStatus === "failed"
                            ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
                            : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
                      }`}
                    >
                      {enrollment.paymentStatus || enrollment.status || "Pending"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/40">
              <p>No recent enrollments</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
