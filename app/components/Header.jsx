'use client';
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";

function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isActive ? "bg-white [box-shadow:0px_0px_20px_rgb(102_103_171_/_10%)]" : " [box-shadow:0px_0px_0px_rgb(102_103_171_/_0%)] bg-[unset]"
        }`}
      >
        <div className="container-fluid cmpad">
          <div className={`bg-white flex gap-6 justify-between items-center rounded-full [box-shadow:0px_0px_20px_rgb(102_103_171_/_3%)] transition-all duration-300 ${isActive ? "h-15 mt-0" : "h-18 mt-3 p-4"}`}>
            <a href="/" className="xl:w-1/3 sm:pl-1">
              <Image src="/logo/logo1.svg" alt="Logo" width={140} height={30} />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 w-2/3 items-center justify-between">
              <ul className="flex space-x-6 text-[15px]">
                <li>
                  <a
                    href="/about"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="/features"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
              <a
                href="/login"
                className="ml-4 px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M12 13c2.396 0 4.575.694 6.178 1.672c.8.488 1.484 1.064 1.978 1.69c.486.615.844 1.351.844 2.138c0 .845-.411 1.511-1.003 1.986c-.56.45-1.299.748-2.084.956c-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C7.425 13.695 9.605 13 12 13m0-11a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                    />
                  </g>
                </svg>
                Let’s Go
              </a>
            </nav>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              className="lg:hidden text-[var(--primary-color)] inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition duration-300"
              onClick={() => setIsMobileOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          {/* Mobile menu panel with animation */}
          <div
            className={`lg:hidden bg-white rounded-2xl overflow-hidden transform transition-all duration-300 ${
              isMobileOpen ? "mt-2 opacity-100 translate-y-0 max-h-[420px]" : "mt-0 opacity-0 -translate-y-2 max-h-0 pointer-events-none"
            }`}
          >
            <div className="p-4">
              <ul className="space-y-3 text-[15px] text-left">
                <li>
                  <a href="/about" className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]">About Us</a>
                </li>
                <li>
                  <a href="/services" className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]">Our Services</a>
                </li>
                <li>
                  <a href="/features" className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]">Features</a>
                </li>
                <li>
                  <a href="/blogs" className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]">Blogs</a>
                </li>
                <li>
                  <a href="/contact" className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]">Contact Us</a>
                </li>
              </ul>
              <a
                href="#"
                className="mt-4 w-full inline-flex justify-center px-6 py-3 bg-[var(--primary-color)] text-white rounded-full items-center hover:bg-[#454685] transition duration-300"
              
              >
                Let’s Go
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
