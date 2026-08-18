import React from 'react';
import { motion } from 'framer-motion';
import {RobotScene3D} from '@/components/three';
export default function About() {
  return (
   <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#050507]">
      
      <RobotScene3D />
      
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-screen pt-20 pb-16 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-6 w-full text-left pointer-events-auto select-text"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-gray-500">02</span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">System Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            The Autonomous Core <br />For Developer Logic.
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
            DevSphere acts as a decentralized communication cluster designed to map, index, and organize high-volume engineering discussions, questions, and open-source project frameworks.
          </p>
          <blockquote>
            <p className="text-xs font-mono text-gray-500 border-l border-white/10 pl-4 py-1 italic mb-8">
              "We process asynchronous developer data threads to optimize collaborative telemetry across the global network pipeline."
            </p>
          </blockquote>
          <div className="grid grid-cols-2 gap-4 max-w-sm border-t border-white/[0.06] pt-6 font-mono">
            <div>
              <span className="text-xl font-semibold text-white block">99.98%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Node Sync Uptime</span>
            </div>
            <div>
              <span className="text-xl font-semibold text-white block">24.5M</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Indexed Queries</span>
            </div>
          </div>
        </motion.div>
        
        <div className="lg:col-span-6 h-[100px] lg:h-auto pointer-events-none" />
      </div>
    </div>
  );
}