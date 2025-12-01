"use client";
import React, { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import ReCAPTCHA from "react-google-recaptcha";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web.easyinstance.com';

function page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatus({
        type: "error",
        message: "Please complete the CAPTCHA verification.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captcha_token: captchaToken
        }),
      });

      const result = await response.json();

      // Handle Odoo JSON-RPC response format
      const data = result.result ? result.result : result;

      if (data.status === "success") {
        setStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
        setCaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="pt-32 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="text-4xl text-center leading-tight font-semibold mb-3">
              Contact <span className="text-[var(--primary-color)]">Us</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Connect with our team: responsive service, trusted expertise, and
              custom strategies to ensure your success at every step.
            </p>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
          </div>

          <div className="bg-white p-6 md:p-10 rounded-lg mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-6">
                  We're Just a <span className="text-[var(--primary-color)]">Message</span> Away
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="text-[var(--primary-color)]">
                      {/* Location Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Address</div>
                      <div className="text-[#58586b] text-sm">
                        Neospace, Kinfra Techno Park <br />
                        Kakkancherry <br />
                        Calicut University P.O. <br />
                        Kerala, India - 673635
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="text-[var(--primary-color)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Phone</div>
                      <a href="tel:+918606827707" className="text-[#58586b] text-sm hover:underline">
                        +91 8606827707
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="text-[var(--primary-color)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Email</div>
                      <a href="mailto:info@easyinstance.com" className="text-[#58586b] text-sm hover:underline">
                        info@easyinstance.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-6 flex flex-col justify-center mt-8 lg:mt-0">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full"
                    placeholder="Enter your name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full"
                    placeholder="Enter your email"
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full md:col-span-2"
                    placeholder="Enter your phone"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full md:col-span-2"
                    rows="4"
                    placeholder="Enter your message"
                    required
                  ></textarea>

                  <div className="md:col-span-2 mb-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={onCaptchaChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-max px-8 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>

                  {status.message && (
                    <div className={`md:col-span-2 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {status.message}
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
