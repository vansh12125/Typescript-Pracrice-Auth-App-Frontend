import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Heart,
  MessageSquare,
  AlertCircle,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Grid } from "@/components/common";
import { useAuth } from "@/hooks";
import { FloatingNav, Avatar, ShareBtn } from "@/components/ui";
import {
  getPost,
  likePost,
  unLikePost,
  addComment,
  deleteComment,
  getAllComments,
} from "@/service/PostService";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const menuRef = useRef(null);
  const currentUserId = user?.userId || user?.id || user?._id;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPostDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getPost(postId);
      if (!response?.data?.data) {
        throw new Error("No data found.");
      }

      const postData = response.data.data;

      const commentResponse = await getAllComments(postData._id);

      const likes = Array.isArray(postData.likes) ? postData.likes : [];
      const postComments = Array.isArray(commentResponse.data.data)
        ? commentResponse.data.data
        : [];

      const normalizedData = {
        ...postData,
        id: postData._id || postData.id,
        likes,
        hasLiked: likes.includes(currentUserId),
      };

      setPost(normalizedData);
      setComments(postComments);
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
    if (!currentUserId || !post?.id) return;

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

      const data = response?.data?.data;
      if (!data) throw new Error("Invalid like response");

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment || !currentUserId) return;

    try {
      setIsSubmittingComment(true);
      const response = await addComment({
        postId: post.id,
        content: commentText.trim(),
      });

      const createdComment = response?.data?.data;

      const newEntry = createdComment || {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
        userData: {
          _id: currentUserId,
          id: currentUserId,
          name: user?.name || "You",
          username: user?.username || "you",
          avatar: user?.avatar,
        },
      };

      setComments((prev) => [newEntry, ...prev]);
      setCommentText("");
      setIsCommentFocused(false);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeletingCommentId(commentId);
      const res=await deleteComment({postId:post.id, commentId});
      console.log(res.data);
      
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId));
      setActiveMenuId(null);
    } catch (err) {
      console.log(err.response);
      
      console.error("Failed to delete comment:", err);
    } finally {
      setDeletingCommentId(null);
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

  const postOwnerId =
    post?.userData?._id || post?.userData?.id || post?.userId || post?.authorId;

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
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 pt-32 md:pt-40 pb-32 overflow-x-hidden">
      <Grid />

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 relative z-10 space-y-6">
        {/* Back Button */}
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
                  <span>{post.likes?.length || 0} Likes</span>
                </button>

                <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>{comments.length} Comments</span>
                </div>
              </div>

              <ShareBtn text={window.location.href} />
            </div>
          </motion.div>
        )}

        {/* Comment Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
            <h3 className="text-sm font-mono tracking-wider text-white uppercase flex items-center space-x-2">
              <span>Discussion</span>
              <span className="text-xs text-gray-500 font-normal">
                ({comments.length})
              </span>
            </h3>
          </div>

          {/* YouTube-style Comment Input */}
          <div className="flex items-start space-x-3.5">
            <Avatar
              src={user?.avatar}
              alt={user?.name || "Current User"}
              className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0 mt-0.5"
            />

            <div className="flex-1">
              <form onSubmit={handleAddComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => setIsCommentFocused(true)}
                  placeholder="Add a comment..."
                  rows={isCommentFocused || commentText ? 2 : 1}
                  className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none border-b border-white/10 focus:border-white/40 transition-all resize-none py-1.5 leading-relaxed font-sans"
                />

                <AnimatePresence>
                  {(isCommentFocused || commentText.trim().length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-end space-x-2 pt-3 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCommentText("");
                          setIsCommentFocused(false);
                        }}
                        className="px-3.5 py-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer rounded-lg"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !commentText.trim() ||
                          isSubmittingComment ||
                          !currentUserId
                        }
                        className="px-4 py-1.5 bg-white text-black font-semibold text-xs font-mono rounded-lg transition-all hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed flex items-center space-x-1.5"
                      >
                        {isSubmittingComment && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        <span>Comment</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* Comments Feed List */}
          <div className="space-y-6 pt-2">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-gray-500">
                No comments yet. Start the conversation!
              </div>
            ) : (
              comments.map((comment) => {
                const commentId = comment._id || comment.id;
                const commentAuthorId =
                  comment.userData?._id ||
                  comment.userData?.id ||
                  comment.userId ||
                  comment.authorId;

                const isAuthor =
                  currentUserId &&
                  String(commentAuthorId) === String(currentUserId);
                const isPostAuthor =
                  currentUserId &&
                  String(postOwnerId) === String(currentUserId);
                const canDelete = isAuthor || isPostAuthor;

                return (
                  <div
                    key={commentId}
                    className="flex items-start justify-between space-x-3 group text-left relative"
                  >
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <Link to={`/u/${comment.userData?.username}`}>
                        <Avatar
                          src={comment.userData?.avatar}
                          alt={comment.userData?.name || "User"}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0 mt-0.5"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Link
                            to={`/u/${comment.userData?.username}`}
                            className="text-xs font-bold text-white hover:underline truncate"
                          >
                            {comment.userData?.name || "Anonymous User"}
                          </Link>

                          {String(postOwnerId) === String(commentAuthorId) && (
                            <span className="text-[9px] font-mono uppercase bg-white/10 text-gray-300 px-1.5 py-0.2 rounded border border-white/10">
                              Author
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-wrap break-words">
                          {comment.text || comment.content}
                        </p>
                      </div>
                    </div>

                    {/* Three-Dot Menu (Accessible to Comment Owner OR Post Owner) */}
                    {canDelete && (
                      <div className="relative shrink-0 ml-2" ref={menuRef}>
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === commentId ? null : commentId,
                            )
                          }
                          className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === commentId && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-1 w-32 rounded-xl bg-[#0e0e11] border border-white/10 shadow-2xl py-1 z-30 backdrop-blur-xl"
                            >
                              <button
                                onClick={() => handleDeleteComment(commentId)}
                                disabled={deletingCommentId === commentId}
                                className="w-full px-3 py-1.5 text-[11px] font-mono text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center space-x-2 transition-colors cursor-pointer text-left"
                              >
                                {deletingCommentId === commentId ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-red-400" />
                                ) : (
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                )}
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      <FloatingNav />
    </div>
  );
}
