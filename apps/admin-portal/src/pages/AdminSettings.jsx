import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { changePassword } from "../services/api";
import { User, Lock, LogOut, Save, Loader2, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

const inputCls = "w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm text-text-light mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className={`${inputCls} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function LogoutModal({ onConfirm, onClose }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl p-6 text-center shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Sign Out</h3>
          <p className="text-sm text-white/50 mb-6">Are you sure you want to end your admin session?</p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminSettings() {
  const { user, logout } = useAuth();

  // Password change
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]             = useState("");
  const [confirmPassword, setConfirmPassword]     = useState("");
  const [saving, setSaving]                       = useState(false);
  const [message, setMessage]                     = useState(null);
  const [showLogoutModal, setShowLogoutModal]     = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password" });
      return;
    }

    try {
      setSaving(true);
      await changePassword({ currentPassword, newPassword });
      setMessage({ type: "success", text: "Password updated successfully! Please use your new password on next login." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to change password";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const passwordStrength = (pw) => {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak",   color: "bg-red-500",    width: "w-1/4" };
    if (score === 2) return { label: "Fair",   color: "bg-amber-500",  width: "w-2/4" };
    if (score === 3) return { label: "Good",   color: "bg-blue-500",   width: "w-3/4" };
    return              { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <h1 className="text-2xl font-bold font-heading text-text mb-6">Settings</h1>

      {/* Admin Profile */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/15 rounded-xl">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-text">Admin Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-blue-400">
              {(user?.fullName || user?.name || "A").charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-text">{user?.fullName || user?.name || "Administrator"}</p>
            <p className="text-sm text-text-light">{user?.email || "admin@avirtrekkers.com"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Email",  value: user?.email || "—" },
            { label: "Name",   value: user?.fullName || user?.name || "Administrator" },
            { label: "Role",   value: user?.role || "Admin", icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
              <p className="text-xs text-white/40 mb-0.5">{label}</p>
              <div className="flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
                <p className="text-sm font-medium text-text capitalize">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/15 rounded-xl">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-text">Change Password</h2>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mb-4 flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${
                message.type === "error"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {message.type === "error"
                ? <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                : <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="ml-auto hover:opacity-70 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min. 6 chars)"
          />

          {/* Password strength indicator */}
          {newPassword && strength && (
            <div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
              </div>
              <p className="text-xs text-white/40 mt-1">Strength: <span className="text-white/60">{strength.label}</span></p>
            </div>
          )}

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          {/* Match indicator */}
          {confirmPassword && newPassword && (
            <p className={`text-xs ${confirmPassword === newPassword ? "text-emerald-400" : "text-red-400"}`}>
              {confirmPassword === newPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Sign Out */}
      <div className="glass-card rounded-2xl border border-red-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text">Sign Out</h2>
            <p className="text-sm text-text-light mt-0.5">End your current admin session</p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={logout}
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </motion.div>
  );
}
