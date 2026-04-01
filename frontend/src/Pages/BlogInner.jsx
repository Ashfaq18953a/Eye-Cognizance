import React, { useEffect, useState, useRef } from "react";
import { BiArrowBack } from "react-icons/bi"; 
import { useNavigate } from "react-router-dom";

import artical from "../assets/Image/artical.jpg";
import eye from "../assets/Image/eye.png";

const BlogInner = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <div className="bg-gray-50">

      {/* 🔙 BACK BUTTON */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6A8E4F] hover:text-[#55783F] transition font-medium"
        >
          <BiArrowBack size={22} />
          Back to Blog
        </button>
      </div>

      {/* HERO SECTION */}
      <div
        ref={sectionRef}
        className={`relative h-[320px] md:h-[420px] rounded-b-3xl bg-cover bg-center 
        flex items-center justify-center text-center text-white px-4
        ${isVisible ? "animate-heroFade" : ""}`}
        style={{ backgroundImage: `url(${eye})` }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-b-3xl"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold">
            How to Recognize Early Signs of Vision Problems
          </h1>
          <p className="mt-2 text-gray-200">
            Early detection protects your eye health — learn what to watch for.
          </p>
        </div>
      </div>

      

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 md:px-0 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Understanding Early Vision Warning Signs
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Your eyes often show symptoms before a problem becomes serious. Early
            identification helps prevent long-term damage and ensures timely
            treatment. Understanding these signs empowers you to take better care
            of your vision.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#6A8E4F]">
            1. Blurred or Distorted Vision
          </h3>
          <p className="text-gray-700 mb-4">
            Experiencing blurry patches, double vision, or difficulty focusing on
            objects can be an early indicator of refractive errors, cataracts, or
            retinal issues.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#6A8E4F]">
            2. Frequent Headaches
          </h3>
          <p className="text-gray-700 mb-4">
            Vision strain leads to headaches—especially after long screen use or
            reading. This could indicate a change in your prescription.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#6A8E4F]">
            3. Light Sensitivity
          </h3>
          <p className="text-gray-700 mb-4">
            Feeling uncomfortable around bright lights may indicate corneal
            issues, infections, or inflammation.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#6A8E4F]">
            4. Difficulty Seeing at Night
          </h3>
          <p className="text-gray-700 mb-4">
            Struggling in low-light situations or noticing halos could signal
            cataracts or vitamin A deficiency.
          </p>

          <div className="mt-10 p-5 bg-[#6A8E4F]/10 rounded-xl border-l-4 border-[#6A8E4F]">
            <p className="text-gray-700">
              <strong className="text-[#6A8E4F]">Tip:</strong> If you notice any
              of these symptoms, book a professional eye examination. Early
              treatment reduces long-term complications.
            </p>
          </div>
        </div>

        {/* SIDE – RELATED ARTICLES */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Related Articles</h2>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white shadow p-3 rounded-xl hover:shadow-md transition"
            >
              <img
                src={artical}
                className="w-28 h-28 object-cover rounded-xl"
                alt="related"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  How to Maintain Healthy Eyes Daily
                </h3>
                <p className="text-gray-600 text-sm">
                  Simple habits to protect your long-term vision.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUTHOR BOX */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white shadow p-6 rounded-2xl flex items-center gap-6">
          <img
            src={artical}
            className="w-20 h-20 rounded-full object-cover"
            alt="author"
          />
          <div>
            <h3 className="font-bold text-xl">Dr. Meera Nair</h3>
            <p className="text-gray-600">
              Senior Ophthalmologist with 12+ years of experience in comprehensive
              eye care, diagnostic testing, and cataract management.
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes heroFade {
          0% { opacity: 0; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-heroFade {
          animation: heroFade 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default BlogInner;
