import { useState, useEffect, useRef } from "react";
import { getSocialActivities } from "../services/api";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  GraduationCap,
  Bike,
  Users,
  HandHeart,
  ArrowRight,
  Camera,
} from "lucide-react";

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

const IMPACT_STATS = [
  {
    icon: GraduationCap,
    label: "Schools Supported",
    value: 20,
    suffix: "+",
  },
  { icon: Bike, label: "Cycles Donated", value: 100, suffix: "+" },
  { icon: Users, label: "Lives Impacted", value: 500, suffix: "+" },
  { icon: HandHeart, label: "Drives Organized", value: 30, suffix: "+" },
];

const INITIATIVES = [
  {
    icon: GraduationCap,
    title: "School Support Program",
    description:
      "We provide essential school supplies, books, and educational materials to underprivileged schools in rural Maharashtra. Our trekkers visit these schools during treks, interacting with students and understanding their needs firsthand.",
  },
  {
    icon: Bike,
    title: "Cycle Donation Drive",
    description:
      "Many students in rural areas walk several kilometers to reach school. We donate cycles to these students, making their journey to education easier and safer. Each cycle donated is a step towards a brighter future.",
  },
  {
    icon: HandHeart,
    title: "Community Welfare",
    description:
      "From clothing drives to health camps, we organize various community welfare initiatives across villages we visit during our treks. Our goal is to leave every place we visit a little better than we found it.",
  },
];

function ActivitySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-2/3" />
      </div>
    </div>
  );
}

export default function OurWork() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await getSocialActivities();
        setActivities(
          res.data?.activities ||
            res.data?.data ||
            res.data?.images ||
            res.data ||
            []
        );
      } catch (err) {
        console.error("Failed to fetch social activities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  function getImageUrl(item) {
    if (typeof item === "string") return item;
    return item.url || item.image || item.imageUrl || item.src || "";
  }

  function getTitle(item) {
    if (typeof item === "string") return "";
    return item.title || item.name || "";
  }

  function getDescription(item) {
    if (typeof item === "string") return "";
    return item.description || item.caption || item.text || "";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E3A5F] via-primary-dark to-primary text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Heart className="h-12 w-12 mx-auto mb-4 text-secondary" />
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6">
              Our Social Impact
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              At Avir Trekkers, we believe adventure and social responsibility
              go hand in hand. Every trek we organize is an opportunity to give
              back to the communities we visit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {IMPACT_STATS.map(({ icon: Icon, label, value, suffix }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold font-heading text-text">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-sm text-text-light">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-2">
              Our Initiatives
            </h2>
            <p className="text-text-light">
              Programs that create lasting positive change
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIATIVES.map(
              ({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm p-8"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text mb-3">
                    {title}
                  </h3>
                  <p className="text-text-light leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Activities from API */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-2">
              Recent Activities
            </h2>
            <p className="text-text-light">
              Moments from our social impact work
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <ActivitySkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && activities.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <p className="text-text-light text-lg">
                Activity highlights will be shared here soon.
              </p>
            </div>
          )}

          {!loading && activities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, index) => {
                const imageUrl = getImageUrl(activity);
                const title = getTitle(activity);
                const description = getDescription(activity);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title || `Activity ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary-dark/20 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    <div className="p-5">
                      {title && (
                        <h3 className="font-heading font-semibold text-text text-lg mb-2">
                          {title}
                        </h3>
                      )}
                      {description && (
                        <p className="text-text-light text-sm leading-relaxed">
                          {description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              Join the Movement
            </h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              Every trek you join helps us make a difference. Be part of a
              community that treks with purpose and creates positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/treks"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Join a Trek
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border text-text hover:bg-surface px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
