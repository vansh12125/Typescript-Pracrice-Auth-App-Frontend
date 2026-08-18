import React, { useState } from 'react';
import { useAuth } from "@/hooks";

export default function Avatar({ src, alt, className = "w-10 h-10", rounded = "rounded-xl" }) {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  const finalSrc = src !== undefined ? src : (user?.pictureUrl || user?.avatar);
  const finalAlt = alt !== undefined ? alt : (user?.name || "User");

  const getInitials = (nameString) => {
    if (!nameString || nameString === "User") return "?";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const useFallback = !finalSrc || imgError || (typeof finalSrc === 'string' && finalSrc.includes("profile/picture/0"));

  return (
    <div className={`relative flex-shrink-0 overflow-hidden select-none ${rounded} ${className}`}>
      {useFallback ? (
        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center text-white font-mono font-bold tracking-wider text-x uppercase">
          {getInitials(finalAlt)}
        </div>
      ) : (
        <img
          src={finalSrc}
          alt={finalAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}
    </div>
  );
}