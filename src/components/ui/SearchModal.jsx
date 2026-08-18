import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  User,
  FileText,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const handleSelectResult = (path) => {
    onClose();
    navigate(path);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-28 px-4 sm:px-6">
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#09090d]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-left backdrop-blur-2xl"
          >
            {}
            <div className="relative flex items-center px-5 py-4 border-b border-white/[0.06]">
              <Search className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search developers, posts, or keywords..."
                className="w-full bg-transparent text-sm md:text-base text-white placeholder-gray-500 font-mono focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-500 hover:text-white transition-colors mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ESC
              </button>
            </div>
            {}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 font-mono text-xs text-gray-300 scrollbar-thin scrollbar-thumb-white/10">
              {query.trim() === "" ? (
                <div className="py-6 text-center space-y-4">
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest">
                    Quick Suggestions
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Java", "React", "Python", "Community Feeds"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 px-2 py-1">
                    Matching Results
                  </div>
                  {}
                  <div
                    onClick={() => handleSelectResult(`/u/${query}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <User className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="truncate">
                        <p className="text-white font-semibold text-xs truncate">
                          User: @{query.toLowerCase().replace(/\s+/g, "_")}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          View profile details and posts
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                  </div>
                  {}
                  <div
                    onClick={() => {                    
                        handleSelectResult(`/feed?q=${query.trim().toLowerCase()}`)
                    }}

                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="truncate">
                        <p className="text-white font-semibold text-xs truncate">
                          Search "{query}" inside Community Feed
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          Filter publications by tag
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                  </div>
                </div>
              )}
            </div>
            {}
            <div className="px-5 py-3 border-t border-white/[0.04] bg-black/20 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">
                    <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>{" "}
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">
                    ESC
                  </kbd>{" "}
                  Close
                </span>
              </div>
              <span className="hidden sm:inline">DevSphere Search Matrix</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
