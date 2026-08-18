import React from "react";
import { motion } from "framer-motion";
import { Grid } from "@/components/common/";
import {FloatingNav} from "@/components/ui"
import {
  AccountDetails,
  DeveloperMetrics,
  ProfileHeader,
  SecuritySettings,
} from "@/components/dashboard";
import {PenSquare} from "lucide-react"
import { useNavigate } from "react-router-dom";
export default function ProfileDashboard() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full bg-[#050507] text-gray-300 overflow-x-hidden antialiased flex flex-col pt-24 pb-16">
      {}
    
      <Grid />
      <FloatingNav/>
      {}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 flex-grow">
        {}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 mb-6"
        >
          <span className="text-[10px] font-mono tracking-widest text-gray-500">
            DSH-01
          </span>
          <div className="h-[1px] w-12 bg-gray-800" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
            User Control Panel
          </span>
        </motion.div>
        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {}
          <div className="lg:col-span-12">
            <ProfileHeader />
          </div>
          {}
          <div className="lg:col-span-7 space-y-6">
            <AccountDetails  />
            <SecuritySettings  />
          </div>
          {}
          <div className="lg:col-span-5">
            <DeveloperMetrics />
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/create-post")}
        className="fixed bottom-8 right-8 z-40 flex items-center space-x-2 bg-white text-black font-semibold text-xs px-5 py-3.5 rounded-full shadow-2xl hover:bg-gray-200 transition-colors duration-200 cursor-pointer pointer-events-auto"
      >
        <PenSquare className="w-4 h-4" />
        <span>Create Post</span>
      </motion.button>
    </div>
  );
}
