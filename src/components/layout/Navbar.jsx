import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Logo, Avatar } from "@/components/ui";
import { useAuth } from "@/hooks";
import {SearchModal} from "@/components/ui";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const links = [
    { title: "HOME", path: "/" },
    { title: "ABOUT", path: "/about" },
    { title: "CONTACTS", path: "/contacts" },
    { title: "FAQs", path: "/faqs" },
  ];
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <>
      <nav className="w-full relative z-50 border-b border-white/[0.02] bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="pointer-events-auto">
            <Logo className="h-5 w-5" showText={true} />
          </Link>
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[11px] tracking-widest font-medium text-gray-400">
            {links.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-white transition-colors duration-200 ${
                    isActive ? "text-white" : ""
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 text-[11px] tracking-widest cursor-pointer bg-white/[0.02] hover:bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>SEARCH</span>
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono text-gray-500 bg-white/5 border border-white/10 rounded ml-1">
                    ⌘K
                  </kbd>
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                  title={user?.name}
                >
                  <Avatar />
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="px-5 py-2 text-[11px] tracking-wide bg-white text-black font-medium rounded-md hover:bg-white/90 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#07070a] border-b border-white/5 px-8 py-6 flex flex-col space-y-5 shadow-2xl z-50">
            {links.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                {item.title}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 bg-white/5 border border-white/10 rounded-md text-white cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] flex items-center justify-center text-xs font-bold">
                  <Avatar />
                </div>
                <span className="font-medium">{user.name}</span>
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 bg-white text-black text-xs font-semibold rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
      {}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}