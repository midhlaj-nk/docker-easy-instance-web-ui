"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

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
    setCaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [showSignUp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (formErrors.captcha) {
      setFormErrors((prev) => ({ ...prev, captcha: "" }));
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!captchaToken) {
      errors.captcha = "Please complete the CAPTCHA verification";
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
      login: formData.email, // Backend expects 'login' field but we use email
      password: formData.password,
      captcha_token: captchaToken
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      // Reset captcha on failure
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;

    const result = await register({
      name: formData.name,
      login: formData.email, // Use email as login since username is not supported
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      router.push("/dashboard");
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowSignUp(true);
  };

  const handleBackToLoginClick = (e) => {
    e.preventDefault();
    setShowSignUp(false);
  };

  const getTitle = () => {
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

            {showSignUp ? (
              <form onSubmit={handleSignUp}>
                <h5 className="text-2xl font-semibold mb-2">Sign Up</h5>
                <p className="text-[#999999] text-sm mb-8">
                  Create an account to get started.
                </p>

                <label className="text-[#333] text-xs mb-2 font-medium">
                  Full Name
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.name ? 'border-red-500' : 'border-[#e5e7eb]'
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
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.email ? 'border-red-500' : 'border-[#e5e7eb]'
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
                  Password
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.password ? 'border-red-500' : 'border-[#e5e7eb]'
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
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.confirmPassword ? 'border-red-500' : 'border-[#e5e7eb]'
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
                  Email
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.email ? 'border-red-500' : 'border-[#e5e7eb]'
                    }`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mb-3">{formErrors.email}</p>
                )}

                <label className="text-[#333] text-xs mb-2 font-medium mt-3">
                  Password
                </label>
                <input
                  className={`px-3 py-2 border rounded-md mb-1 w-full focus:border-[var(--primary-color)] transition duration-300 outline-0 ${formErrors.password ? 'border-red-500' : 'border-[#e5e7eb]'
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

                <div className="flex justify-start text-xs mb-5 text-[#999999] mt-5">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--primary-color)] transition duration-300">
                    <input type="checkbox" className="form-checkbox" />
                    <p className="m-0">Remember me</p>
                  </label>
                </div>

                <div className="mb-5">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                  {formErrors.captcha && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.captcha}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Continue"}
                </button>

                <p className="text-[#333] text-sm mt-10">
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

