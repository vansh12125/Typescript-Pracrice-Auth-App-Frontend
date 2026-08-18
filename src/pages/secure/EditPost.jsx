import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CircleCheck,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import { Grid } from "@/components/common";
import { useAuth } from "@/hooks";
import { getPostByIdAndValidateUser, updatePost } from "@/service/PostService";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invalidPost, setInvalidPost] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getPostByIdAndValidateUser(postId);

      if (!response.data.data) {
        throw new Error("Post data empty");
      }

      setTitle(response.data.data.title);
      setContent(response.data.data.content);
      setIsPublic(
        response.data.data.isPublic !== undefined
          ? response.data.data.isPublic
          : true,
      );
      setIsLoading(false);
    } catch (err) {
      setError("Invalid Post ID. Redirecting to home...");
      setInvalidPost(true);
      setIsLoading(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating || invalidPost) return;

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

    if (postTitle.length > 40) {
      setError("Title cannot exceed 40 characters.");
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

    setIsUpdating(true);

    try {
      const updatedData = {
        title: postTitle,
        content: postContent,
        isPublic: isPublic,
        userId: user?.userId || user?.id,
      };
      await updatePost(postId, updatedData);
      setSuccess("Post updated successfully.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update post.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-gray-500 font-mono text-[10px] uppercase tracking-widest">
        <Grid />
        <Loader2 className="w-5 h-5 text-white/40 animate-spin mb-3" />
        <span>Fetching publication data...</span>
      </div>
    );
  }

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

          {!invalidPost && (
            <>
              <div className="mb-8 border-b border-white/[0.04] pb-4">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Edit Publication Settings
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Modify parameters or visibility properties of your post entry.
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
                    disabled={isUpdating}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-lg"
                  >
                    {isUpdating ? (
                      <span className="font-mono text-[11px]">Updating...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Update Post</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
