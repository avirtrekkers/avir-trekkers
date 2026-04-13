import { Plus, Trash2 } from "lucide-react";

const defaultDay = (n) => ({
  day: n,
  dayTitle: `Day ${n}`,
  activities: [{ time: "", title: "", description: "" }],
});

const INITIAL_DAY = 0;

const defaultActivity = () => ({ time: "", title: "", description: "" });

const inputCls =
  "px-2 py-1.5 rounded-lg border border-white/10 bg-white/[0.06] text-white text-xs placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-blue-500/40 w-full";

export default function ItineraryBuilder({ value = [], onChange, error }) {
  const days = value.length > 0 ? value : [defaultDay(INITIAL_DAY)];

  const setDays = (next) => onChange(next);

  const addDay = () => setDays([...days, defaultDay(INITIAL_DAY + days.length)]);

  const removeDay = (i) => {
    if (days.length <= 1) return;
    setDays(
      days
        .filter((_, idx) => idx !== i)
        .map((d, idx) => ({ ...d, day: INITIAL_DAY + idx }))
    );
  };

  const updateDayTitle = (i, title) =>
    setDays(days.map((d, idx) => (idx === i ? { ...d, dayTitle: title } : d)));

  const addActivity = (di) =>
    setDays(
      days.map((d, i) =>
        i === di
          ? { ...d, activities: [...d.activities, defaultActivity()] }
          : d
      )
    );

  const removeActivity = (di, ai) => {
    if (days[di].activities.length <= 1) return;
    setDays(
      days.map((d, i) =>
        i === di
          ? { ...d, activities: d.activities.filter((_, idx) => idx !== ai) }
          : d
      )
    );
  };

  const updateActivity = (di, ai, field, val) =>
    setDays(
      days.map((d, i) =>
        i === di
          ? {
              ...d,
              activities: d.activities.map((a, idx) =>
                idx === ai ? { ...a, [field]: val } : a
              ),
            }
          : d
      )
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-medium text-text-light">
          Itinerary *
        </label>
        <button
          type="button"
          onClick={addDay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Day
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-2">
          {typeof error === "string" ? error : "Please complete the itinerary"}
        </p>
      )}

      <div className="space-y-3">
        {days.map((day, di) => (
          <div
            key={di}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            {/* Day header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium whitespace-nowrap">
                Day {day.day}
              </span>
              <input
                type="text"
                value={day.dayTitle || ""}
                onChange={(e) => updateDayTitle(di, e.target.value)}
                placeholder={`Day ${day.day} title`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(di)}
                  title="Remove day"
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Activities */}
            <div className="space-y-2">
              <div className="grid grid-cols-[90px_1fr_1fr_28px] gap-2 text-xs text-white/30 px-1">
                <span>Time</span>
                <span>Activity</span>
                <span>Details (optional)</span>
                <span />
              </div>
              {day.activities.map((act, ai) => (
                <div key={ai} className="grid grid-cols-[90px_1fr_1fr_28px] gap-2">
                  <input
                    type="text"
                    value={act.time}
                    onChange={(e) => updateActivity(di, ai, "time", e.target.value)}
                    placeholder="6:00 AM"
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={act.title}
                    onChange={(e) => updateActivity(di, ai, "title", e.target.value)}
                    placeholder="Start trek"
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={act.description}
                    onChange={(e) => updateActivity(di, ai, "description", e.target.value)}
                    placeholder="Optional"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => removeActivity(di, ai)}
                    disabled={day.activities.length <= 1}
                    title="Remove activity"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addActivity(di)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
              >
                <Plus className="w-3 h-3" /> Add activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
