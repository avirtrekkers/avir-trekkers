import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Mail, Phone, Clock, Search, X,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Inbox,
} from "lucide-react";

// Sample inquiries — replace with API data when backend is ready
const SAMPLE_INQUIRIES = [
  {
    id: "1", name: "Rahul Sharma", email: "rahul.sharma@example.com", phone: "+91 98765 43210",
    subject: "Trek difficulty for beginners",
    message: "Hi, I wanted to know if the Harishchandragad trek is suitable for first-time trekkers. We are a group of 4 people with no prior trekking experience. What level of fitness is required and what gear should we carry?",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), status: "new",
  },
  {
    id: "2", name: "Priya Patel", email: "priya.patel@example.com", phone: "+91 87654 32109",
    subject: "Group booking discount",
    message: "We are a group of 12 people planning for the Rajmachi Fort Trek & Camping. Is there any group discount available? Also, can we get a customised date for our group?",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), status: "read",
  },
  {
    id: "3", name: "Amit Kumar", email: "amit.kumar@example.com", phone: "+91 76543 21098",
    subject: "Cancellation and refund policy",
    message: "What is the cancellation and refund policy for booked treks? I have made a booking but there is an emergency and I may need to cancel. Please let me know the process.",
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(), status: "replied",
  },
  {
    id: "4", name: "Sneha Desai", email: "sneha.desai@example.com", phone: "+91 95678 34512",
    subject: "Accommodation during trek",
    message: "Does the trek package include accommodation? If so, what kind of accommodation is provided — tents, homestays or dormitories? Also, are meals included in the package price?",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: "new",
  },
  {
    id: "5", name: "Vikram Joshi", email: "vikram.joshi@example.com", phone: "+91 91234 56789",
    subject: "Age limit for Velas Turtle Festival",
    message: "Is there any age restriction for the Velas Turtle Festival Trek? We want to bring our 10-year-old child along. Also is it safe for children and elderly people above 60?",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), status: "read",
  },
];

const STATUS_META = {
  new:     { label: "New",     cls: "bg-blue-500/15 text-blue-400",    dot: "bg-blue-400"     },
  read:    { label: "Read",    cls: "bg-white/10 text-white/50",        dot: "bg-white/30"     },
  replied: { label: "Replied", cls: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400" },
};

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Reply drawer ───────────────────────────────────────────────────────────────
function ReplyDrawer({ inquiry, onClose, onReplied }) {
  const [body, setBody]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSend = async () => {
    if (!body.trim()) return;
    setSending(true);
    // Simulate send — replace with real API call when available
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    setTimeout(() => { onReplied(inquiry.id); onClose(); }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f1117] border-l border-white/10 z-50 flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Reply to {inquiry.name}</h2>
            <p className="text-xs text-text-light">{inquiry.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Original message */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-white/40 mb-1">Original Message — {inquiry.subject}</p>
            <p className="text-sm text-white/70 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Reply body */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Your Reply</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder={`Hi ${inquiry.name.split(" ")[0]},\n\nThank you for reaching out to Avir Trekkers...`}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
            />
          </div>

          <p className="text-xs text-white/30">
            Note: Email sending integration will be connected when the backend is configured.
            This action marks the inquiry as Replied.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending || !body.trim() || sent}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-60">
            {sent
              ? <><CheckCircle2 className="w-4 h-4" /> Sent!</>
              : sending
                ? <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                : <>Send Reply</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Inquiries() {
  const [inquiries, setInquiries]   = useState(SAMPLE_INQUIRIES);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [replyTarget, setReply]     = useState(null);

  const markRead = (id) =>
    setInquiries((prev) => prev.map((q) => q.id === id && q.status === "new" ? { ...q, status: "read" } : q));

  const markReplied = (id) =>
    setInquiries((prev) => prev.map((q) => q.id === id ? { ...q, status: "replied" } : q));

  const filtered = inquiries.filter((q) => {
    const matchSearch = !search ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = inquiries.filter((q) => q.status === "new").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-text">Inquiries</h1>
          {newCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
              {newCount} new
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setStatus(""); }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-text-light hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Inbox className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-text-light">No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            const meta = STATUS_META[inquiry.status] || STATUS_META.read;

            return (
              <motion.div
                key={inquiry.id}
                layout
                className={`glass-card rounded-2xl overflow-hidden transition-shadow ${inquiry.status === "new" ? "border border-blue-500/20" : ""}`}
              >
                {/* Header row */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : inquiry.id);
                    if (!isExpanded) markRead(inquiry.id);
                  }}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 flex-shrink-0">
                    {inquiry.status === "new"
                      ? <div className="w-2 h-2 rounded-full bg-blue-400" />
                      : <div className="w-2 h-2 rounded-full bg-white/10" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`font-medium text-sm ${inquiry.status === "new" ? "text-white" : "text-text"}`}>
                        {inquiry.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className={`text-sm font-medium mb-0.5 ${inquiry.status === "new" ? "text-white/90" : "text-text-light"}`}>
                      {inquiry.subject}
                    </p>
                    <p className="text-xs text-white/30 line-clamp-1">{inquiry.message}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <Clock className="w-3 h-3" /> {relativeTime(inquiry.createdAt)}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-white/30" />
                      : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </div>
                </div>

                {/* Expanded body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/[0.06]">
                        {/* Contact info */}
                        <div className="flex flex-wrap gap-4 py-3 mb-3">
                          <span className="flex items-center gap-1.5 text-xs text-text-light">
                            <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-text-light">
                            <Phone className="w-3.5 h-3.5" /> {inquiry.phone}
                          </span>
                        </div>

                        {/* Full message */}
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 mb-4">
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReply(inquiry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Reply
                          </button>
                          {inquiry.status !== "replied" && (
                            <button
                              onClick={() => markReplied(inquiry.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-text-light hover:bg-white/[0.06] text-xs font-medium transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Replied
                            </button>
                          )}
                          {inquiry.status === "new" && (
                            <button
                              onClick={() => markRead(inquiry.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-text-light hover:bg-white/[0.06] text-xs font-medium transition-colors"
                            >
                              <Circle className="w-3.5 h-3.5" /> Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-text-light mt-4">
        Showing {filtered.length} of {inquiries.length} inquir{inquiries.length !== 1 ? "ies" : "y"}
      </p>

      {/* Reply drawer */}
      {replyTarget && (
        <ReplyDrawer
          inquiry={replyTarget}
          onClose={() => setReply(null)}
          onReplied={markReplied}
        />
      )}
    </motion.div>
  );
}
