import React, { useEffect, useRef, useState } from "react";
import consult from "../assets/Image/consult.png"; // Update path if needed

const ConsultationInclude = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  }, []);

  return (
    <div className="w-full md:mt-[-90px] md:px-6 py-2" ref={sectionRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">
        
        {/* LEFT TEXT */}
        <div
          className={`max-w-xl mx-auto transition-all duration-700
          ${isVisible ? "animate-slideLeft" : "opacity-0"}
        `}
        >
          <h4 className="text-3xl md:text-4xl p-3 font-semibold text-[#2C3A23] mb-4">
            All consultations include:
          </h4>

          <ul className="space-y-3 text-gray-700 text-xl md:text-2xl">
            <li>✅ 100% Secure and Confidential Service</li>
            <li>✅ Free 7-Day Follow-Up</li>
            <li>✅ Digital Prescription</li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className={`flex justify-center md:justify-end transition-all duration-700
          ${isVisible ? "animate-slideRight" : "opacity-0"}
        `}
        >
          <img
            src={consult}
            alt="Consultation"
            className="w-full max-w-md md:max-w-xl rounded-lg"
          />
        </div>
      </div>

      {/* Animation CSS */}
      <style>
        {`
          @keyframes slideLeft {
            0% {
              opacity: 0;
              transform: translateX(-300px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideRight {
            0% {
              opacity: 0;
              transform: translateX(100px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideLeft {
            animation: slideLeft 0.90s ease forwards;
          }

          .animate-slideRight {
            animation: slideRight 0.90s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ConsultationInclude;
