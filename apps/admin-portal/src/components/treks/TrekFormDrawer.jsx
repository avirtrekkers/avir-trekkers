import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  createTrek,
  updateTrek,
  getTrekById,
  getCategories,
} from "../../services/api";
import TagInput from "./TagInput";
import ItineraryBuilder from "./ItineraryBuilder";

const CLOUD_API_BASE =
  import.meta.env.VITE_CLOUD_API_BASE ||
  "https://dev-api.technootales.in/v1/cloud";

const trekSchema = z.object({
  title: z.string().min(1, "Required"),
  shortDescription: z
    .string()
    .min(1, "Required")
    .max(200, "Max 200 characters"),
  description: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  difficulty: z.enum(["Easy", "Moderate", "Hard", "Expert"]),
  height: z.coerce.number().min(0, "Must be ≥ 0"),
  grade: z.string().min(1, "Required"),
  range: z.string().min(1, "Required"),
  route: z.string().min(1, "Required"),
  base: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  price: z.coerce.number().min(0, "Must be ≥ 0"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  registrationDeadline: z.string().min(1, "Required"),
  maxParticipants: z.coerce.number().min(1, "Must be ≥ 1"),
  status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]),
  isFeatured: z.boolean(),
  itinerary: z.array(z.any()).min(1, "Add at least one day"),
  inclusions: z.array(z.string()).min(1, "At least one required"),
  exclusions: z.array(z.string()).min(1, "At least one required"),
  requirements: z.array(z.string()).min(1, "At least one required"),
  pickupPoints: z.array(z.string()).min(1, "At least one required"),
});

const DEFAULT_VALUES = {
  title: "",
  shortDescription: "",
  description: "",
  location: "",
  category: "",
  difficulty: "Easy",
  height: "",
  grade: "",
  range: "",
  route: "",
  base: "",
  duration: "",
  price: "",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  maxParticipants: "",
  status: "Upcoming",
  isFeatured: false,
  itinerary: [
    {
      day: 0,
      dayTitle: "Day 0",
      activities: [{ time: "", title: "", description: "" }],
    },
  ],
  inclusions: [],
  exclusions: [],
  requirements: [],
  pickupPoints: [],
};

const TABS = ["Basic Info", "Schedule & Pricing", "Itinerary", "Details & Images"];

export default function TrekFormDrawer({ open, onClose, trekId, onSuccess }) {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [loadingTrek, setLoadingTrek] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isEdit = !!trekId;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(trekSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Fetch categories when drawer opens
  useEffect(() => {
    if (!open) return;
    getCategories()
      .then((res) => {
        const cats = res.data?.data || res.data || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(console.error);
  }, [open]);

  // Load trek data for edit, or reset form for create
  useEffect(() => {
    if (!open) return;

    if (!trekId) {
      reset(DEFAULT_VALUES);
      setImages([]);
      setTab(0);
      setSubmitError(null);
      return;
    }

    setLoadingTrek(true);
    setTab(0);
    setSubmitError(null);

    getTrekById(trekId)
      .then((res) => {
        const t = res.data?.data || res.data;
        reset({
          title: t.title || "",
          shortDescription: t.shortDescription || "",
          description: t.description || "",
          location: t.location || "",
          category: t.category?._id || t.category || "",
          difficulty: t.difficulty || "Easy",
          height: t.height ?? "",
          grade: t.grade || "",
          range: t.range || "",
          route: t.route || "",
          base: t.base || "",
          duration: t.duration || "",
          price: t.price ?? "",
          startDate: t.startDate
            ? new Date(t.startDate).toISOString().split("T")[0]
            : "",
          endDate: t.endDate
            ? new Date(t.endDate).toISOString().split("T")[0]
            : "",
          registrationDeadline: t.registrationDeadline
            ? new Date(t.registrationDeadline).toISOString().split("T")[0]
            : "",
          maxParticipants: t.maxParticipants ?? "",
          status: t.status || "Upcoming",
          isFeatured: t.isFeatured || false,
          itinerary:
            t.itinerary?.length > 0
              ? t.itinerary.map((d) => ({
                  day: d.day,
                  dayTitle: d.dayTitle || `Day ${d.day}`,
                  activities: (d.activities || []).map((a) =>
                    typeof a === "string"
                      ? { time: "", title: a, description: "" }
                      : {
                          time: a.time || "",
                          title: a.title || "",
                          description: a.description || "",
                        }
                  ),
                }))
              : [{ day: 0, dayTitle: "Day 0", activities: [{ time: "", title: "", description: "" }] }],
          inclusions: t.inclusions || [],
          exclusions: t.exclusions || [],
          requirements: t.requirements || [],
          pickupPoints: t.pickupPoints || [],
        });
        setImages(t.images || []);
      })
      .catch(console.error)
      .finally(() => setLoadingTrek(false));
  }, [open, trekId, reset]);

  const handleImageUpload = useCallback(
    async (files) => {
      if (images.length + files.length > 5) {
        alert("Maximum 5 images allowed. Remove some images first.");
        return;
      }
      setUploading(true);
      setUploadProgress(0);
      const urls = [];
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/"))
            throw new Error(`${file.name} is not an image`);
          if (file.size > 10 * 1024 * 1024)
            throw new Error(`${file.name} exceeds 10MB limit`);

          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch(`${CLOUD_API_BASE}/file`, {
            method: "POST",
            body: fd,
          });
          if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
          const result = await res.json();
          if (result.file?._id) {
            urls.push(`${CLOUD_API_BASE}/file/${result.file._id}`);
          }
          setUploadProgress(((i + 1) / files.length) * 100);
        }
        setImages((prev) => [...prev, ...urls]);
      } catch (err) {
        alert(`Upload failed: ${err.message}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [images.length]
  );

  const onSubmit = async (data) => {
    setSubmitError(null);
    if (images.length === 0) {
      setSubmitError("At least one trek image is required.");
      setTab(3);
      return;
    }
    try {
      const payload = {
        ...data,
        height: parseFloat(data.height),
        price: parseFloat(data.price),
        maxParticipants: parseInt(data.maxParticipants),
        images,
      };
      if (isEdit) {
        await updateTrek(trekId, payload);
      } else {
        await createTrek(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} trek. Please try again.`
      );
    }
  };

  const inputCls = (hasError) =>
    `w-full px-3 py-2 rounded-lg border ${
      hasError ? "border-red-500/50" : "border-white/10"
    } bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40`;

  const labelCls = "block text-xs font-medium text-text-light mb-1.5";
  const errCls = "text-red-400 text-xs mt-1";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0f1117] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white font-heading">
                {isEdit ? "Edit Trek" : "Create New Trek"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingTrek ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 flex-shrink-0 overflow-x-auto">
                  {TABS.map((t, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTab(i)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        tab === i
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-text-light hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Scrollable form body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {/* ── TAB 0: Basic Info ── */}
                  {tab === 0 && (
                    <>
                      <div>
                        <label className={labelCls}>Trek Title *</label>
                        <input
                          {...register("title")}
                          placeholder="e.g. Rajmachi Trek"
                          className={inputCls(errors.title)}
                        />
                        {errors.title && (
                          <p className={errCls}>{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <label className={labelCls}>
                          Short Description *{" "}
                          <span className="text-white/30">(max 200 chars)</span>
                        </label>
                        <textarea
                          {...register("shortDescription")}
                          rows={2}
                          placeholder="Brief description for trek listings"
                          className={inputCls(errors.shortDescription)}
                        />
                        {errors.shortDescription && (
                          <p className={errCls}>
                            {errors.shortDescription.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Location *</label>
                          <input
                            {...register("location")}
                            placeholder="e.g. Lonavala, Maharashtra"
                            className={inputCls(errors.location)}
                          />
                          {errors.location && (
                            <p className={errCls}>{errors.location.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Category *</label>
                          <select
                            {...register("category")}
                            className={inputCls(errors.category)}
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.icon} {c.name}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className={errCls}>{errors.category.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Difficulty *</label>
                          <select
                            {...register("difficulty")}
                            className={inputCls(false)}
                          >
                            {["Easy", "Moderate", "Hard", "Expert"].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Range *</label>
                          <select
                            {...register("range")}
                            className={inputCls(errors.range)}
                          >
                            <option value="">-- Select Range --</option>
                            <option value="Sahyadri">Sahyadri</option>
                            <option value="Himalaya">Himalaya</option>
                          </select>
                          {errors.range && (
                            <p className={errCls}>{errors.range.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>Height (meters) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("height")}
                            placeholder="1200"
                            className={inputCls(errors.height)}
                          />
                          {errors.height && (
                            <p className={errCls}>{errors.height.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Grade *</label>
                          <input
                            {...register("grade")}
                            placeholder="T1, T2, F, PD"
                            className={inputCls(errors.grade)}
                          />
                          {errors.grade && (
                            <p className={errCls}>{errors.grade.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Duration *</label>
                          <input
                            {...register("duration")}
                            placeholder="3 Days 2 Nights"
                            className={inputCls(errors.duration)}
                          />
                          {errors.duration && (
                            <p className={errCls}>{errors.duration.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Route *</label>
                          <input
                            {...register("route")}
                            placeholder="e.g. Pachnai Route"
                            className={inputCls(errors.route)}
                          />
                          {errors.route && (
                            <p className={errCls}>{errors.route.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>Base Village *</label>
                          <input
                            {...register("base")}
                            placeholder="e.g. Udhewadi"
                            className={inputCls(errors.base)}
                          />
                          {errors.base && (
                            <p className={errCls}>{errors.base.message}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── TAB 1: Schedule & Pricing ── */}
                  {tab === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Start Date *</label>
                          <input
                            type="date"
                            {...register("startDate")}
                            className={inputCls(errors.startDate)}
                          />
                          {errors.startDate && (
                            <p className={errCls}>{errors.startDate.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>End Date *</label>
                          <input
                            type="date"
                            {...register("endDate")}
                            className={inputCls(errors.endDate)}
                          />
                          {errors.endDate && (
                            <p className={errCls}>{errors.endDate.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>
                          Registration Deadline *
                        </label>
                        <input
                          type="date"
                          {...register("registrationDeadline")}
                          className={inputCls(errors.registrationDeadline)}
                        />
                        {errors.registrationDeadline && (
                          <p className={errCls}>
                            {errors.registrationDeadline.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Price (₹) *</label>
                          <input
                            type="number"
                            min="0"
                            {...register("price")}
                            placeholder="1500"
                            className={inputCls(errors.price)}
                          />
                          {errors.price && (
                            <p className={errCls}>{errors.price.message}</p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>
                            Max Participants *
                          </label>
                          <input
                            type="number"
                            min="1"
                            {...register("maxParticipants")}
                            placeholder="25"
                            className={inputCls(errors.maxParticipants)}
                          />
                          {errors.maxParticipants && (
                            <p className={errCls}>
                              {errors.maxParticipants.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Status</label>
                        <select
                          {...register("status")}
                          className={inputCls(false)}
                        >
                          {["Upcoming", "Ongoing", "Completed", "Cancelled"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          {...register("isFeatured")}
                          className="w-4 h-4 rounded accent-blue-500"
                        />
                        <label
                          htmlFor="isFeatured"
                          className="text-sm text-text-light cursor-pointer"
                        >
                          Mark as Featured Trek
                        </label>
                      </div>
                    </>
                  )}

                  {/* ── TAB 2: Itinerary ── */}
                  {tab === 2 && (
                    <Controller
                      name="itinerary"
                      control={control}
                      render={({ field }) => (
                        <ItineraryBuilder
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.itinerary?.message}
                        />
                      )}
                    />
                  )}

                  {/* ── TAB 3: Details & Images ── */}
                  {tab === 3 && (
                    <>
                      <div>
                        <label className={labelCls}>Trek Description *</label>
                        <textarea
                          {...register("description")}
                          rows={5}
                          placeholder="Detailed trek description, history, highlights..."
                          className={inputCls(errors.description)}
                        />
                        {errors.description && (
                          <p className={errCls}>
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      {/* Image upload */}
                      <div>
                        <label className={labelCls}>
                          Trek Images *{" "}
                          <span className="text-white/30">
                            (1–5 images, max 10MB each)
                          </span>
                        </label>
                        <div
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            handleImageUpload(Array.from(e.dataTransfer.files));
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          className={`relative rounded-xl border-2 border-dashed transition-colors ${
                            dragOver
                              ? "border-blue-500 bg-blue-500/5"
                              : "border-white/10 bg-white/[0.03]"
                          } p-6 text-center`}
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(Array.from(e.target.files))
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            disabled={uploading || images.length >= 5}
                          />
                          {uploading ? (
                            <div className="space-y-2 pointer-events-none">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                              <p className="text-sm text-text-light">
                                Uploading... {Math.round(uploadProgress)}%
                              </p>
                              <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="pointer-events-none">
                              <ImagePlus className="w-8 h-8 text-text-light mx-auto mb-2" />
                              <p className="text-sm text-text-light">
                                Drag & drop or click to upload
                              </p>
                              <p className="text-xs text-white/30 mt-1">
                                JPG, PNG, GIF · max 10MB · up to 5 images
                              </p>
                            </div>
                          )}
                        </div>

                        {images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {images.map((url, i) => (
                              <div
                                key={i}
                                className="relative rounded-lg overflow-hidden aspect-video bg-white/[0.03] group"
                              >
                                <img
                                  src={url}
                                  alt={`Trek image ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImages((p) =>
                                      p.filter((_, idx) => idx !== i)
                                    )
                                  }
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Controller
                        name="inclusions"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            label="Inclusions *"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="e.g. Expert trek guide"
                            error={errors.inclusions?.message}
                          />
                        )}
                      />
                      <Controller
                        name="exclusions"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            label="Exclusions *"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="e.g. Travel insurance"
                            error={errors.exclusions?.message}
                          />
                        )}
                      />
                      <Controller
                        name="requirements"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            label="Requirements *"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="e.g. Trekking shoes"
                            error={errors.requirements?.message}
                          />
                        )}
                      />
                      <Controller
                        name="pickupPoints"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            label="Pickup Points *"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="e.g. Pune Station"
                            error={errors.pickupPoints?.message}
                          />
                        )}
                      />
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 px-6 py-4 flex-shrink-0">
                  {submitError && (
                    <p className="text-red-400 text-sm mb-3">{submitError}</p>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    {/* Prev / Next */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTab((t) => Math.max(0, t - 1))}
                        disabled={tab === 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-text-light text-sm hover:bg-white/[0.06] transition-colors disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTab((t) => Math.min(TABS.length - 1, t + 1))
                        }
                        disabled={tab === TABS.length - 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-text-light text-sm hover:bg-white/[0.06] transition-colors disabled:opacity-30"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cancel / Submit */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-white/10 text-text-light text-sm hover:bg-white/[0.06] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
                      >
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isEdit ? "Update Trek" : "Create Trek"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
