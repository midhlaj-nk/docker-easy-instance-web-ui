import React from "react";

function Slider() {
  return (
    <div className="cmpad relative">
      <div className="lg:h-screen pt-40 md:pt-30 flex flex-col justify-center">
        <div className="opacity-80">
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-35 animate-zoom-pulse delay-1 left-[15%]">
            <img src="/img/icon1.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-[38%] left-0 lg:left-[10%] animate-zoom-pulse delay-2">
            <img src="/img/icon2.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-[60%] left-[15%] animate-zoom-pulse delay-3">
            <img src="/img/icon4.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute bottom-20 animate-zoom-pulse delay-4">
            <img src="/img/icon5.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-35 right-[15%] animate-zoom-pulse delay-5">
            <img src="/img/icon6.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-[38%] right-0 lg:right-[10%] animate-zoom-pulse delay-6">
            <img src="/img/icon7.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute top-[60%] right-[15%] animate-zoom-pulse delay-7">
            <img src="/img/icon8.svg" alt="" className="w-9"/>
          </span>
          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute bottom-20 right-0 animate-zoom-pulse delay-8">
            <img src="/img/icon9.svg" alt="" className="w-9"/>
          </span>
        </div>

        <div className="text-center relative m-auto pb-20 lg:pb-0">
          {/* <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute -top-10 lg:-top-5 left-3 lg:-left-40 float">
            <img src="/img/ar1.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute right-3 -top-8 lg:-top-2 lg:-right-40 float">
            <img src="/img/ar2.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute -bottom-4 left-3 lg:-left-40 float">
            <img src="/img/ar3.svg" alt="" className="w-35 md:w-40" />
          </span>

          <span className="bg-[#f1f1ff] h-16 w-16 flex items-center justify-center rounded-full absolute -bottom-5 right-3 lg:-right-40 float">
            <img src="/img/ar4.svg" alt="" className="w-35 md:w-40" />
          </span> */}

          <span className="hidden md:inline-block px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
            Accelerate your business
          </span>
          <h1 className="text-black dark:text-black yara-font text-5xl leading-tight font-semibold mb-3 mt-8">
            Transform your{" "}
            <span className="text-[var(--primary-color)]">business</span> with{" "}
            <span className="text-[55px] odoocircle">
              <span className="text-[#714B67]">o</span>
              <span className="text-[#8F8F8F]">doo</span>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-[#58586b] leading-relaxed">
            Set up Odoo in just seconds. Enjoy effortless scalability, automatic
            updates, and reliable cloud performance so you can focus on growing
            your business.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            <a
              href="/login"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-center max-w-[90%] m-auto">
          <div className="text-black dark:text-black p-5">
            <img src="/img/efficiency.svg" alt="" className="w-8 m-auto pb-5" />
            <h5 className="text-md font-medium mb-2">Efficiency</h5>
            <p className="text-sm max-w-[280px]">
              Deploy Odoo instances in minutes with automated Docker-based setup.
               Easy Instance eliminates manual configuration, reducing deployment time while ensuring consistent and reliable environments.
            </p>
          </div>
          <div className="text-black dark:text-black lg:border-l-1 lg:border-r-1 border-gray-200 p-5">
            <img
              src="/img/scalability.svg"
              alt=""
              className="w-8 m-auto pb-5"
            />
            <h5 className="text-md font-medium mb-2">Scalability</h5>
            <p className="text-sm max-w-[280px]">
              Launch, manage, and scale multiple Odoo instances effortlessly.
               Whether for testing, staging, or production, Easy Instance adapts seamlessly as your infrastructure and user demands grow.
            </p>
          </div>
          <div className="text-black dark:text-black p-5">
            <img
              src="/img/collaboration.svg"
              alt=""
              className="w-8 m-auto pb-5"
            />
            <h5 className="text-md font-medium mb-2">Collaboration</h5>
            <p className="text-sm max-w-[280px]">
                Simplify collaboration by providing teams with isolated Odoo instances for development, QA, and client demos.
                 Shared access and standardized environments ensure smooth teamwork across projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
