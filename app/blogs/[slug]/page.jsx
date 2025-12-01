import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";

// Fetch blog data
async function getBlog(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blogs/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching blog:", error);
        return null;
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    const blog = await getBlog(params.slug);

    if (!blog) {
        return {
            title: 'Blog Not Found',
        };
    }

    return {
        title: blog.title,
        description: blog.subtitle || `Read ${blog.title} on our blog.`,
        openGraph: {
            title: blog.title,
            description: blog.subtitle,
            images: blog.image_url ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.image_url}`] : [],
        },
    };
}

export default async function BlogDetail({ params }) {
    const blog = await getBlog(params.slug);

    if (!blog) {
        return (
            <div>
                <Header />
                <div className="pt-32 pb-10 text-center min-h-[50vh]">
                    <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
                    <a href="/blogs" className="text-[var(--primary-color)] hover:underline">Back to Blogs</a>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="pt-32 pb-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                    {/* Breadcrumb */}
                    <Breadcrumb
                        className="mb-8"
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Our Blogs", href: "/blogs" },
                            { label: blog.title }
                        ]}
                    />

                    <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

                        {/* Hero Section with Background Image */}
                        <div className="relative h-[400px] md:h-[500px] w-full flex items-end justify-start group overflow-hidden">
                            {/* Background Image */}
                            {blog.image_url ? (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.image_url})`
                                        }}
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-gray-900 z-0" />
                            )}

                            {/* Content Overlay */}
                            <div className="relative z-20 p-8 md:p-12 w-full max-w-5xl mx-auto text-white">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-sm">
                                    {blog.title}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {blog.tags && blog.tags.map((tag) => (
                                        <span key={tag.id} className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-gray-200 text-sm font-medium">
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span>{blog.published_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-12 bg-white">
                            <div
                                className="blog-content max-w-4xl mx-auto"
                                dangerouslySetInnerHTML={{
                                    __html: blog.content ? blog.content.replace(/src="\/web\/image\//g, `src="${process.env.NEXT_PUBLIC_BACKEND_URL}/web/image/`) : ''
                                }}
                            />
                        </div>

                    </article>

                </div>
            </div>
            <Footer />
        </div>
    );
}
