// Shared constants, types, and utilities for Avir Trekkers

// ============================================
// CONSTANTS
// ============================================

export const TREK_STATUS = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TREK_DIFFICULTY = {
  EASY: "Easy",
  MODERATE: "Moderate",
  HARD: "Hard",
  EXPERT: "Expert",
};

export const ENROLLMENT_STATUS = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const REVIEW_STATUS = {
  PENDING: false,   // isApproved: false
  APPROVED: true,   // isApproved: true
};

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// ============================================
// DESIGN TOKENS
// ============================================

export const COLORS = {
  primary: "#2D6A4F",       // Forest Green
  primaryLight: "#40916C",
  primaryDark: "#1B4332",
  secondary: "#E76F51",     // Earthy Orange
  secondaryLight: "#F4845F",
  accent: "#F4A261",        // Golden Yellow
  background: "#FAFAF8",
  surface: "#FFFFFF",
  text: "#2D3436",
  textLight: "#636E72",
  border: "#E2E8F0",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  adminPrimary: "#3B82F6",  // Slate Blue (admin portal)
};

export const FONTS = {
  heading: "'Inter', sans-serif",
  body: "'Lato', sans-serif",
};

// ============================================
// UTILITIES
// ============================================

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getAvailableSlots(maxParticipants, currentParticipants) {
  return Math.max(0, maxParticipants - (currentParticipants || 0));
}

export function getTrekStatusBadge(status, availableSlots) {
  if (status === TREK_STATUS.CANCELLED) return { label: "Cancelled", color: "red" };
  if (status === TREK_STATUS.COMPLETED) return { label: "Completed", color: "gray" };
  if (availableSlots === 0) return { label: "Fully Booked", color: "red" };
  if (availableSlots <= 5) return { label: `${availableSlots} Slots Left`, color: "orange" };
  return { label: "Open", color: "green" };
}

// ============================================
// VALIDATION PATTERNS
// ============================================

export const PATTERNS = {
  indianPhone: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  otp: /^\d{6}$/,
};

export const VALIDATION_MESSAGES = {
  required: (field) => `${field} is required`,
  invalidPhone: "Please enter a valid 10-digit Indian phone number",
  invalidEmail: "Please enter a valid email address",
  invalidOTP: "Please enter a valid 6-digit OTP",
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must not exceed ${max} characters`,
  ageRange: "Age must be between 5 and 80",
};
