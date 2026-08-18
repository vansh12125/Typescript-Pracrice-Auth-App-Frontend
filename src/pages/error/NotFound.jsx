import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export default function NotFound() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <div className="relative min-h-screen w-full flex items-end justify-start overflow-hidden bg-[#050507]">
      {}
      <div className="fixed inset-0 w-full h-full min-h-screen overflow-hidden z-0 select-none pointer-events-none">
        {!isMobile ? (
          <iframe 
            src="https://my.spline.design/404notfound-I3mRGxSycuaCytxy9oI42Nkp/" 
            className="w-full absolute inset-0 border-0 m-0 p-0 block object-cover"
            style={{
              height: 'calc(100% + 50px)',
              top: 0,
            }}
            title="404 Spline Node"
            loading="lazy"
            allow="autoplay"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-80"
            >
              <source src="/assets/auth_page_video_mobile.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      {}
      <div className="max-w-7xl mx-auto w-full px-8 md:px-16 pb-16 md:pb-24 relative z-10 text-left pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-3xl flex flex-col items-start pointer-events-auto"
        >
          <div className="flex items-start gap-1 mb-2 font-sans font-light tracking-tight text-white/90">
            <span className="text-5xl md:text-6xl">Error</span>
            <span className="text-[10px] md:text-xs font-mono text-gray-500 mt-1 md:mt-2">(404)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.25] text-gray-400 font-sans max-w-2xl">
            The page was not found,{' '}
            <Link 
              to="/" 
              className="text-white hover:text-gray-300 transition-colors duration-300 underline underline-offset-[10px] decoration-[1.5px] whitespace-nowrap"
            >
              return home.
            </Link>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}