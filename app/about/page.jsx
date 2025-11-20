import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function page() {
  return (
    <div>
      <Header />
      <div className="pt-32 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl leading-tight text-center font-semibold mb-3">
              About <span className="text-[var(--primary-color)]">Us</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Empower your business with our platform: fast Odoo setup, seamless
              updates, and scalable cloud infrastructure that evolves alongside
              your growth.
            </p>
            <nav className="breadcrumb justify-center mt-5 text-sm sm:text-base">
              <a href="#">Home</a>
              <span>›</span>
              <span className="active">About Us</span>
            </nav>
          </div>

          <div className="bg-white p-4 sm:p-6 md:p-10 rounded-lg mb-5">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-center order-1">
                <h2 className="text-2xl sm:text-3xl leading-tight font-semibold mb-3">
                  Empowering Businesses <br />
                  With Innovation
                  <span className="text-[var(--primary-color)]"> and </span>
                  Simplicity
                </h2>
                <p className="text-[#58586b] leading-relaxed mb-3">
                  Easy Instance transforms complex SaaS technology into a
                  straightforward, user-friendly experience. No steep learning
                  curves, no unnecessary delays—just a powerful platform
                  designed to help your team succeed from day one.
                </p>
                <p className="text-[#58586b] leading-relaxed mb-5">
                  With intuitive tools, seamless integrations, and effortless
                  scalability, Easy Instance ensures your business runs smarter,
                  faster, and more efficiently.
                </p>
                <div className="flex flex-wrap gap-6 sm:gap-8">
                  <div className="item">
                    <span className="checkmark">✓</span>
                    <span className="text">On demand support</span>
                  </div>
                  <div className="item">
                    <span className="checkmark">✓</span>
                    <span className="text">Information Sharing</span>
                  </div>
                  <div className="item">
                    <span className="checkmark">✓</span>
                    <span className="text">Cloud Technology</span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 order-2">
                <img
                  src="/img/about1.png"
                  alt="Team collaborating using Easy Instance platform"
                  className="mx-auto w-full h-auto max-w-xs sm:max-w-md md:max-w-lg"
                />
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
