import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthPageScene3D } from "@/components/three";
import {
  RegisterUserByUsername,
  LoginUserByGoogle,
  LoginUserByGithub,
  SendOtpToEmail,
} from "@/service";
import {
  CircleX,
  SaveCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  RotateCcw,
} from "lucide-react";
export default function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const navigate = useNavigate();

  const handleValidationErrors = (error) => {
    const validationErrors = error.response?.data?.errors;

    if (Array.isArray(validationErrors)) {
      const fieldErrors = {};

      validationErrors.forEach(({ path, msg }) => {
        if (path && msg) {
          fieldErrors[path] = msg;
        }
      });

      return fieldErrors;
    }

    return {
      response:
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Something went wrong",
    };
  };

  const validateForm = (checkOtp = false) => {
    const formErrors = {};
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim();
    if (!trimmedEmail) {
      formErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)
    ) {
      formErrors.email = "Please enter a valid email address";
    }
    if (!trimmedFullName) {
      formErrors.fullName = "Full name is required";
    } else if (trimmedFullName.length < 3) {
      formErrors.fullName = "Full name must be at least 3 characters";
    } else if (trimmedFullName.length > 50) {
      formErrors.fullName = "Full name cannot exceed 50 characters";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmedFullName)) {
      formErrors.fullName =
        "Full name can only contain letters and single spaces";
    }
    if (!trimmedUsername) {
      formErrors.username = "Username is required";
    } else if (trimmedUsername.length < 3) {
      formErrors.username = "Username must be at least 3 characters";
    } else if (trimmedUsername.length > 30) {
      formErrors.username = "Username cannot exceed 30 characters";
    } else if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(trimmedUsername)) {
      formErrors.username =
        "Username must start with a letter and contain only alphanumeric symbols or underscores.";
    }
    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
    } else if (/\s/.test(password)) {
      formErrors.password = "Password cannot contain spaces";
    }
    if (checkOtp) {
      if (!otp.trim()) {
        formErrors.otp = "OTP is required";
      } else if (!/^\d{6}$/.test(otp.trim())) {
        formErrors.otp = "OTP must be exactly 6 digits";
      }
    }
    return {
      isValid: Object.keys(formErrors).length === 0,
      errors: formErrors,
    };
  };
  const triggerOtpSendAPI = async (data, isResend = false) => {
    setIsSendingOtp(true);
    setOtpMessage("");
    setErrors({});

    try {
      const response = await SendOtpToEmail(data);

      if (response?.data?.status === 200) {
        setIsOtpSent(true);
        setOtp("");

        setOtpMessage(
          isResend
            ? "New OTP sent successfully. Check your inbox!"
            : "OTP sent to email successfully. Check your inbox!",
        );

        return true;
      }

      if (!isResend) {
        setIsOtpSent(false);
      }

      setErrors({
        response: response?.data?.errors || "Failed to send OTP.",
      });

      return false;
    } catch (error) {
      const fieldErrors = handleValidationErrors(error);

      setErrors(fieldErrors);

      setErrors(fieldErrors);
      if (!isResend) {
        setIsOtpSent(false);
      }

      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleResendOtp = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    setOtp("");

    await triggerOtpSendAPI(
      {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
      },
      true,
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!isOtpSent) {
      if (isSendingOtp) return;
      const { isValid, errors: formErrors } = validateForm(false);
      if (!isValid) {
        setErrors(formErrors);
        return;
      }
      await triggerOtpSendAPI({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
      });
    } else {
      if (isPublishing) return;
      const { isValid, errors: formErrors } = validateForm(true);
      if (!isValid) {
        setErrors(formErrors);
        return;
      }
      setIsPublishing(true);
      const data = {
        username: username.trim().toLowerCase(),
        password,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      };
      try {
        const response = await RegisterUserByUsername(data);

        setSuccess(true);
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } catch (error) {
        const fieldErrors = handleValidationErrors(error);

        setErrors(fieldErrors);
      } finally {
        setIsPublishing(false);
      }
    }
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-[#050507]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AuthPageScene3D />
      </div>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-screen py-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-5 w-full backdrop-blur-2xl bg-black/40 border border-white/[0.06] rounded-2xl p-6 shadow-2xl mx-auto max-w-md lg:mx-0 text-left pointer-events-auto relative z-20"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Fill out your details to receive an authentication security code.
            </p>
          </div>
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {}
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="register-email"
                  disabled={isOtpSent || isSendingOtp || isPublishing}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono disabled:opacity-50"
                  placeholder="handle@devsphere.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-[11px] font-mono mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              {}
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="register-name"
                  disabled={isOtpSent || isPublishing}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono disabled:opacity-50"
                  placeholder="Vansh Sahu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[11px] font-mono mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>
              {}
              <div>
                <label
                  htmlFor="register-handle"
                  className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="register-handle"
                  disabled={isOtpSent || isPublishing}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono disabled:opacity-50"
                  placeholder="u/kernel_panic"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-red-500 text-[11px] font-mono mt-1">
                    {errors.username}
                  </p>
                )}
              </div>
              {}
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
                    disabled={isOtpSent || isPublishing}
                    className="w-full bg-black/40 border border-white/5 rounded-lg pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono disabled:opacity-50"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[11px] font-mono mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              {}
              <div className="flex items-start pt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  disabled={isPublishing}
                  className="w-3.5 h-3.5 accent-white rounded bg-black/40 border-white/5 mt-0.5 cursor-pointer disabled:opacity-50"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-[10px] text-gray-400 font-mono leading-tight select-none cursor-pointer"
                >
                  I agree to the terms and privacy guidelines.
                </label>
              </div>
              {}
              {otpMessage && (
                <div className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-[11px] font-mono text-gray-300">
                  {otpMessage}
                </div>
              )}
              {}
              <AnimatePresence>
                {isOtpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-1 pt-2 border-t border-white/[0.04]"
                  >
                    <label
                      htmlFor="register-otp"
                      className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                    >
                      Enter 6 Digit OTP Code
                    </label>
                    <input
                      type="text"
                      id="register-otp"
                      inputMode="numeric"
                      maxLength={6}
                      disabled={isPublishing}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-white/20 transition-colors font-mono tracking-widest"
                      placeholder="Enter 6 digit OTP"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                      }}
                    />
                    <div className="flex justify-between items-center pt-1 px-0.5 min-h-[22px]">
                      <div className="flex-1">
                        {errors.otp && (
                          <p className="text-red-500 text-[11px] font-mono">
                            {errors.otp}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={isSendingOtp || isPublishing}
                        onClick={handleResendOtp}
                        className="text-[10px] text-gray-400 hover:text-white transition-colors font-mono flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ml-auto bg-transparent border-none outline-none cursor-pointer"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3 h-3 animate-spin text-white" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        <span>
                          {isSendingOtp ? "Sending..." : "Resend OTP"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {}
              {errors.response && (
                <div className="text-red-500 text-xs text-center flex justify-center items-center gap-2 font-mono pt-2">
                  <CircleX size={16} /> {errors.response}
                </div>
              )}
              {success && (
                <div className="text-green-500 text-xs text-center flex justify-center items-center gap-2 font-mono pt-2">
                  <SaveCheck size={16} /> User Registered Successfully...
                </div>
              )}
              {}
              <button
                type="submit"
                disabled={isSendingOtp || isPublishing}
                className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors tracking-wide mt-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSendingOtp || isPublishing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>
                  {isSendingOtp
                    ? "Sending OTP..."
                    : isPublishing
                      ? "Verifying & Signing Up..."
                      : isOtpSent
                        ? "Verify & Sign Up"
                        : "Register Account"}
                </span>
              </button>
            </form>
          </div>
          {}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]"></div>
            </div>
            <div className="relative flex justify-center text-[8px] font-mono uppercase">
              <span className="bg-[#09090c] px-2 text-gray-500 tracking-widest">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isOtpSent || isSendingOtp || isPublishing}
              type="button"
              className="flex items-center justify-center space-x-2 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs font-mono text-gray-300 transition-colors duration-200"
              onClick={LoginUserByGoogle}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              disabled={isOtpSent || isSendingOtp || isPublishing}
              className="flex items-center justify-center space-x-2 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs font-mono text-gray-300 transition-colors duration-200"
              onClick={LoginUserByGithub}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48V21.128c0-.236-.009-.866-.014-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04] text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-white font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
        <div className="lg:col-span-7 h-[10px] lg:h-auto pointer-events-none" />
      </div>
    </div>
  );
}
