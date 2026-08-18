import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, UserCheck, Fingerprint, CheckCircle2, HelpCircle } from 'lucide-react';
import { useAuth } from "@/hooks";
import { CopyToClipboard } from "@/service";
export default function AccountDetails() {
  const { user } = useAuth();
  
  const infoFields = [
    { label: "Full Name", value: user?.name, icon: UserCheck },
    { label: "Email Address", value: user?.email, icon: Mail },
    { label: "Username", value: user?.username ? `u/${user.username}` : '', icon: Shield },
    { label: "User ID", value: user?.userId, icon: Fingerprint, mono: true },
  ];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-xl text-left"
    >
      <div className="mb-6 border-b border-white/[0.04] pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Account Details
            </h2>
            {}
            {user?.isVerified ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-mono uppercase tracking-wider" title='Email Is Verified'>
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono uppercase tracking-wider " title='Email Is Unverified'>
                <HelpCircle className="w-2.5 h-2.5" />
                Unverified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Your verified profile information.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoFields.map((field, idx) => {
          const IconComponent = field.icon;
          return (
            <div 
              key={idx} 
              className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl flex items-start space-x-3 cursor-pointer hover:bg-white/[0.02] hover:border-white/10 transition-all" 
              onClick={() => {
                if (field.value) CopyToClipboard(field.value);
              }}
            >
              <IconComponent className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-0.5">
                  {field.label}
                </span>
                <span className={`block text-xs sm:text-sm text-gray-200 truncate ${field.mono ? 'font-mono text-white' : ''}`}>
                  {field.value || "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}