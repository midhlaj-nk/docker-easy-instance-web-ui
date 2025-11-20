"use client";
import { useState } from "react";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the primary role of a business agency?",
      answer:
        "A business agency serves as a strategic partner that helps companies achieve their goals through specialized services, expertise, and resources. They provide consulting, marketing, design, and operational support to drive growth and efficiency.",
    },
    {
      question:
        "What kinds of services should I anticipate from a business agency?",
      answer:
        "Business agencies typically offer services including digital marketing, brand strategy, web development, content creation, SEO, social media management, advertising campaigns, analytics, and business consulting tailored to your industry needs.",
    },
    {
      question: "How often should I consider updating my website?",
      answer:
        "Website updates should be considered every 2-3 years for major redesigns, but content should be updated regularly. Minor updates for security, functionality, and fresh content should happen monthly or quarterly to maintain performance and relevance.",
    },
    {
      question: "How often is it recommended to refresh my website?",
      answer:
        "A complete website refresh is recommended every 2-3 years to keep up with design trends, technology updates, and user expectations. However, regular content updates, blog posts, and minor improvements should happen continuously to maintain engagement and search rankings.",
    },
  ];

  return (
    <div>
      <div className="bg-[white] py-10">
        <div className="container-fluid cmpad">
          <div className="hero-section">
            {/* <div className="get-started-tag">Get started today</div> */}

            <h2 className="text-3xl md:text-5xl leading-tight font-medium mb-3 text-[#333]">
              Get started <span className="text-[var(--primary-color)]">with</span> easyinstance
            </h2>
            <p className="max-w-xl mx-auto text-[#58586b] leading-relaxed mb-10">
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
                className="px-10 h-full py-4 bg-[var(--primary-color)] text-white rounded-full  hover:bg-[#454685] transition duration-300"
              >
                Started Free Today
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid cmpad py-10 lg:py-20 text-center">
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
                className={`accordion-header ${
                  activeIndex === index ? "active" : ""
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
                className={`accordion-content ${
                  activeIndex === index ? "active" : ""
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
