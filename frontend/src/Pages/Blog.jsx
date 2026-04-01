import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; 

import eye from "../assets/Image/eye.png"; 
import artical from "../assets/Image/artical.jpg";

const Blog = () => {
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
    <div>
      {/* HEADER SECTION */}
      <div
        className={`bg-[#6A8E4F] flex flex-col justify-center items-center py-20 gap-4 text-white text-center px-4
          ${isVisible ? "animate-slideDown" : ""}`}
        ref={sectionRef}
      >
        <h1 className="text-3xl font-bold">Eye Care Insights & Helpful Guides</h1>
        <p className="max-w-2xl">
          Reliable articles, simple explanations, and expert-backed tips to help
          you understand your eye health better.
        </p>
      </div>

      {/* PAGE LAYOUT */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT SIDE – LARGE CARDS */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h1 className="font-semibold text-3xl">Featured Article</h1>

          {/* CARD 1 */}
          <Link to="/bloginner"> 
            <div
              className={`h-[480px] rounded-2xl bg-cover bg-center relative flex items-end 
              ${isVisible ? "animate-slideLeft" : ""}`}
              style={{ backgroundImage: `url(${eye})` }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

              <div className="relative bg-[#ffffff80] w-full p-5 z-10 rounded-b-2xl">
                <h2 className="text-xl font-bold">
                  How to Recognize Early Signs of Vision Problems
                </h2>
                <p className="text-sm mt-1">
                  Early detection makes treatment easier. Learn the symptoms you shouldn’t
                  ignore and how timely care protects your eyesight.
                </p>
              </div>
            </div>
          </Link>

          {/* CARD 2 */}
          <Link to="/bloginner"> 
            <div
              className={`h-[480px] rounded-2xl bg-cover bg-center relative flex items-end 
              ${isVisible ? "animate-slideLeftDelay" : ""}`}
              style={{ backgroundImage: `url(${eye})` }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

              <div className="relative bg-[#ffffff80] w-full p-5 z-10 rounded-b-2xl">
                <h2 className="text-xl font-bold">Daily Habits for Long-Term Eye Health</h2>
                <p className="text-sm mt-1">
                  Learn simple lifestyle habits that protect your vision for years.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>

          <div className="flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Link to="/bloginner" key={index}> {/* ✅ ADDED */}
                <div
                  className={`flex items-center gap-4 
                  ${isVisible ? `animate-stagger-${index}` : ""}`}
                >
                  <img
                    src={artical}
                    alt="article"
                    className="w-35 h-35 object-cover rounded-lg"
                  />
                  <div className="bg-white shadow p-3 rounded-xl hover:shadow-md transition">
                    <h3 className="font-semibold text-lg">
                      Common Eye Problems Explained Simply 
                    </h3>
                    <p className="text-sm text-gray-600">
                      Short, clear explanations of everyday eye concerns.
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.9s ease forwards;
        }

        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-80px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 1s ease forwards;
        }
        .animate-slideLeftDelay {
          animation: slideLeft 1s ease forwards 0.3s;
        }

        @keyframes staggerFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        ${Array.from({ length: 6 })
          .map(
            (_, i) => `
          .animate-stagger-${i} {
            animation: staggerFade 0.6s ease forwards ${i * 0.15}s;
          }
        `
          )
          .join("")}

        @keyframes zoomFade {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-zoom {
          animation: zoomFade 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Blog;
