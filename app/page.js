import Faq from "./components/Faq";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Pricing from "./components/Pricing";
import Slider from "./components/Slider";
import TwoBox from "./components/TwoBox";

export default function Home() {
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
