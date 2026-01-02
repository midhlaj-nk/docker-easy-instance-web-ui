"use client";
import { useState } from "react";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does it take to deploy an Odoo instance?",
      answer:
        "It takes less than a minute! Our automated cloud infrastructure provisions your instance instantly, so you can start working immediately.",
    },
    {
      question: "Can I use my own domain name?",
      answer:
        "Yes, you can map your custom domain (e.g., erp.yourcompany.com) to your Odoo instance easily through our dashboard. We also handle SSL certificates automatically.",
    },
    {
      question: "Do you support custom addons and modules?",
      answer:
        "Absolutely. You can install custom addons via our seamless GitHub integration or by uploading module ZIP files directly to your instance.",
    },
    {
      question: "How are backups handled?",
      answer:
        "We perform daily automated backups to ensure your data is safe. You can also trigger manual backups at any time and download them for off-site storage.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your subscription plan at any time. Resources like CPU and RAM are adjusted instantly without data loss.",
    },
  ];

  return (
    <div id="faq">
      <div className="bg-[white] py-10">
        <div className="container-fluid cmpad">
          <div className="hero-section">
            {/* <div className="get-started-tag">Get started today</div> */}

            <h2 className="text-black dark:text-black text-3xl md:text-5xl leading-tight font-medium mb-3 text-[#333]">
              Get started <span className="text-[var(--primary-color)]">with</span> easyinstance
            </h2>
            <p className="text-black dark:text-black max-w-xl mx-auto text-[#58586b] leading-relaxed mb-10">
              Launch your Odoo instance in seconds, scale effortlessly, and
              focus on growing your business no hidden fees, no complex setup.
            </p>

            <div className="email-form">
              <input
                type="email"
                className="email-input"
                placeholder="Enter your email"
              />

              <a
                href="#"
                className="text-black dark:text-black px-10 h-full py-4 bg-[var(--primary-color)] text-white rounded-full  hover:bg-[#454685] transition duration-300"
              >
                Started Free Today
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-black dark:text-black container-fluid cmpad py-10 lg:py-20 text-center">
        <h2 className="text-4xl leading-tight font-medium mb-3">
          Frequently <span className="text-[var(--primary-color)]">Asked</span>{" "}
          Questions
        </h2>
        <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-3">
          Easy Instance is backed by businesses worldwide, delivering seamless
          Odoo support with trusted performance you can count on.
        </p>
        <div className="accordion">
          {faqs.map((item, index) => (
            <div key={index} className="accordion-item">
              <button
                className={`accordion-header ${activeIndex === index ? "active" : ""
                  }`}
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                <svg
                  className="accordion-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                className={`accordion-content ${activeIndex === index ? "active" : ""
                  }`}
              >
                <div className="accordion-body">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default Faq;
