import { useState, useEffect, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getSiteStats, getTeamMembers } from "../services/api";
import usePageMeta from "../lib/usePageMeta";
import usePageHero from "../lib/usePageHero";
import {
  Mountain, Heart, Target, Users, ArrowRight,
  MapPin, Shield, ChevronLeft, ChevronRight, Flag,
} from "lucide-react";

const STORY_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80";

function VisualStory({ stats }) {
  const storyImg = usePageHero("aboutStory", STORY_IMG);
  const items = [
    { label: "Weekend treks",        icon: Mountain },
    { label: "Community events",     icon: Users },
    { label: "Social impact drives", icon: Heart },
    { label: "Heritage walks",       icon: Flag },
  ];
  const miniStats = [
    { value: stats.foundedYear || "2020", label: "Founded" },
    { value: `${stats.treks || 50}+`,     label: "Treks" },
    { value: `${stats.trekkers || 500}+`, label: "Trekkers" },
    { value: `${stats.schools || 20}+`,   label: "Schools" },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
        className="relative rounded-2xl overflow-hidden h-52 shadow-md">
        <img src={storyImg} alt="Avir Trekkers in the Sahyadri" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <p className="text-white font-semibold text-sm drop-shadow">Sahyadri Range, Maharashtra</p>
          <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">Est. {stats.foundedYear || 2020}</span>
        </div>
      </Motion.div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => { const { label, icon: Icon } = item; return (
          <Motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-slate-700 text-sm font-medium">{label}</span>
          </Motion.div>
        ); })}
      </div>
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-4 gap-3 pt-1">
        {miniStats.map(({ value, label }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-slate-800">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </Motion.div>
    </div>
  );
}

function VisualMission() {
  const items = [
    { icon: Target, bg: "bg-blue-50",    color: "text-blue-700",   title: "Safe Trekking",    desc: "Certified guides, first-aid trained staff, and meticulous route planning on every single trek." },
    { icon: Heart,  bg: "bg-orange-50",  color: "text-orange-500", title: "Social Impact",    desc: "Every trek funds schools with supplies, donates cycles to students, and runs community welfare drives." },
    { icon: Users,  bg: "bg-purple-50",  color: "text-purple-600", title: "Open to All",      desc: "We welcome complete beginners right through to seasoned mountaineers — everyone has a place with us." },
    { icon: Shield, bg: "bg-emerald-50", color: "text-emerald-600",title: "Responsible Trek", desc: "We follow a strict leave-no-trace policy and actively protect the trails, forests, and forts we visit." },
  ];
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {items.map((item, i) => { const { icon: Icon, bg, color, title, desc } = item; return (
        <Motion.div key={title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="flex flex-col gap-3 bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-sm">{title}</p>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{desc}</p>
          </div>
        </Motion.div>
      ); })}
    </div>
  );
}

function VisualVision({ stats }) {
  const items = [
    { icon: MapPin, bg: "bg-blue-50",    color: "text-blue-700",   value: `${stats.treks || 50}+`,     label: "Treks Organised",  desc: "Across the Sahyadri and beyond" },
    { icon: Users,  bg: "bg-purple-50",  color: "text-purple-600", value: `${stats.trekkers || 500}+`, label: "Happy Trekkers",   desc: "And growing every weekend" },
    { icon: Flag,   bg: "bg-amber-50",   color: "text-amber-600",  value: `${stats.forts || 25}+`,     label: "Historic Forts",   desc: "Explored and documented" },
    { icon: Heart,  bg: "bg-orange-50",  color: "text-orange-500", value: `${stats.lives || 1000}+`,   label: "Lives Impacted",   desc: "Through social drives and donations" },
  ];
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {items.map((item, i) => { const { icon: Icon, bg, color, value, label, desc } = item; return (
        <Motion.div key={label} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.09 }}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col">
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <span className="text-4xl font-bold text-slate-800 leading-none">{value}</span>
          <span className="text-slate-700 text-sm font-semibold mt-2">{label}</span>
          <span className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</span>
        </Motion.div>
      ); })}
    </div>
  );
}

function VisualValues() {
  const vals = [
    { icon: Mountain, bg: "bg-blue-50",    color: "text-blue-700",   title: "Adventure",     desc: "Challenge yourself, discover your limits, and find inspiration in every peak and fort we explore together." },
    { icon: Heart,    bg: "bg-orange-50",  color: "text-orange-500", title: "Social Impact", desc: "Every trek funds schools with supplies, donates cycles to students, and actively uplifts rural communities." },
    { icon: Shield,   bg: "bg-emerald-50", color: "text-emerald-600",title: "Safety First",  desc: "Meticulous route planning, trained guides, and first-aid readiness on every single trek we organise." },
    { icon: Users,    bg: "bg-purple-50",  color: "text-purple-600", title: "Community",     desc: "We build lifelong friendships among adventurers who share a passion for trails, forts, and giving back." },
  ];
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {vals.map((item, i) => { const { icon: Icon, bg, color, title, desc } = item; return (
        <Motion.div key={title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-sm">{title}</p>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{desc}</p>
          </div>
        </Motion.div>
      ); })}
    </div>
  );
}

const SLIDES = [
  { id: "story",   label: "Our Story", heading: "We Trek With Purpose",                      body: "Founded by passionate trekkers from Maharashtra, Avir Trekkers was born from a simple belief — exploring nature should go hand in hand with giving back. What started as weekend hikes through the Sahyadri ranges has grown into a movement of adventurers who care." },
  { id: "mission", label: "Mission",   heading: "Making Trekking Accessible",                body: "Our mission is to make trekking accessible to everyone while creating meaningful impact on rural communities across Maharashtra. We organise safe, well-planned treks to historic forts and scenic trails — channelling our passion for adventure into real social work." },
  { id: "vision",  label: "Vision",    heading: "Maharashtra's Most Impactful Trek Community", body: "We envision a future where every trek creates ripples of positive change — inspiring more people to adventure with purpose. Exploring the beauty of our state's forts while driving real change in the lives of those who need it most." },
  { id: "values",  label: "Values",    heading: "What We Stand For",                         body: "Everything we do is guided by four core values that shape how we organise treks, engage with communities, and grow as a team. These aren't just words — they're the principles every Avir Trekker lives by on and off the trail." },
];

const FALLBACK_TEAM = [
  { _id: "1", name: "Founder",           role: "Lead Trek Organizer",  description: "Passionate trekker with years of experience exploring Maharashtra's forts and trails." },
  { _id: "2", name: "Co-Founder",        role: "Social Impact Lead",   description: "Drives our charity initiatives including school support and cycle donation programs." },
  { _id: "3", name: "Trek Guide",        role: "Senior Trek Guide",    description: "Certified mountaineer ensuring safe and memorable trekking experiences." },
  { _id: "4", name: "Community Manager", role: "Community & Outreach", description: "Builds and nurtures our growing community of trekkers and volunteers." },
];

const slideVariants = (dir) => ({
  enter:  { opacity: 0, x: dir * 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:   { opacity: 0, x: dir * -40, transition: { duration: 0.25, ease: "easeIn" } },
});

const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function About() {
  usePageMeta("About Us", "Our story, mission and the team behind Avir Trekkers.");
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [stats, setStats] = useState({ treks: 50, trekkers: 500, schools: 20, cycles: 100, drives: 30, lives: 1000, forts: 25, foundedYear: 2020 });
  const [team, setTeam] = useState(FALLBACK_TEAM);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, teamRes] = await Promise.all([getSiteStats(), getTeamMembers()]);
        if (statsRes.data?.data) {
          const s = statsRes.data.data;
          setStats({ ...s, foundedYear: s.foundedYear || 2020 });
        }
        const members = teamRes.data?.data;
        if (Array.isArray(members) && members.length > 0) setTeam(members);
      } catch (err) {
        console.error("Failed to fetch about data:", err);
      }
    }
    fetchData();
  }, []);

  const go = useCallback((next, manual = false) => {
    if (manual) setAutoPlay(false); // reader is in control now — stop rotating
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const prev = () => go(current === 0 ? SLIDES.length - 1 : current - 1, true);
  const next = () => go(current === SLIDES.length - 1 ? 0 : current + 1, true);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const t = setTimeout(() => go(current === SLIDES.length - 1 ? 0 : current + 1), 7000);
    return () => clearTimeout(t);
  }, [current, go, autoPlay, paused]);

  const slide = SLIDES[current];
  const vars = slideVariants(dir);

  function renderVisual() {
    if (slide.id === "story")   return <VisualStory stats={stats} />;
    if (slide.id === "mission") return <VisualMission />;
    if (slide.id === "vision")  return <VisualVision stats={stats} />;
    if (slide.id === "values")  return <VisualValues />;
    return null;
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── ABOVE-THE-FOLD ── */}
      <div
        className="lg:min-h-[620px] lg:max-h-[760px] flex flex-col lg:flex-row"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* LEFT */}
        <div className="lg:w-[44%] bg-gradient-to-br from-[#0B2545] to-[#1D3557] text-white flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400/80 mb-4">{slide.label}</p>
            <AnimatePresence mode="wait">
              <Motion.h1 key={slide.id + "-h"} variants={vars} initial="enter" animate="center" exit="exit"
                className="text-3xl lg:text-4xl xl:text-[2.75rem] font-bold font-heading leading-snug lg:leading-tight mb-5">
                {slide.heading}
              </Motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <Motion.p key={slide.id + "-p"} variants={vars} initial="enter" animate="center" exit="exit"
                className="text-white/70 text-sm lg:text-[15px] leading-relaxed max-w-md">
                {slide.body}
              </Motion.p>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center gap-3 mt-8 mb-6">
            <button onClick={prev} aria-label="Previous slide" className="w-9 h-9 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => go(i, true)} aria-label={`Go to ${s.label}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-7 bg-orange-500" : "w-2 bg-white/20 hover:bg-white/35"}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Next slide" className="w-9 h-9 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-white/25 text-xs tabular-nums ml-1">{current + 1}/{SLIDES.length}</span>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <Link to="/treks" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <MapPin className="w-4 h-4" /> Explore Treks
            </Link>
            <Link to="/our-work" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Our Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:w-[56%] bg-slate-50 flex flex-col">
          <div className="flex border-b border-slate-200">
            {SLIDES.map((s, i) => (
              <button key={s.id} onClick={() => go(i, true)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${i === current ? "border-[#1D3557] text-[#1D3557]" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col px-8 lg:px-10 py-8 relative overflow-hidden">
            {/* Decorative watermark — sits behind the content cards */}
            <span aria-hidden="true"
              className="absolute -bottom-3 right-4 text-7xl lg:text-8xl font-black text-slate-900/[0.04] select-none pointer-events-none uppercase z-0 leading-none">
              {slide.label}
            </span>
            <div className="relative z-10 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{slide.label}</span>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <Motion.div key={slide.id + "-v"} variants={vars} initial="enter" animate="center" exit="exit"
                  className="w-full max-w-2xl mx-auto">
                  {renderVisual()}
                </Motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <section className="py-16 lg:py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> The People
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-2">Meet the Team</h2>
            <p className="text-text-light text-sm max-w-md mx-auto">
              Guides, organisers and community builders who make every trek safe, memorable and meaningful.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <Motion.div key={m._id || i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0B2545] to-[#457B9D] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                      <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-orange-500/15 rounded-full" />
                      <span className="text-4xl font-black text-white/90 tracking-wide font-heading">
                        {initials(m.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-heading font-bold text-white text-base leading-tight drop-shadow">{m.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 rounded-full px-2.5 py-1 mb-3">
                    {m.role}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0B2545] to-[#1D3557] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />
        <Mountain aria-hidden="true" className="absolute right-8 bottom-6 w-28 h-28 text-white/[0.04] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">Ready to Trek with Us?</h2>
          <p className="text-white/60 mb-7 text-sm leading-relaxed">
            Join our community of adventurers and be part of something meaningful. Every trek is an opportunity to explore, connect, and give back.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/treks" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
              <MapPin className="w-4 h-4" /> Explore Treks
            </Link>
            <Link to="/our-work" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
              <Heart className="w-4 h-4" /> Our Social Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
