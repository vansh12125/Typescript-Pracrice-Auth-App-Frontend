import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import {RobotScene3D} from '@/components/three';
export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqData = [
    {
      q: "How does the DevSphere network node synchronization execute?",
      a: "DevSphere operates on an asynchronous data ledger loop. When you commit a thread or update a project, our cluster parses the runtime telemetry and mirrors it globally within 200ms across all active system nodes."
    },
    {
      q: "What security handles are utilized for repository integration?",
      a: "We deploy isolated cryptographic transport vectors. Authenticating via Google or GitHub handles creates a sandboxed access key that verifies alignment without exposing raw session configurations."
    },
    {
      q: "Can I host decentralized web application builds directly?",
      a: "Yes. The 'Projects' portal interfaces with active micro-hosting services, allowing you to deploy live PWAs, chat microservices, and static nodes directly from your linked dashboard terminal."
    },
    {
      q: "What criteria handles public directory thread indexing?",
      a: "Telemetry is sorted using an internal sorting velocity logic. Threads that receive high structural interactions are prioritized to help developer teams resolve kernel anomalies faster."
    }
  ];
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#050507]">
      <RobotScene3D />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-screen pt-24 pb-16 pointer-events-none">
        <div className="lg:col-span-6 w-full text-left flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 mb-4"
          >
            <span className="text-[10px] font-mono tracking-widest text-gray-500">
              04
            </span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
              Knowledge Matrix
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            System Parameters & <br />
            Protocol FAQs.
          </motion.h1>

          <div className="space-y-3 w-full max-w-xl">
            {faqData.map((item, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="w-full backdrop-blur-2xl bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden pointer-events-auto transition-colors duration-300 hover:border-white/10"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-4 text-left gap-4 font-sans select-none focus:outline-none text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle
                        className={`w-4 h-4 text-gray-500 transition-colors ${isOpen ? "text-white" : ""}`}
                      />
                      <span className="text-xs sm:text-sm font-medium tracking-wide">
                        {item.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-white" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-white/[0.02] text-xs sm:text-sm text-gray-400 font-mono leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 h-[100px] lg:h-auto pointer-events-none" />
      </div>
    </div>
  );
}