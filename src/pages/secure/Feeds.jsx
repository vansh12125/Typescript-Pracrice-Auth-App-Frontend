import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Clock,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

import { Grid } from "@/components/common";
import { FloatingNav, Avatar, ShareBtn } from "@/components/ui";
import { useDispatch } from "react-redux";
import { useAuth, useFeedPost } from "@/hooks";
import { updatePostLikes } from "@/redux";

import { likePost, unLikePost } from "@/service/PostService";

export default function Feeds() {
  const [error, setError] = useState("");

  const { user } = useAuth();
  const dispatch = useDispatch();
  const currentUserId = user?.userId || user?.id;

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";

  const { posts, fetched, fetchPosts, loading } = useFeedPost();

  useEffect(() => {
    if (!fetched) {
      fetchPosts();
    }
  }, [fetched, fetchPosts]);

  const normalizedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,

      id: post.postId || post.id || post._id,

      likes: Array.isArray(post.likes) ? post.likes : [],

      hasLiked: Array.isArray(post.likes) && post.likes.includes(currentUserId),
    }));
  }, [posts, currentUserId]);

  const displayPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return normalizedPosts;
    }

    const query = searchQuery.trim().toLowerCase();

    const filtered = normalizedPosts.filter((post) => {
      return (
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.userData?.username?.toLowerCase().includes(query) ||
        post.userData?.name?.toLowerCase().includes(query)
      );
    });

    return filtered;
  }, [normalizedPosts, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() && fetched && displayPosts.length === 0) {
      setError(`No posts found matching "${searchQuery}"`);
    } else {
      setError("");
    }
  }, [searchQuery, fetched, displayPosts.length]);

  const handleLike = async (postId) => {
    if (!currentUserId) return;

    const post = normalizedPosts.find((post) => post.id === postId);

    if (!post) return;

    const alreadyLiked = post.likes.includes(currentUserId);

    dispatch(
      updatePostLikes({
        postId,
        userId: currentUserId,
        liked: !alreadyLiked,
      }),
    );

    try {
      if (alreadyLiked) {
        await unLikePost(postId, currentUserId);
      } else {
        await likePost(postId, currentUserId);
      }
    } catch (error) {
      console.error("Like/Unlike failed:", error);

      dispatch(
        updatePostLikes({
          postId,
          userId: currentUserId,
          liked: alreadyLiked,
        }),
      );
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
        <div className="mb-8 border-b border-white/[0.04] pb-4 text-left">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Community Feed
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Read the latest ideas, scripts, and updates from developers across
            the network.
          </p>
          <button
            className="mt-3 flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white "
            disabled={loading}
            onClick={() => {
              setSearchParams({});
              fetchPosts(true);
            }}
          >
            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Feed"}
          </button>

          {searchQuery && (
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>
                Search query:{" "}
                <strong className="text-white">"{searchQuery}"</strong>
              </span>

              <Link
                to="/feed"
                className="text-gray-500 hover:text-white underline"
              >
                Clear filter
              </Link>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2.5 text-xs text-red-400 font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />

              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {displayPosts.length === 0 && !error ? (
          <div className="text-left text-sm text-gray-500 font-mono">
            No Posts Available.
          </div>
        ) : (
          <div className="space-y-6">
            {displayPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left"
              >
                {/* User */}
                <div className="flex items-center justify-between mb-4">
                  <Link to={`/u/${post.userData?.username}`}>
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={post.userData?.avatar}
                        alt={post.userData?.name || "User"}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />

                      <div>
                        <span className="block text-sm font-semibold text-white">
                          {post.userData?.name || "Anonymous"}
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

                {/* Post */}
                <Link to={`/post/${post.id}`}>
                  <div className="mb-6 cursor-pointer group">
                    <h2 className="text-base font-bold text-white mb-2 tracking-tight leading-snug capitalize group-hover:text-gray-200 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 text-xs font-mono transition-colors cursor-pointer ${
                      post.hasLiked
                        ? "text-red-500 hover:text-red-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.hasLiked ? "fill-current text-red-500" : ""
                      }`}
                    />

                    <span>{post.likes.length}</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/post/${post.id}`}
                      className="flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />

                      <span>{post.comments.length} Comments</span>
                    </Link>

                    <ShareBtn
                      text={`${window.location.origin}/post/${post.id}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <FloatingNav />
    </div>
  );
}
