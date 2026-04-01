import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import phone from "../assets/Image/phono.png";
import video from "../assets/Image/video.png";
import audio from "../assets/Image/audio.png";



const AppointmentDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = React.useState(state?.selectedType || "message");

  const consultationCards = [
    {
      type: "message",
      title: "Questionnaire Consultation",
      price: "₹199",
      img: phone,
      description:
        "Send details with photos and get expert treatment plan.",
      points: ["Detailed Visual Exam", "Real-time Interaction", "Personalized Treatment"],
      btnText: "Book Message",
    },
    {
      type: "video",
      title: "Video Consultation",
      price: "₹599",
      img: video,
      description:
        "A quick and detailed online video consultation ideal for diagnosis and follow-ups.",
      points: ["Detailed Visual Exam", "Real-time Interaction", "Personalized Treatment"],
      btnText: "Book Video",
    },
    {
      type: "audio",
      title: "Audio Consultation",
      price: "₹299",
      img: audio,
      description:
        "Share symptoms or reports securely and receive expert audio guidance.",
      points: ["Detailed Visual Exam", "Real-time Interaction", "Personalized Treatment"],
      btnText: "Book Audio",
    },
  ];

  const handleContinue = () => {
    navigate("/selectDateTime", { state: { selectedType } });
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 py-10 md:py-16 bg-gray-50/30 min-h-screen">
    
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#2C3A23] text-center leading-tight">
        Complete Your Appointment
      </h1>

      <p className="text-gray-600 pt-4 pb-8 md:pb-12 text-center text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
       Select the consultation mode that suits your needs. All consultations include digital prescription, free 7-day follow-up, and secure communication.
      </p>

      {/* 3 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {consultationCards.map((card, index) => (
          <div
            key={index}
            onClick={() => setSelectedType(card.type)}
            className={`p-6 md:p-8 rounded-2xl shadow-sm flex flex-col w-full mx-auto transition-all duration-300 cursor-pointer border-2
            ${
              selectedType === card.type
                ? "bg-white scale-[1.02] border-[#6A8E4F] shadow-xl"
                : "bg-white border-transparent hover:border-[#6A8E4F]/30 hover:shadow-lg"
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${selectedType === card.type ? 'bg-green-50' : 'bg-gray-50'}`}>
              <img src={card.img} className="w-12 h-12 object-contain" alt="" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#2C3A23] text-center mb-2">
              {card.title}
            </h3>

            <div className="bg-green-600/10 text-green-700 font-black text-xl py-1 px-4 rounded-xl w-fit mx-auto mb-4">
              {card.price}
            </div>

            <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed mb-6">
              {card.description}
            </p>

            <ul className="mb-8 space-y-3 flex-grow">
              {card.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedType(card.type);
                navigate("/selectDateTime", { state: { selectedType: card.type } });
              }}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-md active:scale-95
                ${selectedType === card.type 
                  ? 'bg-[#35A114] text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {card.btnText}
            </button>
          </div>
        ))}

      </div>

      {/* BACK + CONTINUE BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 max-w-md mx-auto sm:max-w-none">
        <button
          className="bg-white border border-gray-200 px-10 py-4 rounded-xl text-base font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>

       <button
        className="bg-[#6A8E4F] text-white px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:bg-[#5a7a43] transition-all active:scale-95"
        onClick={handleContinue} 
      >
        Continue to Booking
      </button>

      </div>
    </div>
  );
};

export default AppointmentDetails;
