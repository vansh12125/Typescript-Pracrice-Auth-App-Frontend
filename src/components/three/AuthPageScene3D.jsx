import React, { useState, useEffect } from "react";
import { LoadingAnimation } from "@/components/ui";
export default function AuthPageScene3D() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="w-full h-full min-h-screen relative bg-[#050507] overflow-hidden select-none">
      {}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-white/[0.015] blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      {}
      {!isMobile ? (
        <>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <LoadingAnimation
                className="w-full absolute inset-0 border-0 m-0 p-0 block"
                style={{
                  height: "calc(100% + 50px)",
                  top: 0,
                }}
              />
            </div>
          )}
          <iframe
            onLoad={() => setLoading(false)}
            src="https://my.spline.design/ailandingpagewebdesign3danimation-P5vBX4AfPlyNXzGggfobrJtn/"
            className="w-full absolute inset-0 border-0 m-0 p-0 block pointer-events-auto"
            style={{
              height: "calc(100% + 50px)",
              top: 0,
            }}
            title="Spline 3D Scene Node"
            loading="lazy"
            allow="autoplay"
          />
        </>
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-fill"
          >
            {}
            <source
              src="./assets/auth_page_video_mobile.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
