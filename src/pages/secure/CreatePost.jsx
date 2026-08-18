import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CircleCheck,
  Globe,
  Lock,
} from "lucide-react";
import { Grid } from "@/components/common";
import { useAuth } from "@/hooks";
import { createPost } from "@/service/PostService";
export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const { user,dispatch } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPublishing) {
      return;
    }
    setError("");
    setSuccess("");

    const postTitle = title.trim();
    const postContent = content.trim();
    if (!postTitle) {
      setError("Title is required.");
      return;
    }

    if (postTitle.length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }

    if (postTitle.length > 100) {
      setError("Title cannot exceed 100 characters.");
      return;
    }

    if (!postContent) {
      setError("Content is required.");
      return;
    }

    if (postContent.length < 5) {
      setError("Content must be at least 5 characters.");
      return;
    }

    if (postContent.length > 1000) {
      setError("Content cannot exceed 1000 characters.");
      return;
    }

    setIsPublishing(true);

    try {
      const postData = {
        title: postTitle,
        content: postContent,
        isPublic: isPublic,
      };
      const response=await createPost(postData);
      
      setSuccess("Post created successfully.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setError(err.response?.data?.errors || "Unable to create post.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507] text-gray-300 pt-24 pb-16">
      <Grid />

      <div className="max-w-3xl mx-auto w-full px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl text-left"
        >
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
          <div className="mb-8 border-b border-white/[0.04] pb-4">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create New Post
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Share your thoughts or ideas with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="post-title"
                className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="post-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="post-content"
                className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
              >
                Content
              </label>
              <textarea
                name="content"
                id="post-content"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono resize-none leading-relaxed"
                placeholder="Type your content here..."
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border text-xs font-mono transition-all ${
                    isPublic
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-black/20 text-gray-400 border-white/5 hover:border-white/10"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border text-xs font-mono transition-all ${
                    !isPublic
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-black/20 text-gray-400 border-white/5 hover:border-white/10"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.04]">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPublishing}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-lg"
              >
                {isPublishing ? (
                  <span className="font-mono text-[11px]">Publishing...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
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
