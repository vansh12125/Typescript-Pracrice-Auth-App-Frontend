import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, User } from 'lucide-react';

export default function FloatingNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Feed', path: '/feed', icon: LayoutGrid },
    { label: 'Profile', path: '/dashboard', icon: User }
  ];

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.08] rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-colors duration-300 z-10 ${
              active ? 'text-black font-semibold animate-none' : 'text-gray-400 hover:text-white'
            }`}
          >
            {active && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}