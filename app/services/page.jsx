import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

function page() {
  const features = [
    {
      title: "Managed Odoo Hosting",
      description:
        "High-performance, secure, and scalable cloud hosting optimized specifically for Odoo instances.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M19 2H5c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM5 16V4h14l.002 12H5z"
          />
          <path fill="currentColor" d="M7 12h2v2H7zm4 0h2v2h11zm4 0h2v2h15z" />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Odoo Implementation",
      description:
        "Expert assistance in setting up and configuring Odoo modules to match your unique business workflows.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M20 6h-4V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Custom Development",
      description:
        "Tailor-made Odoo modules and customizations to address your specific business requirements.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M7.5 11.5L9 13l-3.5 3.5L2 13l1.5-1.5l2 2l2-2zm10.5-2l-2 2l2 2l1.5-1.5l-3.5-3.5l-1.5 1.5l2 2zM12 14.5L14.5 12l-2.5-2.5l-2.5 2.5l2.5 2.5z"
          />
          <path
            fill="currentColor"
            d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V6h16l.002 12H4z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Migration Services",
      description:
        "Seamless migration from other ERPs or older Odoo versions to the latest Odoo release with zero data loss.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8z"
          />
          <path fill="currentColor" d="M13 7h-2v5.414l3.293 3.293l1.414-1.414L13 11.586z" />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Performance Tuning",
      description:
        "Optimization of Odoo instances for speed, handling large datasets and concurrent users efficiently.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Training & Support",
      description:
        "Comprehensive training for your team and 24/7 technical support to ensure smooth operations.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8z"
          />
          <path
            fill="currentColor"
            d="M11 11h2v6h-2zm0-4h2v2h-2z"
          />
        </svg>
      ),
      link: "#",
    },
  ];
  return (
    <div>
      <Header />
      <div className="pt-32 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="text-4xl leading-tight text-center font-semibold mb-3">
              Our <span className="text-[var(--primary-color)]">Services</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Boost efficiency with our services: end-to-end Odoo support,
              seamless upgrades, and flexible cloud hosting tailored for growing
              enterprises.
            </p>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Services" }]} />
          </div>
          <div className="featuress-grid mt-13">
            {features.map((feature, index) => (
              <div className="features-card" key={index}>
                <div className="icon-containers">{feature.icon}</div>
                <h3 className="text-xl leading-tight font-medium mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6b7280] leading-relaxed mb-8 text-[15px] max-w-[350px] m-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
