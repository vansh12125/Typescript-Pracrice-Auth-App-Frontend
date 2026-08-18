import { Share2, Check } from "lucide-react";
import { CopyToClipboard } from "@/service";
import React, { useState } from "react";

// Destructuring the hyphenated prop safely into a camelCase variable
const ShareBtn = ({ text, "want-bg": wantBg = false }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!text || !text.trim()) return;

    try {
      await CopyToClipboard(text);
      setCopied(true);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  return (
    <div>
      <button
        onClick={handleShare}
        className={`flex items-center justify-center space-x-2 text-xs font-mono transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          wantBg
            ? `flex-1 sm:flex-none px-4 py-2 border rounded-lg ${
                copied
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
                  : "bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-gray-400 hover:text-white"
              }`
            : copied
              ? "text-emerald-400 font-semibold"
              : "text-gray-400 hover:text-white"
        }`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Share2 className="w-3.5 h-3.5 text-gray-500" />
        )}
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>
    </div>
  );
};

export default ShareBtn;
