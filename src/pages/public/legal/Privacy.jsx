import React from 'react';
import { motion } from 'framer-motion';
import {Grid} from '@/components/common'; // Adjust this path to match your component folder setup

export default function Privacy() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507] text-gray-300">
      {/* Background Matrix Grid Component Only */}
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
            <span className="text-[10px] font-mono tracking-widest text-gray-500">PRV-01</span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Data Governance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8">
            Privacy Policy Protocols
          </h1>

          {/* Policy Scrollable Box */}
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-gray-400 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">1. Telemetry Ingestion</h2>
              <p>
                When interacting with the DevSphere node mesh, we process technical variables including your developer handles, comms routes (email addresses), and basic browser device properties. This ingestion strictly enables optimized routing across global cloud layers.
              </p>
            </section>

            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">2. Cryptographic Alignment</h2>
              <p>
                Federated OAuth pathways implemented via Google and GitHub process securely encrypted tokens. We never store raw, plain-text authentication passwords or persistent access keys within our cluster databases.
              </p>
            </section>

            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">3. Data Retention Constants</h2>
              <p>
                User profiles and discussion thread history persist within the sandboxed node mesh until a manual account execution event is authorized by the root developer handle. Deleted data states completely purge within 72 runtime operational hours.
              </p>
            </section>

            <section>
              <h2 className="text-white font-mono uppercase tracking-wider text-xs mb-2">4. Infrastructure Security</h2>
              <p>
                All data transmission pathways implement mandatory Transport Layer Security (TLS 1.3). Access matrices to storage volumes are strictly restricted to isolated background cluster tasks.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}