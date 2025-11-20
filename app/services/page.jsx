import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function page() {
  const features = [
    {
      title: "One Click Setup",
      description:
        "Launch Odoo in minutes with pre configured apps tailored to your business.",
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
            d="M4 21q-.825 0-1.412-.587T2 19v-4h7v2h6v-2h7v4q0 .825-.587 1.413T20 21zm7-6v-2h2v2zm-9-2V8q0-.825.588-1.412T4 6h4V4q0-.825.588-1.412T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v5h-7v-2H9v2zm8-7h4V4h-4z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "No Learning Curve",
      description:
        "A clean, intuitive interface that lets your team start working from day one.",
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
            d="M14.754 10c.966 0 1.75.784 1.75 1.75v4.749a4.501 4.501 0 0 1-9.002 0V11.75c0-.966.783-1.75 1.75-1.75zm-7.623 0a2.7 2.7 0 0 0-.62 1.53l-.01.22v4.749c0 .847.192 1.649.534 2.365Q6.539 18.999 6 19a4 4 0 0 1-4-4.001V11.75a1.75 1.75 0 0 1 1.606-1.744L3.75 10zm9.744 0h3.375c.966 0 1.75.784 1.75 1.75V15a4 4 0 0 1-5.03 3.866c.3-.628.484-1.32.525-2.052l.009-.315V11.75c0-.665-.236-1.275-.63-1.75M12 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6m6.5 1a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Seamless Upgrades",
      description:
        "Stay current with the latest Odoo features, with zero downtime or hassle.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M5.7 9c.4-2 2.2-3.5 4.3-3.5c1.5 0 2.7.7 3.5 1.8l1.7-2C14 3.9 12.1 3 10 3C6.5 3 3.6 5.6 3.1 9H1l3.5 4L8 9zm9.8-2L12 11h2.3c-.5 2-2.2 3.5-4.3 3.5c-1.5 0-2.7-.7-3.5-1.8l-1.7 1.9C6 16.1 7.9 17 10 17c3.5 0 6.4-2.6 6.9-6H19z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Scalable Hosting",
      description:
        "Scale resources instantly as your business grows, with no performance limits.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="icons"
        >
          <path
            fill="currentColor"
            d="M16.5 24c0 1.9.085 3.742.243 5.5h14.514c.158-1.758.243-3.6.243-5.5s-.085-3.742-.244-5.5H16.745c-.16 1.758-.245 3.6-.245 5.5m-2.767-5.5A64 64 0 0 0 13.5 24c0 1.886.08 3.727.232 5.5H2.177C1.735 27.74 1.5 25.897 1.5 24s.235-3.74.677-5.5zm3.366-3H30.9c-.444-3.027-1.116-5.726-1.949-7.943c-.779-2.073-1.669-3.648-2.58-4.676C25.458 1.849 24.652 1.5 24 1.5s-1.458.35-2.372 1.38c-.911 1.03-1.801 2.604-2.58 4.677c-.833 2.217-1.505 4.916-1.95 7.943m17.169 3c.153 1.773.233 3.614.233 5.5s-.08 3.727-.232 5.5h11.555c.442-1.76.677-3.603.677-5.5s-.235-3.74-.677-5.5zm10.573-3H33.931c-.47-3.388-1.214-6.45-2.171-8.998c-.611-1.626-1.323-3.082-2.134-4.293c6.92 1.782 12.55 6.773 15.212 13.291m-30.77 0H3.161C5.822 8.982 11.453 3.991 18.373 2.21c-.81 1.21-1.523 2.666-2.134 4.292c-.957 2.548-1.7 5.61-2.17 8.998m-.003 17H3.161c2.66 6.515 8.286 11.504 15.2 13.288c-.81-1.21-1.52-2.666-2.13-4.29c-.955-2.55-1.697-5.61-2.165-8.998m14.894 7.944c.83-2.217 1.5-4.916 1.944-7.944H17.096c.443 3.028 1.113 5.727 1.944 7.944c.778 2.073 1.667 3.647 2.58 4.675c.912 1.03 1.72 1.381 2.38 1.381s1.468-.351 2.38-1.381c.913-1.028 1.802-2.602 2.58-4.675m2.809 1.053c.955-2.548 1.697-5.61 2.165-8.997h10.905c-2.66 6.515-8.286 11.504-15.2 13.288c.81-1.21 1.52-2.666 2.13-4.29"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "Secure by Default",
      description:
        "Your data is protected with enterprise-grade security and daily backups.",
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
            d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6z"
          />
        </svg>
      ),
      link: "#",
    },
    {
      title: "24/7 Support",
      description:
        "Our expert team is always available to keep your operations running smoothly.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="icons"
        >
          <g fill="none">
            <path
              fill="currentColor"
              d="M4 18v-7c0-2.333 2.4-7 8-7s8 4.667 8 7v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h3v-3c0-2.333-2.4-7-8-7s-8 4.667-8 7v3h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 0v-3c0-2.333 2.4-7 8-7s8 4.667 8 7v3m0 0v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"
            />
          </g>
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
            <nav className="breadcrumb justify-center mt-5">
              <a href="#">Home</a>
              <span>›</span>             
              <span className="active">Our Services</span>
            </nav>
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
