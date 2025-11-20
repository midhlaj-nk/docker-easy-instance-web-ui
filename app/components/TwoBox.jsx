import React from "react";

function TwoBox() {
  return (
    <div className="bg-white text-center">
      <div className="container-fluid cmpad py-10 lg:py-20">
        <h2 className="text-4xl leading-tight font-medium mb-3">
          Your <span className="text-[var(--primary-color)]">Growth</span> Our
          Commitment.
        </h2>
        <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-10">
          Use our platform to scale your business: instant Odoo deployment,
          automatic updates, and elastic cloud resources that grow with you
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="glow-effect"></div>
            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="icon"
              >
                <g
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0m1 7v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl font-semibold leading-tight mb-3 text-[#333]">
              Seamless Odoo Deployment
            </h2>

            <p className="max-w-[90%] mx-auto text-[#58586b] leading-relaxed">
              Set up your Odoo instance instantly without complex installations
              or delays.
            </p>
          </div>

          <div className="feature-card">
            <div className="glow-effect"></div>
            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="icon"
              >
                <g fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 21h-4l-.551-2.48a7 7 0 0 1-1.819-1.05l-2.424.763l-2-3.464l1.872-1.718a7 7 0 0 1 0-2.1L3.206 9.232l2-3.464l2.424.763A7 7 0 0 1 9.45 5.48L10 3h4l.551 2.48a7 7 0 0 1 1.819 1.05l2.424-.763l2 3.464l-1.872 1.718a7 7 0 0 1 0 2.1l1.872 1.718l-2 3.464l-2.424-.763a7 7 0 0 1-1.819 1.052z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl font-semibold leading-tight mb-3 text-[#333]">
              Automatic Updates & Maintenance
            </h2>
            <p className="max-w-[90%] mx-auto text-[#58586b] leading-relaxed">
              Stay on the latest Odoo version with zero effort updates and
              security handled for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoBox;
