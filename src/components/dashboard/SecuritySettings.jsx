import React from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/hooks";

export default function SecuritySettings() {
  const { user } = useAuth();
  const provider = user?.provider ? [...user.provider] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left"
    >
      <div className="mb-4 border-b border-white/[0.04] pb-4">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
          Account Security
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your connected social accounts.
        </p>
      </div>
      <div className="space-y-3">
        {}
        <div className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <KeyRound className="w-4 h-4 text-gray-500" />
            <div>
              <span className="block text-xs text-white font-medium">
                Google Account
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {provider.includes("GOOGLE")
                  ? "Linked to your Google account."
                  : "Not connected to Google."}
              </span>
            </div>
          </div>
          {provider.includes("GOOGLE") ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 select-none">
              CONNECTED
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 select-none">
              DISCONNECTED
            </span>
          )}
        </div>
        {}
        <div className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <KeyRound className="w-4 h-4 text-gray-500" />
            <div>
              <span className="block text-xs text-white font-medium">
                GitHub Account
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {provider.includes("GITHUB")
                  ? "Linked to your GitHub account."
                  : "Not connected to GitHub."}
              </span>
            </div>
          </div>
          {provider.includes("GITHUB") ? (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 select-none">
              CONNECTED
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 select-none">
              DISCONNECTED
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
