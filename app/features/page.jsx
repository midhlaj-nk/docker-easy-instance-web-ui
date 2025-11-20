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
            <h2 className="text-4xl leading-tight text-center font-semibold mb-3">
              Our <span className="text-[var(--primary-color)]">Features</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Use our platform to scale your business: instant Odoo deployment,
              automatic updates, and elastic cloud resources that grow with you
            </p>
            <nav className="breadcrumb justify-center mt-5">
              <a href="#">Home</a>
              <span>›</span>
              <span className="active">Our Features</span>
            </nav>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl">
            <div className="mb-16">
              <video
                playsInline
                muted
                loop
                autoPlay
                className="w-full h-auto"
                src="/img/video.mp4"
                poster="/images/play-thumb.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10 bg-[white] py-3">
              <a
                href="#tab1"
                className="border border-[#c7c7c7] rounded-full px-6 py-3 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition duration-300"
              >
                Resource Monitoring
              </a>
              <a
                href="#tab2"
                className="border border-[#c7c7c7] rounded-full px-6 py-3 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition duration-300"
              >
                Domain Management
              </a>
              <a
                href="#tab3"
                id="tab1"
                className="border border-[#c7c7c7] rounded-full px-6 py-3 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition duration-300"
              >
                See what's new
              </a>
            </div>

            <div className="mb-20">
              <div>
                <span className="flex m-auto w-max px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
                  Bring your ideas to life
                </span>
                <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4 text-center">
                  Monitor Your{" "}
                  <span className="text-[var(--primary-color)]">
                    Resources{" "}
                  </span>
                  Effortlessly
                </h2>
                <p className="text-[#58586b] max-w-3xl m-auto leading-relaxed text-sm md:text-base text-center mb-5">
                  Discover real-time insights into your system’s performance and
                  keep everything running smoothly. Quickly spot issues and
                  optimize resources with ease.
                </p>
                <a
                  href="#"
                  className="px-10 py-3 w-max m-auto bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                >
                  Experience the software
                </a>
              </div>

              <div className="mt-15">
                <div className="p-5 md:p-10 bg-[#f6f7ff] rounded-2xl border border-[#dfe0ff]  mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4">
                        Use our platform <br />
                        To scale{" "}
                        <span className="text-[var(--primary-color)]">
                          your{" "}
                        </span>
                        business
                      </h2>
                      <p className="text-[#58586b] leading-relaxed text-sm md:text-base mb-5">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tempore animi suscipit quaerat natus at saepe, molestiae
                        numquam, facilis quasi libero labore? Ratione.
                      </p>
                      <a
                        href="#"
                        className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                      >
                        Try Demo
                      </a>
                    </div>

                    <div className="lg:col-span-6 flex justify-center lg:justify-end">
                      <img
                        src="/img/img2.png"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  <div className="order-2 lg:order-1 lg:col-span-7 h-full">
                    <div className="relative h-full">
                      {/* Image */}
                      <img
                        src="/img/soft1.jpg"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover"
                      />

                      {/* Black Overlay */}
                      <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

                      {/* Caption */}
                      <p className="absolute bottom-8 left-8 right-8 text-white text-xl md:text-4xl font-medium">
                        Efficiency meets <br />
                        scalability meets effortless management.
                      </p>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 lg:col-span-5 h-full">
                    <div className="relative h-full">
                      {/* Image */}
                      <img
                        src="/img/soft2.jpg"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover h-full"
                      />

                      {/* Black Overlay */}
                      <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

                      {/* Caption */}
                      <p
                        id="tab2"
                        className="absolute bottom-8 left-8 right-8 text-white text-xl md:text-4xl font-medium"
                      >
                        Speed meets <br />
                        simplicity meets seamless control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4 text-center">
                Watch it scale
                <br /> And unlock the future.
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-100% md:max-w-[85%] m-auto mb-10 md:mb-20 mt-10 md:mt-20">
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <span className="w-max mb-3 px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
                    Bring your ideas to life
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-3xl leading-tight font-semibold mb-4">
                    Use our platform <br />
                    To scale{" "}
                    <span className="text-[var(--primary-color)]">your </span>
                    business
                  </h2>
                  <p className="text-[#58586b] leading-relaxed text-sm md:text-base mb-5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore animi suscipit.
                  </p>
                  <a
                    href="#"
                    className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                  >
                    Try Demo
                  </a>
                </div>

                <div className="lg:col-span-6 flex justify-center lg:justify-end">
                  <img
                    src="/img/img2.png"
                    alt="Business Growth"
                    className="w-full max-w-full rounded-2xl object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-100% md:max-w-[85%] m-auto">
                <div className="lg:order-1 order-2 lg:col-span-6 flex justify-center lg:justify-end">
                  <img
                    src="/img/img2.png"
                    alt="Business Growth"
                    className="w-full max-w-full rounded-2xl object-cover"
                  />
                </div>
                <div className="lg:order-2 order-1 lg:col-span-6 flex flex-col justify-center">
                  <span className="w-max mb-3 px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
                    Bring your ideas to life
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-3xl leading-tight font-semibold mb-4">
                    Use our platform <br />
                    To scale{" "}
                    <span className="text-[var(--primary-color)]">your </span>
                    business
                  </h2>
                  <p className="text-[#58586b] leading-relaxed text-sm md:text-base mb-5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore animi.
                  </p>
                  <a
                    href="#"
                    className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                  >
                    Try Demo
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-100% md:max-w-[85%] m-auto mb-10 md:mb-20 mt-10 md:mt-20">
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <span className="w-max mb-3 px-5 py-2 bg-[#ffc98f] text-black rounded-full text-[13px]">
                    Bring your ideas to life
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-3xl leading-tight font-semibold mb-4">
                    Use our platform <br />
                    To scale{" "}
                    <span className="text-[var(--primary-color)]">your </span>
                    business
                  </h2>
                  <p className="text-[#58586b] leading-relaxed text-sm md:text-base mb-5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore animi suscipit.
                  </p>
                  <a
                    href="#"
                    className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                  >
                    Try Demo
                  </a>
                </div>

                <div className="lg:col-span-6 flex justify-center lg:justify-end">
                  <img
                    src="/img/img2.png"
                    alt="Business Growth"
                    className="w-full max-w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>

            <div id="tab3">
              <div className="p-5 md:p-15 bg-[#f6f7ff] rounded-2xl border border-[#dfe0ff]">
                <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold text-center mb-10">
                  New ways Easy
                  <br /> Instance helps you smarter.
                </h2>

                <div className="p-5 lg:p-10 bg-[#ffffff] rounded-2xl mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4">
                        Easy Instance and <br />
                        Other ways to simplify
                        <br />
                        <span className="text-[var(--primary-color)]">
                          Your{" "}
                        </span>
                        workflow.
                      </h2>
                      <a
                        href="#"
                        className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                      >
                        Try Demo
                      </a>
                    </div>

                    <div className="lg:col-span-6 flex justify-center lg:justify-end">
                      <img
                        src="/img/f1.jpg"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-5 lg:p-10 bg-[#ffffff] rounded-2xl mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="order-2 lg:order-1 lg:col-span-6 flex justify-center lg:justify-end">
                      <img
                        src="/img/f2.jpg"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover"
                      />
                    </div>
                    <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4">
                        Connect and <br />
                        Manage on all your
                        <br />{" "}
                        <span className="text-[var(--primary-color)]">
                          Favorite{" "}
                        </span>
                        devices.
                      </h2>
                      <a
                        href="#"
                        className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                      >
                        Try Demo
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-5 lg:p-10 bg-[#ffffff] rounded-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold mb-4">
                        Enhanced security and <br /> Advanced to scale{" "}
                        <span className="text-[var(--primary-color)]">
                          <br />
                          Threat{" "}
                        </span>
                        protection.
                      </h2>
                      <a
                        href="#"
                        className="px-10 py-3 w-max bg-[var(--primary-color)] text-white rounded-full flex gap-2 hover:bg-[#454685] transition duration-300"
                      >
                        Try Demo
                      </a>
                    </div>

                    <div className="lg:col-span-6 flex justify-center lg:justify-end">
                      <img
                        src="/img/f3.jpg"
                        alt="Business Growth"
                        className="w-full max-w-full rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>
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
