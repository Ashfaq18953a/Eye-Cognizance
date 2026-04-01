import React from "react";
import { useNavigate } from "react-router-dom";

// Images
import phone from "../assets/Image/phono.png";
import Video from "../assets/Image/video.png";
import Audio from "../assets/Image/audio.png";

const cardsData = [
  {
    type: "video",
    title: "Video Consultation",
    price: "₹315",
    description:
      "A live, face-to-face online consultation with Dr. Maimunnissa for a detailed diagnosis and personalized treatment.",
    features: ["Detailed Visual Exam", "Real-time Interaction", "Personalized Treatment"],
    img: Video,
    btnText: "Book Now",
  }
];

const ConsultationSection = () => {
  const navigate = useNavigate();

  const handleBooking = (type) => {
    // Navigate to select date time page and pass selected type
    navigate("/selectDateTime", { state: { selectedType: type } });
  };

  return (
    <div className="w-full px-4 sm:px-6 py-8 md:py-16 overflow-hidden">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3A23] text-center mb-4 animate-fadeIn">
        Consultation Options
      </h1>
      <p className="text-gray-700 px-2 text-center text-base md:text-lg mb-8 md:mb-16 animate-fadeIn delay-200">
        Choose the consultation mode that suits your needs — all designed for safe,{" "}
        <br className="hidden md:block" />
        personalized, and convenient care.
      </p>

      {/* Premium Wide Banner Layout */}
      <div className="flex justify-center max-w-5xl mx-auto px-2">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="w-full bg-gradient-to-br from-[#D3E4B6] to-[#E9F3D8] rounded-3xl p-6 md:p-10 shadow-lg border border-green-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-300 transform hover:shadow-xl animate-slideDown"
          >
            {/* Left Column: Icon & Desc */}
            <div className="md:w-5/12 text-center md:text-left">
              <div className="bg-white/80 p-4 rounded-2xl w-fit mx-auto md:mx-0 mb-6 shadow-sm">
                <img src={card.img} alt={card.title} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-[#2C3A23] mb-3">{card.title}</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Middle Column: Features */}
            <div className="md:w-4/12 flex flex-col justify-center w-full">
              <h4 className="font-bold text-[#2C3A23] text-lg mb-4 text-center md:text-left">
                What's Included:
              </h4>
              <ul className="space-y-4">
                {card.features.map((feat, i) => (
                  <li key={i} className="flex items-center text-gray-800 font-medium bg-white/40 px-4 py-3 rounded-xl border border-white/50">
                    <span className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3 shrink-0 text-xs font-bold shadow-sm">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Price & Button */}
            <div className="md:w-3/12 w-full bg-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center border border-green-50">
              <p className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Consultation Fee</p>
              <div className="text-[#35A114] font-black text-4xl mb-1">{card.price}</div>
              <p className="text-gray-400 text-xs mb-8 font-medium">(₹300 + 5% GST)</p>

              <button
                onClick={() => handleBooking(card.type)}
                className="w-full bg-[#35A114] hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-700/30 hover:-translate-y-1 active:scale-95"
              >
                {card.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ANIMATION CSS */}
      <style>
        {`
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ConsultationSection;
