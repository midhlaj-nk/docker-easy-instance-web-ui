import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

function page() {
  return (
    <div>
      <Header />
      <div className="pt-32 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="text-4xl leading-tight text-center font-semibold mb-3">
              Our <span className="text-[var(--primary-color)]">Blogs</span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Explore our latest articles: actionable insights, industry trends,
              and practical tips to help you optimize workflows and grow your
              business with confidence.
            </p>
            <nav className="breadcrumb justify-center mt-5">
              <a href="#">Home</a>
              <span>›</span>             
              <span className="active">Our Blogs</span>
            </nav>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-lg mb-5">
            <div className="blog-grid">
              <article className="blog-card">
                <div className="card-image ">
                     <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Technology</span>
                  <h2 className="card-title">
                    <a href="#">10 Essential Web Development Trends for 2025</a>
                  </h2>
                  <p className="card-excerpt">
                    Explore the latest trends in web development that will shape
                    the industry in 2025, from AI integration to advanced
                    frameworks.
                    
                  </p>
                  <a
                      href="/blog-details"
                      className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                    >
                      Read More
                    </a>
                </div>
              </article>

              <article className="blog-card">
                <div className="card-image ">
                    <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Design</span>
                  <h2 className="card-title">
                    <a href="#">The Art of Minimalist UI Design</a>
                  </h2>
                  <p className="card-excerpt">
                    Learn how to create beautiful, functional interfaces using
                    minimalist design principles that enhance user experience.
                  </p>
                  <a
                    href="/blog-details"
                    className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                  >
                    Read More
                  </a>
                </div>
              </article>

              <article className="blog-card">
                <div className="card-image ">
                     <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Business</span>
                  <h2 className="card-title">
                    <a href="#">Building a Successful Remote Team</a>
                  </h2>
                  <p className="card-excerpt">
                    Discover proven strategies for managing remote teams
                    effectively and maintaining productivity across different
                    time zones.
                   
                  </p>
                   <a
                      href="/blog-details"
                      className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                    >
                      Read More
                    </a>
                </div>
              </article>

              <article className="blog-card">
                <div className="card-image ">
                     <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Lifestyle</span>
                  <h2 className="card-title">
                    <a href="#">Work-Life Balance in the Digital Age</a>
                  </h2>
                  <p className="card-excerpt">
                    Tips and strategies for maintaining a healthy work-life
                    balance while working in today's always-connected world.
                  </p>
                  <a
                    href="/blog-details"
                    className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                  >
                    Read More
                  </a>
                </div>
              </article>

              <article className="blog-card">
                <div className="card-image ">
                     <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Travel</span>
                  <h2 className="card-title">
                    <a href="#">Digital Nomad's Guide to Southeast Asia</a>
                  </h2>
                  <p className="card-excerpt">
                    Everything you need to know about working remotely while
                    exploring the beautiful countries of Southeast Asia.
                  </p>
                  <a
                    href="/blog-details"
                    className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                  >
                    Read More
                  </a>
                </div>
              </article>

              <article className="blog-card">
                <div className="card-image ">
                     <img src="/img/blog.jpg" alt="" />
                </div>
                <div className="card-content">
                  <span className="card-category ">Technology</span>
                  <h2 className="card-title">
                    <a href="#">Getting Started with AI in Web Development</a>
                  </h2>
                  <p className="card-excerpt">
                    A beginner-friendly guide to integrating AI tools and
                    technologies into your web development workflow.
                  </p>
                  <a
                    href="/blog-details"
                    className="w-max px-10 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#454685] transition duration-300"
                  >
                    Read More
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
