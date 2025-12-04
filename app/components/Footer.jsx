"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* LEFT CONTENT */}
          <div className="relative">
            <h2 className="text-4xl text-gray-200 md:text-5xl font-bold leading-tight pb-[38px]">
              Built for performance.
              <br />
              Designed for you.
            </h2>

            {/* MOBILE LOGO — moves below H2 */}
            <div className="block md:hidden w-full mt-4">
              <Image
                src="/logo/logo.svg"
                alt="Logo"
                width={800}
                height={200}
                className="mx-auto opacity-10 brightness-0 invert"
              />
            </div>

            <button className="mt-8 px-6 py-3 bg-[#5355ce] hover:bg-[#333584FF] rounded-full text-white font-medium transition">
              Get in Touch
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:ml-[100px]">
            <h3 className="text-xl text-gray-200 md:text-3xl font-semibold mb-4">
              Stay up-to-date with the
              <br />
              latest releases.
            </h3>

            <div className="relative w-full max-w-md mt-6">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-transparent border-b border-gray-500 focus:border-white outline-none pb-2 placeholder-gray-400"
              />
              <span className="absolute right-0 top-1 text-gray-300 cursor-pointer">
                ↗
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              {[
                {
                  name: "instagram",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5" />
                    </svg>
                  ),
                },
                {
                  name: "x",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                    </svg>
                  ),
                },
                {
                  name: "youtube",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="m10 15 5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73" />
                    </svg>
                  ),
                },
                {
                  name: "facebook",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                    </svg>
                  ),
                },
                {
                  name: "linkedin",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:border-white transition cursor-pointer"
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" border-b border-gray-800 pb-10 pt-10 mb-10">
          <Image
            src="/logo/logo.svg"
            alt="Logo"
            width={1500}
            height={400}
            className="opacity-10 brightness-0 invert"
          />
        </div>

        {/* BOTTOM LINKS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2025 easy instance.</p>

          <div className="flex justify-center flex-wrap space-y-3 space-x-3">
            <Link href="#" className="hover:text-white transition">
              Docs
            </Link>
            <Link href="#" className="hover:text-white transition">
              Help Center
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms and Conditions
            </Link>
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP BACKGROUND LOGO — only on md+ screens */}
    </footer>
  );
}
