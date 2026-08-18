import React from "react";
import { motion } from "framer-motion";
import { Users, Code, Box, ArrowUp, MessageSquare, Plus } from "lucide-react";
import {useNavigate} from "react-router-dom"
const smoothFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
};
export default function UIOverlay() {
  const navigate=useNavigate();
  return (
    <div className="w-full relative z-10">
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12 lg:pt-16 pb-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center min-h-[80vh]">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-[10px] font-mono tracking-widest text-gray-500">
              01
            </span>
            <div className="h-[1px] w-12 bg-gray-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
              Developers Community
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[5.2rem] font-bold tracking-tight text-white leading-[1.1] lg:leading-[1.05] mb-6 sm:mb-8">
            Connect.
            <br />
            Share.
            <br />
            Build Together.
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-lg mb-8 sm:mb-10 leading-relaxed">
            DevSphere is a community of developers who connect, share knowledge,
            build amazing projects and grow together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black text-xs font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all transform hover:scale-[1.01]"
              onClick={() => {
                navigate("/signin");
              }}
            >
              <span>Join DevSphere</span>
              <span className="text-xs">↗</span>
            </button>
            <button className="text-xs tracking-wider text-white hover:text-gray-300 font-medium flex items-center space-x-1.5 transition-colors">
              <span>Explore Community</span>
              <span>→</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80",
              ].map((url, idx) => (
                <img
                  key={idx}
                  className="w-8 h-8 rounded-full border border-black object-cover"
                  src={url}
                  alt=""
                />
              ))}
              <div className="w-8 h-8 rounded-full border border-black bg-[#16161a] flex items-center justify-center text-[10px] font-medium text-gray-400">
                +24K
              </div>
            </div>
            <div className="text-[11px] text-gray-400 text-center sm:text-left leading-tight">
              <span className="text-white font-medium block">
                24K+ developers
              </span>{" "}
              already joined
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 h-[280px] sm:h-[350px] lg:h-[400px] pointer-events-none" />
      </section>

      <section className="border-t border-b border-white/[0.04] bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: <Users />,
              title: "Connect",
              desc: "Find and connect with developers worldwide.",
            },
            {
              icon: <Code />,
              title: "Share",
              desc: "Share your knowledge, ideas and experiences.",
            },
            {
              icon: <Box />,
              title: "Build",
              desc: "Collaborate on projects and build the future.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="text-white mt-0.5">{item.icon}</div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-medium tracking-wide text-white">
              Trending Discussions
            </h2>
            <div className="flex space-x-1 sm:space-x-2 text-[10px] sm:text-[11px] font-mono text-gray-400">
              <span className="text-white bg-white/5 px-2.5 py-1 rounded cursor-pointer">
                Hot
              </span>
              <span className="hover:text-white px-2.5 py-1 rounded cursor-pointer transition-colors">
                New
              </span>
            </div>
          </div>

          <motion.div
            {...smoothFade}
            className="p-5 sm:p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex items-start space-x-4 hover:border-white/10 transition-colors"
          >
            <div className="flex flex-col items-center p-1 bg-white/[0.02] border border-white/5 rounded-lg text-xs font-mono text-gray-400">
              <button className="hover:text-white">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <span className="my-0.5 font-medium text-white">412</span>
            </div>
            <div className="flex-grow text-left overflow-hidden">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 mb-1.5 font-mono">
                <span className="text-gray-300 font-medium">s/react</span>
                <span>•</span>
                <span>Posted by u/tech_lead</span>
              </div>
              <h3 className="text-sm sm:text-base font-medium text-white mb-2 hover:text-gray-200 cursor-pointer transition-colors line-clamp-2">
                How are you handling high-volume localized state caching in
                Next.js Server Components?
              </h3>
              <div className="flex items-center space-x-4 text-[11px] text-gray-500 font-mono">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>84 Comments</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
            <h3 className="text-xs uppercase tracking-widest font-mono text-gray-400 mb-4">
              Active Spheres
            </h3>
            <div className="space-y-4">
              {[
                { name: "s/ai-engineering", m: "14.2k" },
                { name: "s/typescript", m: "32.1k" },
              ].map((sph, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.03] last:border-none last:pb-0"
                >
                  <div>
                    <span className="text-white font-medium block">
                      {sph.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {sph.m} members
                    </span>
                  </div>
                  <button className="p-1.5 bg-white/5 rounded-md hover:bg-white/10 text-white">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
