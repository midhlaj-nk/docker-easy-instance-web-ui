'use client'; // Add this if using Next.js 13+ App Router

import { useEffect } from 'react';
import Faq from "./components/Faq";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Pricing from "./components/Pricing";
import Slider from "./components/Slider";
import TwoBox from "./components/TwoBox";

export default function Home() {
  useEffect(() => {
    // Force remove dark mode on home page
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Also remove any data attributes that might control theme
    document.documentElement.removeAttribute('data-theme');
    
    // Cleanup: restore theme when leaving home page
    return () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Slider />
      {/* <TwoBox/> */}
      <Features />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}