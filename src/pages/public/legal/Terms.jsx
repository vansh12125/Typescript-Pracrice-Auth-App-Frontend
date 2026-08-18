import React from 'react';
import { motion } from 'framer-motion';
import {Grid} from '@/components/common';

export default function Terms() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507] text-gray-300">
      <Grid />

      <div className="max-w-4xl mx-auto w-full px-6 md:px-12 relative z-10 pt-28 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full text-left font-sans"
        >
          {/* Section Marker */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-gray-500">TOS-02</span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Usage Protocols</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8">
            Terms of Service Guidelines
          </h1>

          {/* Terms Scrollable Box */}
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-gray-400 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">1. Node Account Integrity</h2>
              <p>
                By instantiating an account vector inside DevSphere, you verify that all supplied identifiers and communications routes are valid. Users remain fully responsible for the absolute security configurations of their local sessions.
              </p>
            </section>

            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">2. Acceptable Code Flow</h2>
              <p>
                The platform is allocated for collaborative development, discussion sharing, and technical documentation mapping. Clandestine scripts, high-volume automated bot injection attacks, or malicious endpoint scanning operations will trigger immediate account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">3. Platform Telemetry Limitations</h2>
              <p>
                DevSphere services are delivered on an "as-is" and "as-available" computational framework matrix. We retain structural authorization to balance cluster loads or modify route indexing priorities without prior node warning.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}