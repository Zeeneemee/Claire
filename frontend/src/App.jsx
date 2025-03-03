import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import SkinProfileInfo from "./components/SkinProfileInfo";
import BehindTechInfo from "./components/BehindTechInfo";
import OurProducts from "./components/OurProducts";
import LoadingScreen from "./components/LoadingScreen";
import CameraCapture from "./components/CameraCapture";
import SkinAnalysisResult from "./components/SkinAnalysisResult";
import ProductPage from "./components/ProductPage";
import SkinAnalysisLanding from "./components/SkinAnalysisLanding";
import Routine from "./components/SkincareroutinePage";
import Signup from "./components/SignupPage";
import Terms from "./components/TermsPage";
import PrivacyPolicy from "./components/Privacy";
import ContactUs from "./components/ContactUs"; // Imported ContactUs component

// Importing individual product pages
import MoisturiserMen from "./components/productpages/MoisturiserMen";
import NightRevitaliserMen from "./components/productpages/NightRevitaliserMen";
import HandCream from "./components/productpages/HandCream";
import SkincareSet from "./components/productpages/SkincareSet";
import DayCream from "./components/productpages/DayCream";
import NightSerum from "./components/productpages/NightSerum";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <div className="text-navy">
        <NavBar scrolled={scrollY > 50} />
        <Routes>
          {/* Home page route */}
          <Route
            path="/"
            element={
              <>
                <HeroSection scrollY={scrollY} />
                <AboutUs />
                <SkinProfileInfo />
                <BehindTechInfo />
                <OurProducts />
              </>
            }
          />

          {/* Other routes */}
          <Route path="/camera" element={<CameraCapture />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/result" element={<SkinAnalysisResult />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/skincareroutine" element={<Routine />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contactus" element={<ContactUs />} /> {/* New route for ContactUs */}

          {/* Individual product pages */}
          <Route path="/products/moisturiser-men" element={<MoisturiserMen />} />
          <Route path="/products/night-revitaliser-men" element={<NightRevitaliserMen />} />
          <Route path="/products/hand-cream" element={<HandCream />} />
          <Route path="/products/skincare-set" element={<SkincareSet />} />
          <Route path="/products/day-cream" element={<DayCream />} />
          <Route path="/products/night-serum" element={<NightSerum />} />
          <Route path="/skinanalysis" element={<SkinAnalysisLanding />} />
        </Routes>
      </div>
    </Router>
  );
}
