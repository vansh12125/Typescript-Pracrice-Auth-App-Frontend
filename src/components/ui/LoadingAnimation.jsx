import { motion } from "framer-motion";
import React from "react";
const LoadingAnimation = ({
  fullScreen = true,
  message = "Loading system...",
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 w-full h-full min-h-screen bg-[#050507] z-50 flex flex-col items-center justify-center select-none"
    : "w-full h-full min-h-[200px] flex flex-col items-center justify-center select-none bg-transparent";
  return (
    <div className={containerClasses}>
      {}
      {fullScreen && (
        <div
          className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}
      {}
      <div className="relative w-24 h-24 flex items-center justify-center z-10">
        {}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute w-20 h-20 rounded-full border border-dashed border-white/20"
        />
        {}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute w-14 h-14 rounded-full border border-t-white/40 border-r-transparent border-b-white/10 border-l-transparent"
        />
        {}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-6 text-center z-10"
      >
        <p className="text-[10px] font-mono tracking-[0.2em] text-white uppercase font-medium animate-pulse">
          {message}
        </p>
        {}
        <span className="text-[8px] font-mono text-gray-600 tracking-wider block mt-1.5">
          STATUS
        </span>
      </motion.div>
    </div>
  );
};
export default LoadingAnimation;
