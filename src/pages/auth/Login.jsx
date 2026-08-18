import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthPageScene3D } from "@/components/three";
import {
  CircleX,
  SaveCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { login } from "@/redux";
import {
  LoginUserByGoogle,
  LoginUserByGithub,
  LoginUserByUsername,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
} from "@/service/AuthService";
export default function Login() {
  const { dispatch } = useAuth();
  const [username, setUsername] = useState("");
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const hash = window.location.hash.substring(1).trim().toLowerCase();
  useEffect(() => {
    const error = searchParams.get("error");
    const url_success = searchParams.get("success");
    const retryAfter = searchParams.get("retryAfter");

    if (error === "too_many_requests") {
      setErrors({
        response: `Too many requests. Please try again in ${retryAfter} seconds.`,
      });
    } else if (error === "invalid_credentials") {
      setErrors({
        response: "User is invalid, Suspicious Account Detected.",
      });
    } else if (error === "already_exists") {
      setErrors({
        response:
          "This email is already registered. Please sign in with your password first.",
      });
    } else if (error === "true") {
      setErrors({
        response: "Some Error Occured.",
      });
    } else if (url_success != null) {
      setSuccess({
        response: "Account Deleted Successfully.",
      });
    }
  }, [searchParams]);
  useEffect(() => {
    setSuccess(false);
    if (hash === "reset") {
      setShowResetPassword(true);
    } else {
      setShowResetPassword(false);
      setResetStep(1);
    }
  }, [hash]);
  const validateForm = (username, password) => {
    const errors = {};
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      errors.username = "Username is required";
    } else if (trimmedUsername.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (trimmedUsername.length > 30) {
      errors.username = "Username cannot exceed 30 characters";
    } else if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(trimmedUsername)) {
      errors.username =
        "Username must start with a letter and can only contain letters, numbers, and underscores (_).";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (/\s/.test(password)) {
      errors.password = "Password cannot contain spaces";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  const validateUsername = (username) => {
    const errors = {};
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      errors.username = "Username is required";
    } else if (trimmedUsername.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (trimmedUsername.length > 30) {
      errors.username = "Username cannot exceed 30 characters";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  const validateResetPasswordFields = () => {
    const errors = {};
    if (!otp.trim()) {
      errors.otp = "OTP is required";
    }
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (/\s/.test(newPassword)) {
      errors.newPassword = "Password cannot contain spaces";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  const clearFields = () => {
    setErrors({});
    setPassword("");
    setUsername("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    const { isValid, errors } = validateForm(username, password);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    const data = {
      username: username.toLowerCase().trim(),
      password,
      rememberMe,
    };
    setIsLoading(true);
    try {
      const response = await LoginUserByUsername(data);
      dispatch(
        login({
          user: response.data.user,
        }),
      );
      setSuccess(true);
      clearFields();
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setErrors({
        response:
          error.response?.data?.errors || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const continueByGoogle = () => {
    LoginUserByGoogle();
  };
  const continueByGithub = () => {
    LoginUserByGithub();
  };
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    const { isValid, errors } = validateUsername(username);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      await sendResetPasswordOtp({
        identifier: username.toLowerCase().trim(),
      });

      setSuccess({ response: "OTP sent successfully to your email." });
      setResetStep(2);
    } catch (error) {
      setErrors({
        response: error.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrors({});
    setSuccess(false);
    setIsLoading(true);
    try {
      await sendResetPasswordOtp({
        identifier: username.toLowerCase().trim(),
      });

      setSuccess({ response: "A new OTP has been sent." });
    } catch (error) {
      setErrors({
        response: error.response?.data?.message || "Failed to resend OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyAndResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    const { isValid, errors } = validateResetPasswordFields();
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        identifier: username.toLowerCase().trim(),
        otp: otp.trim(),
        newPassword: newPassword,
      };

      await verifyResetPasswordOtp(payload);

      setSuccess({ response: "Password reset successful! Redirecting..." });
      setTimeout(() => {
        clearFields();
        setResetStep(1);
        window.location.hash = "login";
      }, 1500);
    } catch (error) {
      setErrors({
        response:
          error.response?.data?.message ||
          "Failed to reset password. Please check your OTP.",
      });
    } finally {
      setIsLoading(false);
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
          {}
          {!showResetPassword && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sign in to your account to continue.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="login-identity"
                    className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="identity"
                    id="login-identity"
                    autoComplete="username"
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                    placeholder="u/handle"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="login-password"
                      className="block text-[9px] font-mono uppercase tracking-wider text-gray-400"
                    >
                      Password
                    </label>
                    <a
                      href="#reset"
                      className="text-[9px] font-mono text-gray-500 hover:text-white transition-colors"
                    >
                      FORGOT PASSWORD?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      id="login-password"
                      autoComplete="current-password"
                      className="w-full bg-black/40 border border-white/5 rounded-lg pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                      placeholder="••••••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-3.5 h-3.5 accent-white rounded bg-black/40 border-white/5 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-[10px] text-gray-400 font-mono leading-tight select-none cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                {errors.response && (
                  <div className="text-red-500 text-xs text-center flex justify-center items-center gap-2">
                    <CircleX size={16} /> {errors.response}
                  </div>
                )}
                {success && (
                  <div className="text-green-500 text-xs text-center flex justify-center items-center gap-2">
                    <SaveCheck size={16} />{" "}
                    {typeof success === "object" && success.response
                      ? success.response
                      : "Login Successful..."}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors tracking-wide mt-2 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          )}
          {}
          {showResetPassword && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  Reset Your Password
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {resetStep === 1
                    ? "Enter your username to receive a verification OTP."
                    : "Enter the OTP sent to your account and choose a new password."}
                </p>
              </div>
              {}
              {resetStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label
                      htmlFor="reset-identity"
                      className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                    >
                      Username/Email
                    </label>
                    <input
                      type="text"
                      name="identity"
                      id="reset-identity"
                      autoComplete="username"
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                      placeholder="u/handle"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username}
                      </p>
                    )}
                    <div className="flex justify-end mt-2">
                      <a
                        href="#login"
                        className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors"
                      >
                        GOT THE PASSWORD?
                      </a>
                    </div>
                  </div>
                  {errors.response && (
                    <div className="text-red-500 text-xs text-center flex justify-center items-center gap-2">
                      <CircleX size={16} /> {errors.response}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-500 text-xs text-center flex justify-center items-center gap-2">
                      <SaveCheck size={16} />{" "}
                      {typeof success === "object" && success.response
                        ? success.response
                        : "OTP Sent Successfully!"}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors tracking-wide mt-2 shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}
              {}
              {resetStep === 2 && (
                <form
                  onSubmit={handleVerifyAndResetPassword}
                  className="space-y-3"
                >
                  {}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="reset-otp"
                        className="block text-[9px] font-mono uppercase tracking-wider text-gray-400"
                      >
                        Enter 6 Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[9px] font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={10} /> RESEND OTP
                      </button>
                    </div>
                    <input
                      type="numeric"
                      name="otp"
                      id="reset-otp"
                      maxLength={6}
                      minLength={6}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono tracking-widest"
                      placeholder="Enter OTP"
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                    )}
                  </div>
                  {}
                  <div>
                    <label
                      htmlFor="reset-new-password"
                      className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        id="reset-new-password"
                        className="w-full bg-black/40 border border-white/5 rounded-lg pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                        placeholder="••••••••••••"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                  {}
                  <div>
                    <label
                      htmlFor="reset-confirm-password"
                      className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="reset-confirm-password"
                        className="w-full bg-black/40 border border-white/5 rounded-lg pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                        placeholder="••••••••••••"
                        required
                        value={confirmPassword}
                        autoComplete="current-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft size={12} /> Back to Username
                    </button>
                    <a
                      href="#login"
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      LOGIN
                    </a>
                  </div>
                  {errors.response && (
                    <div className="text-red-500 text-xs text-center flex justify-center items-center gap-2">
                      <CircleX size={16} /> {errors.response}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-500 text-xs text-center flex justify-center items-center gap-2">
                      <SaveCheck size={16} />{" "}
                      {typeof success === "object" && success.response
                        ? success.response
                        : "Success!"}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors tracking-wide mt-2 shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          )}
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
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs font-mono text-gray-300 transition-colors duration-200"
              onClick={continueByGoogle}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center space-x-2 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-xs font-mono text-gray-300 transition-colors duration-200"
              onClick={continueByGithub}
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
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
        <div className="lg:col-span-7 h-[10px] lg:h-auto pointer-events-none" />
      </div>
    </div>
  );
}
