import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import homedoc from "../assets/Image/homedoc.png";
import consult from "../assets/Image/consult.png";
import criwork from "../assets/Image/criwork.png";
import review from "../assets/Image/review.jpg";
import heroimg from "../assets/Image/heroimg.png";
import docimg from "../assets/Image/doc.png";
import Banner from "../Components/Banner";
import Include from "../Components/Include";
import Heroconsultation from "../Components/HeroConsultation";

/* ---------------------------
   ReviewCarousel 
   --------------------------- */
const ReviewCarousel = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let x = 0;

    const scroll = setInterval(() => {
   
      x += 1;

      
      if (x >= container.scrollWidth - container.clientWidth) {
        x = 0;
      }

      container.scrollTo({
        left: x,
        behavior: "smooth",
      });
    }, 20);

    return () => clearInterval(scroll);
  }, []);

  const cards = [
    {
      text:
        "Very professional and friendly experience. My eye redness was cured in one consultation.",
      name: "Deepa M, Alappuzha",
      rating: "★★★★☆",
    },
    {
      text: "Doctor was very calm and explained everything clearly. Highly recommended.",
      name: "Amal K, Kochi",
      rating: "★★★★★",
    },
    {
      text: "Great treatment. My mother’s vision issues improved significantly.",
      name: "Asha P, Trivandrum",
      rating: "★★★★☆",
    },
  ];

  const loopCards = [...cards, ...cards];

  return (
    <div className="w-full mt-16 px-6" data-animate>
      {/* HEADING */}
      <h1 className="text-3xl md:text-5xl font-bold text-[#2C3A23] text-center">
        What Patients Say
      </h1>
      <p className="text-gray-700 text-center mt-3 mb-10 text-lg">
        Hear from patients who trust Dr. Maimunnissa for professional and compassionate eye care.
      </p>

      
      <div
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto scroll-smooth py-6 no-scrollbar min-w-full"
      >
        {loopCards.map((card, idx) => (
          <div
            key={idx}
            className="relative min-w-[300px] md:min-w-[380px] max-w-[400px] 
                       bg-[#B0D07D] p-6 rounded-2xl shadow-lg flex-shrink-0"
          >
            
            <div
              className="absolute -top-6 -left-6 w-20 h-20 rounded-full 
                            overflow-hidden border-4 border-white shadow-md bg-white"
            >
              <img src={review} alt="profile" className="w-full h-full object-cover" />
            </div>

          
            <div className="absolute top-4 right-4 text-yellow-500 text-lg">{card.rating}</div>

           
            <div className="mt-10">
              <p className="text-black text-sm md:text-base leading-relaxed">{card.text}</p>
              <p className="text-right font-semibold mt-4">{card.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------
   Main Page Component
   --------------------------- */
export default function HeroBanner() {
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);

 
  useEffect(() => {
    const styleId = "hero-banner-extra-styles";
    if (document.getElementById(styleId)) return;

    const css = `
      /* Animate helpers */
      [data-animate] {
        opacity: 0;
        transform: translateY(18px) scale(0.995);
        transition: opacity 700ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1);
        will-change: opacity, transform;
      }
      [data-animate].in-view {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      /* Stagger helper for children */
      [data-animate].in-view [data-animate-child] {
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 600ms ease, transform 600ms ease;
      }
      [data-animate].in-view [data-animate-child].in-view {
        opacity: 1;
        transform: translateY(0);
      }

      /* Scroll-to-top arrow animation */
      @keyframes hb-bounce {
        0% { transform: translateY(0); }
        40% { transform: translateY(-8px); }
        70% { transform: translateY(-4px); }
        100% { transform: translateY(0); }
      }

      @keyframes hb-pulse {
        0% { box-shadow: 0 0 0 0 rgba(65,79,49,0.22); }
        70% { box-shadow: 0 0 0 14px rgba(65,79,49,0); }
        100% { box-shadow: 0 0 0 0 rgba(65,79,49,0); }
      }

      /* small helper to hide scrollbar for webkit */
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const elems = Array.from(document.querySelectorAll("[data-animate]"));
    if (!("IntersectionObserver" in window)) {
      elems.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        
            const children = Array.from(entry.target.querySelectorAll("[data-animate-child]"));
            children.forEach((ch, i) => {
              setTimeout(() => ch.classList.add("in-view"), i * 100 + 50);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );

    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

 
  useEffect(() => {
    const onScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="antialiased text-gray-900">
      
      <Banner />

      {/* TRUSTED BY */}
      <div className="bg-[#B0D07D] text-2xl flex flex-col items-center justify-center text-center p-6" data-animate>
        <p className="font-semibold">Trusted by thousands of patients</p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 mt-3 text-2xl">
          <p>NABH Certified</p>
          <p className="hidden md:block">|</p>
          <p>10,000+ Eye Patients</p>
          <p className="hidden md:block">|</p>
          <p>100% Confidential Care</p>
        </div>
      </div>

      <div className="w-full bg-white">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center px-4 md:px-0" data-animate>
          {/* LEFT — TEXT CONTENT */}
          <div className="md:col-span-7">
            <h1 className="text-3xl ml-0 md:ml-20 md:text-5xl font-bold text-[#2C3A23] leading-snug text-left" data-animate-child>
              Meet Dr. Maimunnissa — Your <br className="hidden md:block" />
              Eye Specialist Online
            </h1>

            <div className="max-w-4xl ml-0 md:ml-20 text-left mt-6 text-gray-700 text-lg space-y-5" data-animate-child>
              <p>
                Dr. Maimunnissa is a compassionate and highly skilled ophthalmologist
                dedicated to providing exceptional care for patients of all ages. With
                years of expertise in cataract management, retinal disorders, and
                diabetic eye disease, she has helped countless individuals restore and
                protect their vision.
              </p>
              <p>
                Her approach goes beyond just treatment — she focuses on truly
                understanding each patient’s concerns, offering gentle, personalized
                guidance that ensures comfort and confidence throughout the process.
              </p>
            </div>
          </div>

          {/* RIGHT — CIRCULAR DOCTOR IMAGE */}
          <div className="md:col-span-5 mt-10 flex justify-center sm:justify-end md:justify-end" data-animate>
            <div
              className="relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[560px] h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px]"
              style={{
                backgroundImage: `url(${docimg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                backgroundSize: "contain",
              }}
            >
              {/* <img
                src={homedoc}
                alt="Doctor"
                className="
                  absolute
                  md:left-[9%] sm:ml-28 sm:left-[9%]
                  right-[-2%] top-[3%]
                  lg:right[-10%]
                  sm:left- lg:left-[10%]
                  md:w-[66%] sm:w-[64%] lg:w-[74%]
                  h-[95%] md:h-[74%] lg:h-[98%] sm:h-[98%]
                  object-cover
                  rounded-lg
                "
              /> */}


              <img
  src={homedoc}
  alt="Doctor"
  className="
    absolute

    /* Mobile (unchanged) */
    sm:left-[9%] sm:ml-28
    sm:w-[64%] sm:h-[98%]

    /* Tablet – FIXED */
    md:right-[20%]
    md:left-[-10%]
    md:top-[8%]
    md:w-[68%]
    md:h-[80%]

    /* Desktop  */
    lg:left-[10%]
    lg:right-[20%]
    lg:top-[3%]
    lg:w-[74%]
    lg:h-[98%]

    right-[-2%] top-[3%]
    h-[95%]
    object-cover
    rounded-lg
  "
/>

            </div>
          </div>
        </div>

        {/* SECOND SECTION → MISSION + QUALIFICATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-11 md:gap-4 md:mt-[-40px] ml-4 md:ml-10 mt-4" data-animate>
          <div className="md:col-span-8">
            <div className="bg-[#414F31] text-white p-6 rounded-xl shadow-lg mb-8">
              <h4 className="text-3xl font-semibold mb-3">Mission</h4>
              <p className="text-lg leading-relaxed">
                To make expert eye care accessible to everyone through secure
                online consultations. Dr. Maimunnissa strives to provide
                compassionate, personalized treatment for every patient. Her
                goal is to combine medical excellence with modern technology —
                ensuring healthy vision, comfort, and trust anytime, anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* QUALIFICATION CARDS */}
        <div className="grid grid-cols-1 ml-4 md:ml-10 mr-4 md:mr-10 sm:grid-cols-3 gap-6" data-animate>
          <div className="bg-[#FFFECB] p-5 rounded-xl shadow" data-animate-child>
            <h4 className="text-xl font-semibold">Qualified Ophthalmologist</h4>
            <p className="text-gray-700 mt-1">
              Trained at a reputed medical institution with strong clinical and academic foundation.
            </p>
          </div>

          <div className="bg-[#FFFECB] p-5 rounded-xl shadow" data-animate-child>
            <h4 className="text-xl font-semibold">NABH Certified</h4>
            <p className="text-gray-700 mt-1">
              Committed to maintaining the highest standards of safety and patient care.
            </p>
          </div>

          <div className="bg-[#FFFECB] p-5 rounded-xl shadow" data-animate-child>
            <h4 className="text-xl font-semibold">10,000+ Consultations</h4>
            <p className="text-gray-700 mt-1">
              Extensive experience in diagnosing and treating diverse eye conditions.
            </p>
          </div>
        </div>

        <div data-animate>
          <Heroconsultation />
          <Include/>
        </div>

       
        <div className="w-full mt-16 md:mt-24 text-center px-4" data-animate>
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#2C3A23]" data-animate-child>
            How It Works
          </h1>
          <p className="text-gray-700 mt-2 text-lg md:text-xl" data-animate-child>
            Get expert eye care in just 3 easy steps
          </p>

          {/* Steps Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mt-16 max-w-6xl mx-auto">
            {[1, 2, 3].map((num, index) => (
              <div
                key={index}
                className="bg-[#B0D07D] rounded-2xl p-6 md:p-5 shadow-lg relative 
                  flex flex-col justify-start min-h-[280px] md:min-h-[260px] w-full max-w-sm mx-auto transition-transform hover:scale-105"
                data-animate
              >
                {/* Circle + Number */}
                <div className="absolute -top-6 -left-6 md:-top-5 md:-left-5">
                  <div className="relative">
                    <img src={criwork} className="w-32 h-32 md:w-40 md:h-40" alt="circle" />

                    <span
                      className="absolute ml-2 top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 
                        w-12 h-12 md:w-14 md:h-14 bg-[#414F31] text-white rounded-full flex items-center 
                        justify-center text-lg md:text-xl font-bold border-4 border-white"
                    >
                      {num}
                    </span>
                  </div>
                </div>

                {/* Text Section Left Aligned */}
                <div className="mt-32 md:mt-36 text-left" data-animate-child>
                  <h4 className="text-xl md:text-2xl font-bold text-[#2C3A23]">
                    {num === 1 ? "Book Appointment" : num === 2 ? "Join the Call" : "Get Prescription"}
                  </h4>

                  <p className="text-gray-800 mt-2 text-sm md:text-base leading-relaxed">
                    {num === 1
                      ? "Choose type & preferred time"
                      : num === 2
                      ? "Receive link instantly via SMS/email"
                      : "Digital Rx with follow-up care"}
                  </p>
                </div>

               
                {index < 2 && (
                  <div className="hidden lg:block absolute top-[60%] -right-8 z-10">
                    <svg width="40" height="20" viewBox="0 0 60 20" fill="none">
                      <line x1="0" y1="10" x2="45" y2="10" stroke="#414F31" strokeWidth="3" />
                      <polygon points="45,5 55,10 45,15" fill="#414F31" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Section */}
        <div className="bg-[#FFFECB] p-6 md:p-10 rounded-2xl mx-4 md:mx-10 my-12 shadow-sm border border-yellow-100" data-animate>
          <div className="space-y-3 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold text-[#2C3A23] flex items-center gap-3" data-animate-child>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#1E40AF" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.548 8.279L12 18.896l-7.484 4.517 
                1.548-8.279L0 9.306l8.332-1.151z" />
              </svg>
              Bonus: Free Follow-Up
            </h2>

            <p className="text-gray-700 text-base md:text-xl leading-relaxed" data-animate-child>
              All patients receive a free follow-up consultation within 7 days to ensure your recovery and 
              <br className="hidden md:block" /> address any additional concerns.
            </p>
          </div>
        </div>

        <ReviewCarousel />

        {/* Stats Section */}
        <div className="bg-[#FFFECB] grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 p-10 md:p-20 mt-16" data-animate>
          {/* Block 1 */}
          <div className="flex flex-col items-center text-center space-y-2" data-animate-child>
            <h1 className="text-[#37AFE1] font-black text-4xl md:text-6xl">10,000+</h1>
            <p className="text-lg md:text-2xl font-semibold text-[#2C3A23]">Happy Patients</p>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col items-center text-center space-y-2" data-animate-child>
            <h1 className="text-[#35A114] font-black text-4xl md:text-6xl">10+</h1>
            <p className="text-lg md:text-2xl font-semibold text-[#2C3A23]">Years Experience</p>
          </div>

          {/* Block 3 */}
          <div className="flex flex-col items-center text-center space-y-2" data-animate-child>
            <h1 className="text-[#AFAF03] font-black text-4xl md:text-6xl">5.0</h1>
            <p className="text-lg md:text-2xl font-semibold text-[#2C3A23]">Average Rating</p>
          </div>
        </div>

        {/* Final CTA Hero */}
        <div className="w-full py-16 md:py-24 px-6 md:px-12 bg-white" data-animate>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:gap-20">
            {/* Left Side Image */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-[520px]">
                <div className="absolute -inset-4 bg-green-100/50 rounded-3xl blur-2xl -z-10" />
                <img src={heroimg} alt="Hero" className="w-full object-cover rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]" />
              </div>
            </div>

            {/* Right Side Content */}
            <div className="flex flex-col justify-center text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-3xl md:text-5xl font-black text-[#2C3A23] leading-[1.1]" data-animate-child>
                Take the First Step Toward Better 
                <br className="hidden md:block" /> Vision Today
              </h1>

              <p className="text-gray-600 text-lg md:text-xl mt-6 font-medium" data-animate-child>
                Your eyes deserve expert, gentle care — anytime, anywhere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start" data-animate-child>
                <button
                  onClick={() => navigate("/Appointment")}
                  className="bg-[#37AFE1] hover:bg-[#2e93bd] px-8 py-4 rounded-full text-white font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                >
                  Book Consultation
                </button>

                <button className="bg-[#08813A] hover:bg-[#06632c] px-8 py-4 rounded-full text-white font-bold transition-all shadow-lg hover:shadow-green-200 active:scale-95">
                  Chat With Doctor
                </button>
              </div>

              {/* TRUSTED BY (small) */}
              <div className="mt-12 p-6 bg-gray-50/80 rounded-3xl border border-gray-100 flex flex-col items-center lg:items-start" data-animate-child>
                <p className="font-bold text-[#2C3A23] text-lg">Trusted by thousands of patients</p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mt-4 text-sm font-bold text-green-700 uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    NABH Certified
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    10,000+ Eye Patients
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    100% Confidential
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <button
        onClick={handleScrollTop}
        aria-label="Scroll to top"
        className={`fixed z-50 right-6 bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition 
          duration-300 ${showTopBtn ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
        style={{
          backgroundColor: "black",
          color: "#fff",
          animation: showTopBtn ? "hb-bounce 1.8s infinite, hb-pulse 2.4s infinite" : "none",
        }}
      >
        {/* Arrow icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 6v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 12l-6-6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
