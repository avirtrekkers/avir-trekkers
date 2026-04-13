import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Loader2, MapPin, Mountain, Calendar, Users, Tag,
  Clock, IndianRupee, CheckCircle2, XCircle, AlertCircle, Navigation,
} from "lucide-react";
import { getTrekById } from "../../services/api";
import { formatPrice, formatDate } from "../../lib/utils";

const DIFFICULTY_COLORS = {
  easy:     "bg-emerald-500/15 text-emerald-400",
  moderate: "bg-amber-500/15 text-amber-400",
  hard:     "bg-orange-500/15 text-orange-400",
  expert:   "bg-red-500/15 text-red-400",
};

const STATUS_COLORS = {
  upcoming:  "bg-blue-500/15 text-blue-400",
  ongoing:   "bg-emerald-500/15 text-emerald-400",
  completed: "bg-white/10 text-white/50",
  cancelled: "bg-red-500/15 text-red-400",
};

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/[0.05] last:border-0">
      <Icon className="w-4 h-4 text-text-light mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm text-white font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

function TagList({ items = [] }) {
  if (!items.length) return <p className="text-sm text-white/30 italic">None listed</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/70">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function TrekViewDrawer({ open, onClose, trekId, onEdit }) {
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !trekId) { setTrek(null); return; }
    setLoading(true);
    getTrekById(trekId)
      .then((res) => setTrek(res.data?.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, trekId]);

  const difficulty = (trek?.difficulty || "").toLowerCase();
  const status = (trek?.status || "").toLowerCase();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0f1117] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-white font-heading leading-tight">
                  {loading ? "Loading..." : trek?.title || trek?.name || "Trek Details"}
                </h2>
                {trek && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DIFFICULTY_COLORS[difficulty] || "bg-white/10 text-white/50"}`}>
                      {trek.difficulty}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || "bg-white/10 text-white/50"}`}>
                      {trek.status}
                    </span>
                    {trek.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
                        Featured
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onEdit && trek && (
                  <button
                    onClick={() => { onClose(); onEdit(trekId); }}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    Edit Trek
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : !trek ? (
              <div className="flex-1 flex items-center justify-center text-text-light">
                Failed to load trek details.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                {/* Images */}
                {trek.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {trek.images.slice(0, 3).map((url, i) => (
                      <div key={i} className="rounded-lg overflow-hidden aspect-video bg-white/[0.03]">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Info */}
                <Section title="Overview">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 divide-y divide-white/[0.05]">
                    <InfoRow icon={MapPin}       label="Location"        value={trek.location} />
                    <InfoRow icon={Tag}          label="Category"        value={trek.category?.name || trek.category} />
                    <InfoRow icon={Mountain}     label="Height / Grade"  value={trek.height ? `${trek.height}m · Grade ${trek.grade}` : trek.grade} />
                    <InfoRow icon={Navigation}   label="Range / Route"   value={[trek.range, trek.route].filter(Boolean).join(" · ")} />
                    <InfoRow icon={Clock}        label="Duration"        value={trek.duration} />
                    <InfoRow icon={Users}        label="Base Village"    value={trek.base} />
                  </div>
                </Section>

                {/* Schedule & Pricing */}
                <Section title="Schedule & Pricing">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Start Date",    value: trek.startDate ? formatDate(trek.startDate) : "—" },
                      { label: "End Date",      value: trek.endDate ? formatDate(trek.endDate) : "—" },
                      { label: "Reg. Deadline", value: trek.registrationDeadline ? formatDate(trek.registrationDeadline) : "—" },
                      { label: "Price",         value: trek.price != null ? formatPrice(trek.price) : "—" },
                      { label: "Max Participants", value: trek.maxParticipants ?? "—" },
                      { label: "Enrolled",      value: trek.currentParticipants ?? 0 },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                        <p className="text-xs text-white/40 mb-0.5">{item.label}</p>
                        <p className="text-sm text-white font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Description */}
                {trek.description && (
                  <Section title="Description">
                    <p className="text-sm text-white/70 leading-relaxed">{trek.description}</p>
                  </Section>
                )}

                {/* Short Description */}
                {trek.shortDescription && (
                  <Section title="Short Description">
                    <p className="text-sm text-white/60 leading-relaxed italic">"{trek.shortDescription}"</p>
                  </Section>
                )}

                {/* Itinerary */}
                {trek.itinerary?.length > 0 && (
                  <Section title={`Itinerary (${trek.itinerary.length} day${trek.itinerary.length > 1 ? "s" : ""})`}>
                    <div className="space-y-2">
                      {trek.itinerary.map((day, i) => (
                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                              Day {day.day}
                            </span>
                            <span className="text-sm font-medium text-white">{day.dayTitle}</span>
                          </div>
                          <div className="space-y-1">
                            {(day.activities || []).map((act, j) => (
                              <div key={j} className="flex items-start gap-2 text-xs text-white/60">
                                <span className="text-white/30 w-14 flex-shrink-0">{act.time}</span>
                                <span className="font-medium text-white/80">{act.title}</span>
                                {act.description && <span className="text-white/40">· {act.description}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Inclusions / Exclusions */}
                <div className="grid grid-cols-2 gap-4">
                  <Section title="Inclusions">
                    <TagList items={trek.inclusions} />
                  </Section>
                  <Section title="Exclusions">
                    <TagList items={trek.exclusions} />
                  </Section>
                </div>

                {/* Requirements / Pickup */}
                <div className="grid grid-cols-2 gap-4">
                  <Section title="Requirements">
                    <TagList items={trek.requirements} />
                  </Section>
                  <Section title="Pickup Points">
                    <TagList items={trek.pickupPoints} />
                  </Section>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
