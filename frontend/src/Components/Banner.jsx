import React from "react";
import Navbar from "./Navbar";
import herodoc from "../assets/Image/herodoc.jpg";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{
        backgroundImage: `
        linear-gradient(
          to bottom right, 
          rgba(265, 254, 203, 0.3),
          rgba(76, 208, 125, 0.3),
          rgba(65, 79, 49, 0.3)
        ),
        url(${herodoc})
      `,
      }}
    >



      <div className="max-w-7xl mx-auto h-full flex items-center px-6 pt-20 md:pt-0">
        <div className="text-left max-w-2xl">


          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg 
                         opacity-0 animate-fadeIn delay-100">
            Your Eyes Deserve Expert Care
          </h1>

          <span className="text-white text-2xl md:text-4xl font-semibold drop-shadow 
                          block opacity-0 animate-fadeIn delay-300">
            Anytime, Anywhere.
          </span>

          {/* DESCRIPTION */}
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow 
                        opacity-0 animate-fadeIn delay-500">
            Consult Dr. Maimunnissa (MS Ophthalmology), your trusted eye
            specialist with 12+ years of experience.
          </p>

          {/* CTA BUTTON */}
          <button
            onClick={() => navigate("/appointment")}
            className="mt-6 text-white bg-green-900 font-semibold px-6 py-3 rounded-full shadow-lg 
                       hover:bg-gray-200 hover:text-green-900 transition 
                       opacity-0 animate-fadeIn delay-700"
          >
            Book Consultation
          </button>
        </div>
      </div>

      {/* CUSTOM KEYFRAMES */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.9s ease forwards;
          }
          .delay-100 { animation-delay: 0.3s; }
          .delay-300 { animation-delay: 0.6s; }
          .delay-500 { animation-delay: 0.8s; }
          .delay-700 { animation-delay: 0.12s; }
        `}
      </style>
    </div>
  );
};

export default Banner;
