import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Radio, Terminal } from 'lucide-react';

export default function DeveloperMetrics() {
  const hardwareData = [
    { title: "Indexed Query Metrics", count: "1,482", subset: "+42 this window", icon: Terminal },
    { title: "Active Repository Syncs", count: "24 Nodes", subset: "All links aligned", icon: GitBranch },
    { title: "Average Telemetry Ping", count: "14.2ms", subset: "Stable performance", icon: Radio }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left"
    >
      <div className="mb-6 border-b border-white/[0.04] pb-4">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">Platform Interactivity Metrics</h2>
        <p className="text-xs text-gray-400 mt-0.5">Live workspace operational statistics feedback logs.</p>
      </div>

      <div className="space-y-4">
        {hardwareData.map((metric, idx) => {
          const IconMetric = metric.icon;
          return (
            <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-white/5 border border-white/5 rounded-lg text-gray-400">
                  <IconMetric className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">{metric.title}</span>
                  <span className="block text-xl font-bold text-white font-mono mt-0.5">{metric.count}</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                {metric.subset}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}