import React, { useState } from 'react';
import { motion } from "framer-motion";

import phone from '../assets/Image/phono.png';
import Video from '../assets/Image/video.png';
import Audio from '../assets/Image/audio.png';
import qusimg from '../assets/Image/qusimg.png';
import { FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


// ------------------ INCLUDED SECTION COMPONENT --------------------
const ConsultationIncluded = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[#FFFECB] p-6 rounded-lg mt-10"
    >
      <h3 className="text-2xl font-semibold mb-4 text-center">
        What's Included in Every Consultation
      </h3>

      <div className="flex flex-col md:flex-row justify-center items-center gap-20">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <span className="text-gray-800 font-medium">Digital Prescription</span>
        </div>
        <div className="flex  items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <span className="text-gray-800 sm:pr-30 font-medium">Secure & Confidential Communication</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <span className="text-gray-800 font-medium">Free 7-Day Follow-Up</span>
        </div>
      </div>
    </motion.div>
  );
};


// ------------------ MAIN PAGE --------------------
const Appointment = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    { question: "How do I join the video call?", answer: "You can join using the link sent to your email/SMS." },
    { question: "Will I receive a prescription?", answer: "Yes, after consultation you get a digital prescription." },
    { question: "What if the internet disconnects?", answer: "You can rejoin using the same video link." },
    { question: "Are my photos and reports safe?", answer: "Yes, everything is encrypted and secure." },
    { question: "Refund policy?", answer: "Refunds take 3–5 working days." }
  ];

  const openAppointmentDetails = (type) => {
    navigate("/selectDateTime", {
      state: { selectedType: type }
    });
  };


  return (
    <div>

      <div className="w-full px-6 md:px-12 py-16">

        {/* HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-[#2C3A23] text-center"
        >
          Choose Your Consultation Type
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 pt-4 pb-10 text-center text-lg"
        >
          Select the consultation mode that suits your needs.
        </motion.p>

        {/* PREMIUM WIDE VIDEO CONSULTATION BANNER */}
        <div className="flex justify-center max-w-5xl mx-auto px-2 md:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-gradient-to-br from-[#D3E4B6] to-[#E9F3D8] rounded-3xl p-6 md:p-10 shadow-lg border border-green-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-300 transform hover:shadow-xl"
          >
            {/* Left Column: Icon & Desc */}
            <div className="md:w-5/12 text-center md:text-left">
              <div className="bg-white/80 p-4 rounded-2xl w-fit mx-auto md:mx-0 mb-6 shadow-sm">
                <img src={Video} alt="Video Consultation" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-[#2C3A23] mb-3">Video Consultation</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                A live, face-to-face online consultation with Dr. Maimunnissa for detailed diagnosis and personalized treatment.
              </p>
            </div>

            {/* Middle Column: Features */}
            <div className="md:w-4/12 flex flex-col justify-center w-full">
              <h4 className="font-bold text-[#2C3A23] text-lg mb-4 text-center md:text-left">
                What's Included:
              </h4>
              <ul className="space-y-4">
                {["Detailed Visual Exam", "Real-time Interaction", "Personalized Treatment"].map((feat, i) => (
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
              <div className="text-[#35A114] font-black text-4xl mb-1">₹315</div>
              <p className="text-gray-400 text-xs mb-8 font-medium">(₹300 + 5% GST)</p>

              <button
                className="w-full bg-[#35A114] hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-700/30 hover:-translate-y-1 active:scale-95"
                onClick={() => openAppointmentDetails("video")}
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </div>



        <ConsultationIncluded />
      </div>

      {/* FAQ SECTION */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl mb-5 text-center font-semibold"
      >
        Frequently Asked Questions
      </motion.h1>

      <div className="bg-[#B0D07D] max-w-7xl mx-auto rounded-2xl py-10 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-start"
          >
            <img src={qusimg} alt="" className="w-full max-w-xl object-contain" />
          </motion.div>

          {/* Right FAQ */}
          <div>
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-black/40 bg-white rounded-xl p-4 mb-4 shadow"
              >
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold">{item.question}</span>

                  <FaChevronDown
                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                    }`}
                >
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Appointment;
