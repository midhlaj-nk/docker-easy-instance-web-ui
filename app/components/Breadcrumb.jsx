import React from "react";

const Breadcrumb = ({ items, className = "justify-center mt-6" }) => {
    return (
        <nav className={`flex ${className} items-center text-sm font-medium text-gray-500`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg
                                className="w-3 h-3 text-gray-400 mx-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                        )}
                        {item.href ? (
                            <a
                                href={item.href}
                                className="inline-flex items-center hover:text-[var(--primary-color)] transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-[var(--primary-color)] font-medium truncate max-w-[200px] sm:max-w-md">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
