import React from 'react';
import { motion } from 'framer-motion';
import {RobotScene3D} from '@/components/three';
export default function Contacts() {
  return (
  <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#050507]">
      {}
      <RobotScene3D />
      {}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-screen pt-20 pb-16 pointer-events-none">
        {}
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-5 w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-2xl mx-auto max-w-md lg:mx-0 text-left pointer-events-auto relative z-20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-gray-500">03</span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">System Linking</span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">Ping Cluster Admin</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Open a secure messaging terminal connection route.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">Identity Handle</label>
              <input 
                type="text" 
                id="contact-name"
                autoComplete="name"
                className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                placeholder="Vansh Sahu"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">Comms Endpoint (Email)</label>
              <input 
                type="email" 
                id="contact-email"
                autoComplete="email"
                className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                placeholder="vansh@devsphere.io"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1">Data Payload (Message)</label>
              <textarea 
                id="contact-message"
                rows="4"
                className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono resize-none"
                placeholder="Type your system query here..."
                required
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors tracking-wide mt-2 shadow-lg">
              Broadcast Message
            </button>
          </form>
        </motion.div>
        {}
        <div className="lg:col-span-7 h-[100px] lg:h-auto pointer-events-none" />
      </div>
    </div>
  );
}