"use client";
import React from "react";

function Pricing() {
  const logos = [
    "/img/plane.webp",
    "/img/wordpress.png",
    "/img/ghost.png",
    "/img/jenkins.png",
    "/img/odoo.png",
    "/img/github.png",
    "/img/discourse.png",
    "/img/kuber.png",
    "/img/plane.png",
    "/img/nextcloud.png",
    "/img/googledrive.png",
    "/img/onedrive.png",
    "/img/docker.png",
    "/img/amazon.png",
    "/img/grafana.png",
    "/img/chatgpt.png",
  ];

  const marqueeLogos = [...logos, ...logos];

  return (
    <div className="bg-white text-center">
      <div className="container-fluid cmpad py-10 lg:py-20">
        <h2 className="text-4xl leading-tight font-medium mb-3">
          Select Plan For
          <span className="text-[var(--primary-color)]"> Your </span> Business.
        </h2>
        <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-10">
          Easy Instance brings Odoo's power in a simple, user friendly way no
          steep learning curves, just a platform that empowers your team from
          day one.
        </p>
        <a
          href=""
          className="w-52 px-10 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300"
        >
          View All Plans
        </a>
        <div className="pricing-container">
          {/* Weekly Classic */}
          <div className="pricing-card">
            <div className="price-container">
              <div className="price">
                $14
                <span className="price-period">/Week</span>
              </div>
            </div>
            <h5 className="font-semibold text-[18px] mb-2">Weekly Classic</h5>
            <p className="plan-subtitle">
              Simple weekly access with essential features and limited users.
            </p>

            <ul className="features-list">
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">1 Custom Addons</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">2 Users</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Free Domain Mapping</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">GitHub Integration</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Support Automated Renewal</span>
              </li>
            </ul>

            <button className="cta-button">Subscribe</button>
          </div>

          {/* Weekly Premium */}
          <div className="pricing-card featured">
            <div className="save-badge">Best Value</div>
            <div className="price-container">
              <div className="price">
                $37
                <span className="price-period">/Week</span>
              </div>
            </div>
            <h5 className="font-semibold text-[18px] mb-2">Weekly Premium</h5>
            <p className="plan-subtitle">
              Premium weekly access with enhanced features and higher user
              capacity.
            </p>

            <ul className="features-list">
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">1 Custom Addons</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">5 Users</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Free Domain Mapping</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">GitHub Integration</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Support Automated Renewal</span>
              </li>
            </ul>

            <button className="cta-button featured">Subscribe</button>
          </div>

          {/* Monthly Classic */}
          <div className="pricing-card">
            <div className="price-container">
              <div className="price">
                $54
                <span className="price-period">/Month</span>
              </div>
            </div>
            <h5 className="font-semibold text-[18px] mb-2">Monthly Classic</h5>
            <p className="plan-subtitle">
              Cost-effective monthly plan with essential features and custom
              addons.
            </p>

            <ul className="features-list">
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">1 Custom Addons</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">3 Users</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Free Domain Mapping</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">GitHub Integration</span>
              </li>
              <li className="feature-item">
                <div className="feature-icon included">✓</div>
                <span className="feature-text">Support Automated Renewal</span>
              </li>
            </ul>

            <button className="cta-button">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="container-fluid cmpad py-10 lg:py-20">
        <h2 className="text-4xl leading-tight font-medium mb-3">
          Seamless Integrations For{" "}
          <span className="text-[var(--primary-color)]">Smarter</span>{" "}
          Operations.
        </h2>
        <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed mb-3">
          Effortlessly connect with a variety of third party tools and services,
          enhancing functionality and streamlining workflows
        </p>

        <div className="slider overflow-hidden w-full">
          <div
            className="slide-track flex"
            style={{ animation: "scroll 80s linear infinite" }}
          >
            {marqueeLogos.map((logo, idx) => (
              <div className="slide" key={idx}>
                <img
                  src={logo}
                  alt={`logo ${idx % logos.length}`}
                  className="h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
