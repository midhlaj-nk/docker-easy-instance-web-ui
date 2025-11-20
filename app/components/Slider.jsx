import React from "react";

function Slider() {
  return (
    <div className="sliderbag">
      <div className="container-fluid cmpad">
        <div className="pt-10 md:pt-20 pb-38 text-center relative">
          <span className="absolute top-5 lg:top-18 left-3 lg:-left-40 float">
            <img src="/img/ar1.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="absolute right-3 top-5 lg:top-14 lg:-right-40 float">
            <img src="/img/ar2.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="absolute bottom-15 left-3 lg:-left-40 float">
            <img src="/img/ar3.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="absolute bottom-10 right-3 lg:-right-40 float">
            <img src="/img/ar4.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="hidden md:inline-block px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
            Bring your ideas to life
          </span>
          <h1 className="text-4xl md:text-5xl leading-tight font-semibold mb-3 mt-8">
            Launch Your{" "}
            <span className="inline-flex items-center w-[120px] md:w-[135px] relative top-[3px]">
              <img
                src="/logo/odoo-logo.svg"
                alt="Odoo"
                className="h-[1em] w-auto" // matches text height
              />
            </span>{" "}
            in Seconds
            <br />
            Scale <span className="text-[var(--primary-color)]">
              Without
            </span>{" "}
            Limits.
          </h1>

          <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed">
            Set up Odoo in just seconds. Enjoy effortless scalability, automatic
            updates, and reliable cloud performance so you can focus on growing
            your business.
          </p>
          <div className="flex justify-center gap-2 mt-10">
            <a
              href=""
              className="w-52 px-10 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#454685] transition duration-300"
            >
              Get Started{" "}
            </a>
            <a
              href=""
              className="w-52 px-6 py-3 text-[#58586b] bg-[white] border-[#0000001a] border-2 rounded-full hover:bg-[#454685] hover:text-white transition duration-300"
            >
              Our Features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
