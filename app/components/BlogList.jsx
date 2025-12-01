"use client";
import React, { useState } from "react";
import BlogSearch from "../components/BlogSearch";

export default function BlogList({ initialBlogs }) {
    const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredBlogs(initialBlogs);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = initialBlogs.filter(blog =>
            (blog.title && blog.title.toLowerCase().includes(lowerQuery)) ||
            (blog.subtitle && blog.subtitle.toLowerCase().includes(lowerQuery)) ||
            (blog.tags && blog.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery)))
        );
        setFilteredBlogs(filtered);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                    Our <span className="text-[var(--primary-color)] relative inline-block">
                        Blogs
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-[var(--primary-color)] opacity-20" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7501 9.99995 148.001 -3.00002 198.001 2.99999" stroke="currentColor" strokeWidth="3"></path></svg>
                    </span>
                </h2>
                <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed mb-10">
                    Explore our latest articles: actionable insights, industry trends,
                    and practical tips to help you optimize workflows and grow your
                    business with confidence.
                </p>

                <BlogSearch onSearch={handleSearch} />
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredBlogs.map((blog) => (
                    <article
                        key={blog.id}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                            <a href={`/blogs/${blog.slug}`} className="block w-full h-full">
                                <img
                                    src={blog.image_url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.image_url}` : "/img/blog.jpg"}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/img/blog.jpg" }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </a>

                        </div>

                        {/* Content Container */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                {blog.published_date}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[var(--primary-color)] transition-colors">
                                <a href={`/blogs/${blog.slug}`}>
                                    {blog.title}
                                </a>
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags && blog.tags.map((tag) => (
                                    <span key={tag.id} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                {blog.subtitle || 'Click to read full article...'}
                            </p>

                            <div className="pt-4 border-t border-gray-100 mt-auto">
                                <a
                                    href={`/blogs/${blog.slug}`}
                                    className="inline-flex items-center text-sm font-semibold text-[var(--primary-color)] hover:text-[#454685] transition-colors group/link"
                                >
                                    Read Article
                                    <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {filteredBlogs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
                    <p className="text-gray-500">
                        {searchQuery ? `No posts found matching "${searchQuery}"` : "Check back later for new updates!"}
                    </p>
                </div>
            )}
        </div>
    );
}
