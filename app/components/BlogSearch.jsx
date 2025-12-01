"use client";
import React, { useState } from "react";

export default function BlogSearch({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="max-w-2xl mx-auto mb-10 relative">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-14 pr-12 py-4 bg-white border border-gray-200 rounded-full leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 ease-in-out text-base"
                    placeholder="Search articles, topics, or keywords..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            onSearch("");
                        }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
