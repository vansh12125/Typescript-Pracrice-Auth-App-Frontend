import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Clock,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Grid } from "@/components/common";
import { useAuth } from "@/hooks";
import { FloatingNav, Avatar, ShareBtn } from "@/components/ui";
import { getUserProfileByUsername } from "@/service/UserService";
import {
  getAllPublicPostByUser,
  likePost,
  unLikePost,
} from "@/service/PostService";
export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const currentUserId = user?.userId || user?.id;
  useEffect(() => {
    fetchProfile();
    setShowPosts(false);
    setPosts([]);
  }, [username]);
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getUserProfileByUsername(username);

      setProfile(response.data.data);
    } catch (err) {
      setError("User identity profile not found inside the network grid.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleTogglePosts = async () => {
    if (showPosts) {
      setShowPosts(false);
      return;
    }
    if (posts.length === 0) {
      try {
        setIsLoadingPosts(true);
        const targetId = profile?.userId || profile?.id || profile?._id;
        const response = await getAllPublicPostByUser(targetId);

        const normalizedPosts = (response.data.data || []).map((post) => ({
          ...post,
          id: post._id,
          likes: Array.isArray(post.likes) ? post.likes : [],
          hasLiked:
            Array.isArray(post.likes) && post.likes.includes(currentUserId),
        }));
        setPosts(normalizedPosts);
      } catch (err) {
      } finally {
        setIsLoadingPosts(false);
      }
    }
    setShowPosts(true);
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
  const handleLike = async (postId) => {
    if (!currentUserId) return;
    const previousPosts = [...posts];
    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) return post;
      const liked = post.likes.includes(currentUserId);
      return {
        ...post,
        likes: liked
          ? post.likes.filter((id) => id !== currentUserId)
          : [...post.likes, currentUserId],
        hasLiked: !liked,
      };
    });
    setPosts(updatedPosts);
    try {
      const clickedPost = previousPosts.find((p) => p.id === postId);
      if (clickedPost.likes.includes(currentUserId)) {
        await unLikePost(postId, currentUserId);
      } else {
        await likePost(postId, currentUserId);
      }
    } catch (error) {
      setPosts(previousPosts);
    }
  };
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-gray-500 font-mono text-[10px] tracking-widest uppercase">
        <Grid />
        <Loader2 className="w-5 h-5 text-white/45 animate-spin mb-3" />
        <span>Syncing Registry Details...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-gray-400 font-mono text-xs">
        <Grid />
        <AlertCircle className="w-8 h-8 text-red-500/80 mb-3" />
        <p>{error}</p>
        <button
          onClick={() => navigate("/feed")}
          className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs transition-colors hover:bg-gray-200 cursor-pointer"
        >
          Return to Feed
        </button>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 pt-40 pb-32 overflow-x-hidden">
      <Grid />
      <div className="max-w-3xl mx-auto w-full px-6 relative z-10 space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-mono text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-xl text-left"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <Avatar
              src={profile?.avatar || profile?.pictureUrl}
              alt={profile?.name}
              className="w-20 h-20 text-2xl shrink-0 border border-white/10"
              rounded="rounded-2xl"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight truncate">
                  {profile?.name}
                </h1>
                <div className="flex justify-center sm:justify-start">
                  {profile?.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-mono uppercase tracking-wider">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono uppercase tracking-wider"
                      title="Email Is Unverified"
                    >
                      <HelpCircle className="w-2.5 h-2.5" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-mono truncate">
                u/{profile?.username}
              </p>
              {profile?.bio && (
                <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1 max-w-xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 pt-3 text-[10px] font-mono text-gray-500 border-t border-white/[0.04] mt-2">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined{" "}
                    {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <ShareBtn
                text={`${window.location.origin}/u/${profile?.username}`}
                want-bg={true}
              />
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/[0.04] flex justify-center sm:justify-end">
            <button
              onClick={handleTogglePosts}
              disabled={isLoadingPosts}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono border tracking-wide transition-all duration-300 cursor-pointer ${
                showPosts
                  ? "bg-white text-black border-white font-semibold"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {isLoadingPosts ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>
                {isLoadingPosts ? "Querying Matrix..." : "Show Publications"}
              </span>
              {!isLoadingPosts &&
                (showPosts ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                ))}
            </button>
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          {showPosts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-4 w-full"
            >
              {posts.length === 0 ? (
                <div className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-12 text-center font-mono text-xs text-gray-500 shadow-xl">
                  No Post Available.
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center space-x-1.5 mt-2 px-1 py-0.5 text-[15px] font-mono text-gray-400 select-none mb-3">
                    <FileText className="w-4 h-4 text-white/20" />
                    <span className="text-white font-semibold tracking-tight">
                      {posts?.length || 0}
                    </span>
                    <span className="text-gray-500 text-[15px] uppercase">
                      posts
                    </span>
                  </div>
                  {posts.map((post) => {
                    return (
                      <div
                        className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left mb-2"
                        key={post._id}
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                        <Link to={`${window.location.origin}/post/${post._id}`}>
                          <div className="mb-5">
                            <h3 className="text-base font-bold text-white mb-1.5 tracking-tight leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-300 leading-relaxed font-sans">
                              {post.content}
                            </p>
                          </div>
                        </Link>
                        <div className="flex items-center gap-5 pt-3.5 border-t border-white/[0.04]">
                          <button
                            onClick={() => handleLike(post.id)}
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
                          <span className="text-xs font-mono">{post.comments.length} Comments</span>
                          <ShareBtn
                            text={`${window.location.origin}/post/${post._id}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FloatingNav />
    </div>
  );
}
