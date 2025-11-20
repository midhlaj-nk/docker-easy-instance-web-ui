"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    name: "",
    email: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear errors when switching forms
  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [showForgotPassword, showSignUp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!formData.login.trim()) {
      errors.login = "Email or username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.login.trim()) {
      errors.login = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    const result = await login({
      login: formData.login,
      password: formData.password,
    });

    if (result.success) {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;

    const result = await register({
      name: formData.name,
      login: formData.login,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      router.push("/dashboard");
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowSignUp(true);
    setShowForgotPassword(false);
  };

  const handleBackToLoginClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(false);
    setShowSignUp(false);
  };

  const getTitle = () => {
    if (showForgotPassword) {
      return { line1: "Password", line2: "Reset!" };
    }
    if (showSignUp) {
      return { line1: "Welcome", line2: "Aboard!" };
    }
    return { line1: "Welcome", line2: "Back!" };
  };

  return (
    <div className="flex justify-center lg:items-center lg:h-screen">
      <div className="[box-shadow:10px_10px_20px_rgb(0_0_0_/_3%)] w-[1000px] mx-auto bg-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 lg:h-[630px] p-3">
           <div className="col-span-12 lg:col-span-6 flex flex-col justify-center p-18 border rounded-xl bg-[#5355ce0d] border-[#6c6fe90d]">
            <h2 className="text-4xl font-semibold text-[#333] leading-tight relative z-10">
              <img src="/img/logvector.svg" alt="" className="mb-5" />
              {getTitle().line1} <br /> {getTitle().line2}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 p-5 flex flex-col justify-center">
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {showForgotPassword ? (
              <>
                <h5 className="text-2xl font-semibold mb-2">Password Reset</h5>
                <p className="text-[#999999] text-sm mb-8">
                  Update your password to secure your<br /> account
                </p>
                <label className="text-[#333] text-xs mb-2 font-medium">
                  New Password
                </label>
                <input
                  className="px-3 py-2 border border-[#e5e7eb] rounded-md mb-3 focus:border-[var(--primary-color)] transition duration-300 outline-0"
                  type="password"
                  placeholder="New Password"
                />
                <label className="text-[#333] text-xs mb-2 font-medium">
                  Confirm New Password
                </label>
                <input
                  className="px-3 py-2 border border-[#e5e7eb] rounded-md mb-5 focus:border-[var(--primary-color)] transition duration-300 outline-0"
                  type="password"
                  placeholder="Confirm New Password"
                />
                <button
                  onClick={handleBackToLoginClick}
                  className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                >
                  Reset Password
                </button>
                <p className="text-[#333] text-sm mt-20">
                  Remembered your password?{" "}
                  <a
                    href="#"
                    onClick={handleBackToLoginClick}
                    className="text-[var(--primary-color)] cursor-pointer"
                  >
                    Login
                  </a>
                </p>
              </>
            ) : showSignUp ? (
              <form onSubmit={handleSignUp}>
                <h5 className="text-2xl font-semibold mb-2">Sign Up</h5>
                <p className="text-[#999999] text-sm mb-8">
                  Create an account to get started.
                </p>
                
                <label className="text-[#333] text-xs mb-2 font-medium">
                  Full Name
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.name ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.name}</p>
                )}
                
                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Email Address
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.email ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.email}</p>
                )}
                
                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Username
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.login ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
                {formErrors.login && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.login}</p>
                )}
                
                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Password
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.password ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.password}</p>
                )}
                
                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Confirm Password
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                />
                {formErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.confirmPassword}</p>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
                
                <p className="text-[#333] text-sm mt-10">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={handleBackToLoginClick}
                    className="text-[var(--primary-color)] cursor-pointer"
                  >
                    Login
                  </a>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <h5 className="text-2xl font-semibold mb-2">Login</h5>
                <p className="text-[#999999] text-sm mb-8">
                  Welcome back! Please login to your <br /> account
                </p>
                
                <label className="text-[#333] text-xs mb-2 font-medium">
                  Email or Username
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.login ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Email or Username"
                />
                {formErrors.login && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.login}</p>
                )}
                
                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Password
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${
                    formErrors.password ? 'border-red-500' : 'border-[#e5e7eb]'
                  }`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.password}</p>
                )}
                
                <div className="flex justify-between text-xs mb-5 text-[#999999] mt-5">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--primary-color)] transition duration-300">
                    <input type="checkbox" className="form-checkbox" />
                    <p className="m-0">Remember me</p>
                  </label>
                  <a
                    href="#"
                    onClick={handleForgotPasswordClick}
                    className="hover:text-[var(--primary-color)] transition duration-300"
                  >
                    Forgot Password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Continue"}
                </button>
                
                <p className="text-[#333] text-sm mt-20">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={handleSignUpClick}
                    className="text-[var(--primary-color)] cursor-pointer"
                  >
                    Sign Up
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

