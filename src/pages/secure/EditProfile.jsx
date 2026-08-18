import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertCircle, CircleCheck } from "lucide-react";
import { Grid } from "@/components/common";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/hooks";
import { UpdateProfile } from "@/service";
import { updateUser } from "@/redux";

export default function EditProfile() {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
  });

  const hasChanges = useMemo(() => {
    return (
      formData.name.trim() !== user.name.trim() ||
      formData.username.trim() !== user.username.trim() ||
      formData.bio.trim() !== user.bio.trim()
    );
  }, [formData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving || !hasChanges) return;

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const username = formData.username.trim();
    const bio = formData.bio.trim();

    if (!name) {
      setError("Full name is required.");
      return;
    }

    if (name.length < 3) {
      setError("Full name must be at least 3 characters.");
      return;
    }

    if (name.length > 50) {
      setError("Full name cannot exceed 50 characters.");
      return;
    }

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (username.length > 25) {
      setError("Username cannot exceed 25 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setError("Username may contain only letters, numbers, '.' and '_'.");
      return;
    }

    if (bio.length > 150) {
      setError("Bio cannot exceed 150 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await UpdateProfile({
        name,
        username,
        bio,
      });

      dispatch(updateUser(response.data.data));

      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.errors || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507] text-gray-300">
      <Grid />

      <div className="max-w-3xl mx-auto w-full px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl text-left"
        >
          <div className="mb-6 border-b border-white/[0.04] pb-4">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Edit Profile Settings
            </h1>

            <p className="text-xs text-gray-400 mt-0.5">
              Update your personal details and profile information.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2.5 text-xs text-red-400 font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-2.5 text-xs text-green-400 font-mono"
            >
              <CircleCheck className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.01] border border-white/5 rounded-xl p-4">
              <div className="relative select-none">
                <Avatar className="w-16 h-16 text-xl" rounded="rounded-xl" />
              </div>

              <div className="text-center sm:text-left">
                <span className="block text-xs text-white font-medium">
                  Profile Picture
                </span>

                <span className="block text-[10px] text-gray-500 mt-0.5">
                  Profile picture editing will be available soon.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                  Bio / About Me
                </label>

                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transition-all duration-200 ${
                  isSaving || !hasChanges
                    ? "bg-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {isSaving ? (
                  <span className="font-mono text-[11px]">Saving...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
