import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NightSerum = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="bg-white text-black min-h-screen px-5 pt-12 pb-24 md:flex md:items-center md:justify-center md:px-10 md:pt-16 md:pb-32"
      style={{ opacity: fadeIn, transition: "opacity 1s ease-in-out" }}
    >
      {/* Mobile Back Button */}
      <div className="mb-8 mt-16 ml-2 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center font-lato font-light text-darkblue hover:text-blue-600 transition-all duration-300"
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/button.png"}
            alt="Back"
            className="h-5 w-auto mr-2"
          />
          <span className="text-base">Back</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-col md:flex-row md:max-w-6xl md:w-full md:space-x-10 max-w-[500px] mx-auto pt-4 px-2 md:px-0 md:pt-24">
        {/* Image Container */}
        <div className="w-full md:w-1/2 md:pr-5 md:pb-5 md:pl-0 mb-6 md:mb-0 -mt-4 md:mt-0">
          {/* Desktop Back Button */}
          <div className="hidden md:flex items-start -mt-2 -ml-1 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center font-lato font-light text-darkblue hover:text-blue-600 transition-all duration-300"
            >
              <img
                src={process.env.PUBLIC_URL + "/assets/button.png"}
                alt="Back"
                className="h-5 w-auto mr-2"
              />
              <span className="text-lg">Back</span>
            </button>
          </div>

          <img
            src={process.env.PUBLIC_URL + "/assets/nightserum.png"}
            alt="CUTISTEM™ Night Serum"
            className="w-full h-auto rounded-lg mx-auto max-w-[280px] md:max-w-none"
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 md:p-5 md:pt-5 pl-2 md:pl-4 -mt-1 md:mt-12">
          <div className="text-center md:text-left mb-4">
            <h1 className="font-fanwood text-2xl md:text-3xl text-darkblue mb-2 md:mb-4 font-normal">
              CUTISTEM™ Night Serum
            </h1>
            <p className="font-lato font-light text-lg md:text-xl text-gray-500">$37.95</p>
          </div>

          <div className="space-y-5 md:space-y-6">
            <p className="font-lato font-light text-gray-600 text-sm md:text-base leading-snug pr-1 mt-6 md:mt-0">
              A night skin care treatment that helps replenish, rejuvenate, and protect your skin overnight. 
              This formula contains oat extract to balance the skin microbiome, along with hyaluronic acid 
              and co-enzyme Q10 to support better skin repair while you sleep.
            </p>

            <div className="space-y-3 md:space-y-4">
              <div className="pr-1">
                <h2 className="font-lato text-base md:text-lg text-darkblue mb-1 md:mb-3 font-medium md:font-normal">
                  Benefits:
                </h2>
                <ul className="list-disc list-inside font-lato font-light text-gray-600 text-sm md:text-base space-y-1.5 md:space-y-2">
                  <li>Replenishes and rejuvenates skin overnight</li>
                  <li>Balances skin microbiome</li>
                  <li>Supports skin repair while you sleep</li>
                </ul>
              </div>

              <div className="pr-1">
                <h2 className="font-lato text-base md:text-lg text-darkblue mb-1 md:mb-3 font-medium md:font-normal">
                  Key Ingredients:
                </h2>
                <ul className="list-disc list-inside font-lato font-light text-gray-600 text-sm md:text-base space-y-1.5 md:space-y-2">
                  <li>Stem Cells Extract</li>
                  <li>Oat Extract</li>
                  <li>Hyaluronic Acid</li>
                  <li>Co-enzyme Q10</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightSerum;