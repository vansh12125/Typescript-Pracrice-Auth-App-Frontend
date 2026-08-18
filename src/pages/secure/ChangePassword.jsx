import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { Grid } from "@/components/common";
import { FloatingNav } from "@/components/ui";
import { changePasswordRequest } from "@/service/AuthService";
export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Please enter your current password.";
    } else if (/\s/.test(formData.currentPassword)) {
      newErrors.currentPassword = "Password cannot contain spaces.";
    } else if (formData.currentPassword.length < 8) {
      newErrors.currentPassword =
        "Password must be at least 8 characters long.";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Please enter a new password.";
    } else if (/\s/.test(formData.newPassword)) {
      newErrors.newPassword = "Password cannot contain spaces.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword =
        "New password cannot be the same as your current password.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (/\s/.test(formData.confirmPassword)) {
      newErrors.confirmPassword = "Password cannot contain spaces.";
    } else if (formData.confirmPassword.length < 8) {
      newErrors.confirmPassword =
        "Password must be at least 8 characters long.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      await changePasswordRequest({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccessMsg("Your password has been changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setTimeout(() => {
        navigate("/settings");
      }, 2000);
    } catch (err) {
      setServerError(
        err.response?.data?.errors ||
          "Failed to change password. Please check your current password and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 pt-36 pb-32 overflow-x-hidden">
      <Grid />
      <div className="max-w-xl mx-auto w-full px-6 relative z-10 space-y-6 text-left">
        <Link
          to="/settings"
          className="inline-flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Settings</span>
        </Link>
        <div className="border-b border-white/[0.04] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Change Password
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Update your account password to keep your profile secure.
          </p>
        </div>
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-mono"
            >
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                onClick={() => setSuccessMsg("")}
                className="text-emerald-400/60 hover:text-emerald-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-xs text-red-400 font-mono"
            >
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{serverError}</span>
              </div>
              <button
                onClick={() => setServerError("")}
                className="text-red-400/60 hover:text-red-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              value={"user"}
              readOnly
              autoComplete="username"
              className="hidden"
            />
            {}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-gray-400">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-black/50 border rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none transition-all ${
                    errors.currentPassword
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-white/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("current")}
                  className="absolute right-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  title={
                    showPassword.current ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.currentPassword}</span>
                </p>
              )}
            </div>
            {}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-gray-400">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-black/50 border rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none transition-all ${
                    errors.newPassword
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-white/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  title={showPassword.new ? "Hide password" : "Show password"}
                >
                  {showPassword.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.newPassword}</span>
                </p>
              )}
            </div>
            {}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-gray-400">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-black/50 border rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-white/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  title={
                    showPassword.confirm ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
            {}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <FloatingNav />
    </div>
  );
}
