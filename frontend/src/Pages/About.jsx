import React, { useEffect, useRef, useState } from "react";
import aboutbg from "../assets/Image/aboutbg.png";
import semibg from "../assets/Image/semibg.png";
import doctorimg from "../assets/Image/doctor.png";

import cardimg from "../assets/Image/cardimg.png";
import whatab from "../assets/Image/whatab.png";

const About = () => {
  // Refs for different sections
  const bannerRef = useRef(null);
  const comfortRef = useRef(null);
  const whatIDoRef = useRef(null);
  const clinicalRef = useRef(null);

  const [visible, setVisible] = useState({
    banner: false,
    comfort: false,
    whatido: false,
    clinical: false,
  });

  // Intersection Observer function
  useEffect(() => {
    const createObserver = (refName) => {
      return new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible((prev) => ({ ...prev, [refName]: true }));
          }
        },
        { threshold: 0.2 }
      );
    };

    const observers = {
      banner: createObserver("banner"),
      comfort: createObserver("comfort"),
      whatido: createObserver("whatido"),
      clinical: createObserver("clinical"),
    };

    if (bannerRef.current) observers.banner.observe(bannerRef.current);
    if (comfortRef.current) observers.comfort.observe(comfortRef.current);
    if (whatIDoRef.current) observers.whatido.observe(whatIDoRef.current);
    if (clinicalRef.current) observers.clinical.observe(clinicalRef.current);

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div>
      {/* TOP BANNER SECTION */}
      <div
        ref={bannerRef}
        className={`w-full bg-cover bg-center relative overflow-hidden ${
          visible.banner ? "animate-slideUp" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${aboutbg})`,
          minHeight: "70vh",
        }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-start justify-between px-4 md:px-12 py-12 relative">
          {/* LEFT CONTENT */}
          <div className="md:w-7/12 z-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>

            <p className="mb-6 text-sm md:text-base leading-relaxed">
              I am Dr. Maimunnissa (MS Ophthalmology), committed to offering clear,
              reliable, and compassionate eye-care guidance for patients who prefer
              trusted medical support from home. My approach blends clinical accuracy
              with a calm, patient-focused attitude, ensuring that every person feels
              heard and taken care of.
              <br />
              <br />
              Over the years, I have supported many patients in understanding their
              symptoms, improving their eye comfort, and making confident decisions
              about their treatment. Through online consultations, my aim is to make
              expert eye care accessible, stress-free, and convenient—especially for
              those who find hospital visits difficult.
            </p>

            <h4 className="text-xl md:text-2xl font-semibold mb-3">
              Professional Highlights
            </h4>

            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              <li>MS in Ophthalmology</li>
              <li>NABH Certified Consultant</li>
              <li>10,000+ successful consultations</li>
              <li>Strong experience in online & telemedicine-based care</li>
              <li>Known for a clear, empathetic, and reassuring approach</li>
            </ul>
          </div>

          {/* RIGHT IMAGES */}
          <div className="md:w-5/12 relative mt-10 md:mt-0 md:static overflow-visible">
            <div className="absolute right-0 bottom-0 flex justify-end items-end overflow-visible">
              <img
                src={doctorimg}
                alt="doctor"
                className={`w-[220px] sm:w-[260px] md:w-[300px] lg:w-[730px] absolute bottom-0 right-6 z-10 ${
                  visible.banner ? "animate-slideRight" : "opacity-0"
                }`}
              />

              <img
                src={semibg}
                alt="semi background"
                className={`w-[300px] sm:w-[400px] md:w-[680px] lg:w-[620px] ${
                  visible.banner ? "animate-slideLeft" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* WHY PATIENTS FEEL COMFORTABLE */}
      <div
        ref={comfortRef}
        className={`container mx-auto p-10 ${
          visible.comfort ? "animate-fadeUp" : "opacity-0"
        }`}
      >
        <h1 className="text-4xl flex items-center justify-center font-semibold mb-10">
          Why Patients Feel Comfortable With Me
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            "I listen patiently to every concern.",
            "I explain conditions in simple, understandable terms.",
            "I never rush through a consultation.",
            "Privacy, safety, and confidentiality are always guaranteed.",
            "You receive honest advice, personalized care, and clear next steps.",
          ].map((text, i) => (
            <div
              key={i}
              className={`shadow-lg p-4 rounded-xl bg-[#B0D07D] flex flex-col items-center text-center transition-all delay-${
                i * 200
              } ${visible.comfort ? "animate-fadeUp" : "opacity-0"}`}
            >
              <img src={cardimg} alt="icon" className="w-12 h-12 mb-3" />
              <p className="text-sm mt-2">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT I DO */}
      <div
        ref={whatIDoRef}
        className={`container mx-auto px-6 py-16 ${
          visible.whatido ? "animate-slideUp" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl ml-30 font-bold mb-5">What I Do</h1>

            <p className="text-gray-700 ml-30 leading-relaxed mb-6 text-sm md:text-base">
              I provide online consultations through video, audio, and messaging to
              help with a wide range of eye concerns. Whether you need guidance on
              symptoms, clarity about reports, medication adjustments, or a second
              opinion — you can reach me from wherever you are.
            </p>

            <h5 className="text-xl ml-30 font-semibold mb-3">
              Every consultation includes:
            </h5>

            <ul className="list-disc list-inside ml-30 space-y-2 text-gray-700 text-sm md:text-base">
              <li>Clear explanation</li>
              <li>E-prescription (if required)</li>
              <li>Follow-up support</li>
            </ul>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src={whatab}
              alt="What I Do"
              className={`w-full max-w-sm md:max-w-md ${
                visible.whatido ? "animate-slideRight" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* CLINICAL EXPERIENCE & BACKGROUND */}
      <div
        ref={clinicalRef}
        className={`container mx-auto px-6 py-12 ${
          visible.clinical ? "animate-fadeUp" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 justify-center">
          <div className="bg-[#B0D07D] rounded-2xl p-6 max-w-[700px] w-full mx-auto">
            <h3 className="text-2xl text-center font-semibold mb-3">
              Clinical Experience
            </h3>
            <p className="text-gray-700 p-3 leading-relaxed">
              My professional journey began with strong academic training, followed by
              hands-on clinical experience in reputed medical institutions. This
              allowed me to manage diverse eye concerns, handle outpatient care, and
              provide detailed, personalized treatment plans with confidence and
              precision.
            </p>
          </div>

          <div className="bg-[#B0D07D] rounded-2xl p-6 max-w-[700px] w-full mx-auto">
            <h3 className="text-2xl text-center font-semibold mb-3">
              Professional Background
            </h3>
            <p className="text-gray-700 p-3 leading-relaxed">
              Before starting my independent online consultation service, I worked in
              established eye hospitals and clinics, where I gained experience in
              patient assessment, medical counselling, prescription management, and
              structured follow-up care.
            </p>
          </div>
        </div>
      </div>

      {/* ANIMATION CSS */}
      <style>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(120px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-120px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-slideUp { animation: slideUp 0.9s ease forwards; }
        .animate-slideRight { animation: slideRight 0.9s ease forwards; }
        .animate-slideLeft { animation: slideLeft 0.9s ease forwards; }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
      `}</style>
    </div>
  );
};

export default About;
