import React from "react";
import { motion } from "framer-motion";
import { Settings, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, usePosts } from "@/hooks";
import { Avatar, ShareBtn } from "@/components/ui";
export default function ProfileHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts } = usePosts();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
      >
        {}

        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 min-w-0 flex-1">
          <Avatar className="w-16 h-16 text-xl shrink-0" rounded="rounded-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight truncate">
                {user?.name}
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono font-medium rounded bg-white/5 border border-white/5 text-gray-400 flex items-center gap-1 shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate flex gap-4 items-center">
              u/{user?.username}
              <span>
                •{" "}
                <span>
                  Joined{" "}
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>
            </p>

            <button
              onClick={() => navigate("/my-posts")}
              className="inline-flex items-center space-x-1.5 mt-2 px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-md text-[11px] font-mono text-gray-400 hover:text-white transition-all cursor-pointer group"
            >
              <FileText className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
              <span>
                {posts?.length === 0
                  ? user?.userPosts?.length || 0
                  : posts?.length || 0}{" "}
                Posts
              </span>
            </button>
            {user?.bio && (
              <p className="text-xs text-gray-400 font-mono mt-3 break-words line-clamp-2 max-w-sm sm:max-w-md mx-auto sm:mx-0">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        {}
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto shrink-0">
          <ShareBtn
            text={`${window.location.origin}/u/${user?.username}`}
            want-bg={true}
          />
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors shadow-lg cursor-pointer whitespace-nowrap"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
