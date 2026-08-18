import React from 'react';
import { motion } from 'framer-motion';
import {Grid} from '@/components/common';

export default function CookieMatrix() {
  const matrixData = [
    { token: "__devsphere_session", type: "Essential", duration: "Persistent", function: "Maintains active encrypted state mapping for verified node profiles." },
    { token: "__oauth_state", type: "Security", duration: "15 Minutes", function: "Prevents Cross-Site Request Forgery (CSRF) anomalies during login sequencing." },
    { token: "__theme_vector", type: "Preferences", duration: "1 Year", function: "Locks workspace canvas configuration parameters to deep dark UI states." },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507] text-gray-300">
      <Grid />

      <div className="max-w-5xl mx-auto w-full px-6 md:px-12 relative z-10 pt-28 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full text-left font-sans"
        >
          {/* Section Marker */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-gray-500">MTX-03</span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Storage Variables</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Cookie Telemetry Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-8 max-w-2xl">
            A granular overview of the specific storage strings initialized by our server clusters to keep platform interaction states uniform and fully secure.
          </p>

          {/* Responsive Technical Table */}
          <div className="w-full border border-white/[0.06] bg-black/20 backdrop-blur-2xl rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Cookie String Identification</th>
                    <th className="p-4 font-semibold">Classification</th>
                    <th className="p-4 font-semibold">Lifespan</th>
                    <th className="p-4 font-semibold">Operational Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-gray-300">
                  {matrixData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 text-white font-medium">{row.token}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400">
                          {row.type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{row.duration}</td>
                      <td className="p-4 font-sans text-xs text-gray-400 leading-relaxed max-w-xs">{row.function}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}