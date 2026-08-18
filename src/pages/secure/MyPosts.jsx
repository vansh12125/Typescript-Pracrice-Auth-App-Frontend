import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Globe,
  Lock,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CircleCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Grid } from "@/components/common";
import { FloatingNav, ShareBtn } from "@/components/ui";
import { usePosts, useAuth } from "@/hooks";

export default function MyPosts() {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const { posts, fetched, fetchPosts, deleteUserPost } = usePosts();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!fetched) {
      fetchPosts();
    }
  }, [fetched]);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUserPost(postToDelete);

      setSuccess("Post deleted successfully.");
    } catch (error) {

      setError(error.response?.data?.message || "Failed to delete post.");
    } finally {
      setPostToDelete(null);

      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 1500);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 pt-40 pb-32 overflow-x-hidden">
      <Grid />
      <div className="max-w-3xl mx-auto w-full px-6 relative z-10">
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
        <div className="mb-8 border-b border-white/[0.04] pb-4 text-left">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            My Publications
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage, modify, or remove content logs you published.
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
        {posts.length === 0 ? (
          <div className="backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-12 text-center shadow-xl">
            <p className="text-sm text-gray-500 font-mono">
              No Post Available.
            </p>
            <Link
              to="/create-post"
              className="inline-block mt-4 text-xs font-mono bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 font-mono text-[10px] text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <span className="text-white/[0.08]">•</span>
                    <div className="flex items-center space-x-1 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">
                      {post.isPublic ? (
                        <>
                          <Globe className="w-3 h-3 text-emerald-500" />
                          <span className="text-[9px] uppercase tracking-wider text-emerald-400">
                            Public
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-amber-500" />
                          <span className="text-[9px] uppercase tracking-wider text-amber-400">
                            Private
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(post._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === post._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-1.5 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-2xl p-1 z-20 overflow-hidden"
                          >
                            {}
                            <Link
                              to={`/edit-post/${post._id}`}
                              onClick={() => setActiveDropdown(null)}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => {
                                setPostToDelete(post._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer border-t border-white/[0.04]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-base font-bold text-white mb-2 tracking-tight leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {post.content}
                  </p>
                </div>
                <div className="flex items-center pt-4 border-t border-white/[0.04] gap-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                    <span>{post.likes?.length || 0} Likes</span>
                  </div>
                  <ShareBtn
                    text={`${window.location.origin}/post/${post._id}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div
              className="absolute inset-0"
              onClick={() => setPostToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-[#0a0a0f]/90 border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative text-left backdrop-blur-2xl"
            >
              <div className="flex items-center space-x-2.5 text-red-400 mb-3 font-mono text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Action</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                Delete this publication?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mb-6">
                Are you sure? This file data entry will be permanently removed
                from the node database.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-lg font-mono"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <FloatingNav />
    </div>
  );
}
