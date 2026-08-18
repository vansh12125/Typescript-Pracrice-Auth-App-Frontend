import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Heart,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Grid } from "@/components/common";
import { useAuth } from "@/hooks";
import { FloatingNav, Avatar, ShareBtn } from "@/components/ui";
import { getPost, likePost, unLikePost } from "@/service/PostService";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = user?.userId || user?.id;

  const fetchPostDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getPost(postId);
      if (!response.data.data) {
        throw new Error("No data found.");
      }

      const postData = response.data.data;

      const likes = Array.isArray(postData.likes)
        ? postData.likes
        : [];

      const normalizedData = {
        ...postData,

        id: postData._id,

        likes,

        hasLiked: likes.includes(currentUserId),
      };

      setPost(normalizedData);
    } catch (err) {
      setError(
        err?.response?.data?.errors ||
          "This post could not be found. It might have been deleted.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleLike = async () => {
    if (!currentUserId || !post || !post.id) return;

    const previouslyLiked = post.hasLiked;

    const backupPostState = { ...post };

    setPost((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        likes: previouslyLiked
          ? prev.likes.filter((id) => id !== currentUserId)
          : [...prev.likes, currentUserId],

        hasLiked: !previouslyLiked,
      };
    });

    try {
      const response = previouslyLiked
        ? await unLikePost(post.id)
        : await likePost(post.id);

      const data = response.data.data;

      if (!data) {
        throw new Error("Invalid like response");
      }

      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          likes: Array.isArray(data.likes) ? data.likes : [],
          hasLiked: data.hasLiked,
        };
      });
    } catch (err) {

      setPost(backupPostState);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-gray-500 font-mono text-[11px] tracking-wider uppercase">
        <Grid />
        <Loader2 className="w-5 h-5 text-white/45 animate-spin mb-3" />
        <span>Loading post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-gray-400 font-sans text-sm px-6 text-center">
        <Grid />
        <AlertCircle className="w-8 h-8 text-red-500/80 mb-3" />
        <p className="max-w-md">{error}</p>

        <button
          onClick={() => navigate("/feed")}
          className="mt-6 px-5 py-2 bg-white text-black font-semibold rounded-lg text-xs transition-colors hover:bg-gray-200 cursor-pointer shadow-lg"
        >
          Go Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 pt-40 pb-32 overflow-x-hidden">
      <Grid />

      <div className="max-w-3xl mx-auto w-full px-6 relative z-10 space-y-4">
        {/* Simple Back Button */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Post Card */}
        {post && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl text-left"
          >
            {/* Author Block */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.04]">
              <Link to={`/u/${post.userData?.username}`}>
                <div className="flex items-center space-x-3 group">
                  <Avatar
                    src={post.userData?.avatar}
                    alt={post.userData?.name || "User"}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10 group-hover:border-white/20 transition-colors"
                  />

                  <div>
                    <span className="block text-sm font-bold text-white group-hover:underline">
                      {post.userData?.name || "Anonymous User"}
                    </span>

                    <span className="block text-[10px] font-mono text-gray-400">
                      @{post.userData?.username || "unknown"}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center space-x-1.5 text-gray-500 font-mono text-[10px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Title & Body */}
            <div className="mb-8 space-y-3">
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {post.title}
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <div className="flex items-center space-x-6">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 text-xs font-mono transition-colors group cursor-pointer ${
                    post.hasLiked
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 group-active:scale-90 ${
                      post.hasLiked
                        ? "fill-current text-red-500"
                        : "text-gray-500"
                    }`}
                  />

                  <span>{post.likes.length} Likes</span>
                </button>

                {/* Comment Button */}
                <button className="flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>Comments(NA)</span>
                </button>
              </div>

              {/* Share Button Component */}
              <ShareBtn text={window.location.href} />
            </div>
          </motion.div>
        )}
      </div>

      <FloatingNav />
    </div>
  );
}