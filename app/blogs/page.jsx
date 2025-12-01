import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import BlogList from "../components/BlogList";

// This is a Server Component by default in Next.js 13+ app directory
export const metadata = {
  title: "Our Blogs | Insights & Updates",
  description: "Explore our latest articles, actionable insights, and industry trends to help you optimize workflows and grow your business.",
};

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blogs`, {
      cache: 'no-store', // Ensure fresh data on every request, or use 'force-cache' / revalidate for SSG/ISR
    });

    if (!res.ok) {
      throw new Error('Failed to fetch blogs');
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Header />
      <div className="pt-32 pb-20 flex-grow">
        <BlogList initialBlogs={blogs} />
      </div>
      <Footer />
    </div>
  );
}
