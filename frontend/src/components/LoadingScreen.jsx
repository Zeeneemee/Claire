import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          navigate("/result"); // ✅ Auto-redirect to result page
          return 100;
        }
        return oldProgress + 5; // Increase progress smoothly
      });
    }, 200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-darkblue transition-opacity opacity-100">
      <h1 className="text-3xl font-fanwood mb-8">Analyzing Your Skin...</h1>
      <div className="w-64 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-navy"
          style={{
            width: `${progress}%`,
            transition: "none", // Disable transition for smoother update
          }}
        ></div>
      </div>
    </div>
  );
}
