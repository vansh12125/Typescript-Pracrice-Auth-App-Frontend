import React from 'react';

export default function Logo({ className = "h-6 w-auto", showText = true }) {
  return (
    <div className="flex items-center space-x-2.5 select-none group cursor-pointer">
      {/* Dynamic Geometric Emblem */}
      <svg 
        className={`${className} text-white transition-transform duration-500 group-hover:rotate-45`}
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Tech Orbit Track */}
        <circle 
          cx="16" 
          cy="16" 
          r="14" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="4 3" 
          className="opacity-40 group-hover:opacity-70 transition-opacity"
        />
        
        {/* Core Code-Bracket Sphere Matrix */}
        <path 
          d="M11 10C8.5 13 8.5 19 11 22" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        <path 
          d="M21 10C23.5 13 23.5 19 21 22" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        
        {/* Center Synchronized Core Cluster Node */}
        <circle 
          cx="16" 
          cy="16" 
          r="3" 
          fill="currentColor" 
          className="animate-pulse shadow-glow"
        />
      </svg>

      {/* Typography Layout Node */}
      {showText && (
        <span className="font-sans font-bold tracking-tight text-sm text-white group-hover:text-gray-200 transition-colors">
          DevSphere<span className="text-white/40 font-mono font-light ml-0.5 group-hover:text-white transition-colors">*</span>
        </span>
      )}
    </div>
  );
}