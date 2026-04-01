import React from "react";
import review from "../assets/Image/review.jpg";
import { motion } from "framer-motion";

// ⭐ Star Component
const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 inline-block mr-1"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 
      00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 
      2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 
      1.688-1.54 1.118l-3.39-2.46a1 1 0 
      00-1.176 0l-3.39 2.46c-.784.57-1.84-.196-1.54-1.118l1.286-3.966a1 
      1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 
      1 0 00.95-.69L9.05 2.927z" />
  </svg>
);


const TestimonialCard = ({ name, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 
      w-[300px] h-[190px] flex flex-col justify-between"
    >
      {/* Stars */}
      <div className="flex items-center text-yellow-400 mb-2">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
      </div>

      {/* Review */}
      <p className="text-gray-700 text-sm leading-relaxed flex-grow">“{text}”</p>

      {/* Profile */}
      <div className="flex items-center mt-4">
        <img
          src={review}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <p className="ml-3 text-sm font-semibold text-gray-800">{name}</p>
      </div>
    </motion.div>
  );
};

// ⭐ Main Component
export default function Testimonials_2_3_2() {
  const cards = [
    {
      text: "Very professional and friendly experience. My eye redness was cured in one consultation.",
      name: "Deepa M, Alappuzha",
    },
    {
      text: "Doctors explained everything clearly. My cataract surgery went smoothly!",
      name: "Sanjay P, Kochi",
    },
    { text: "The staff was caring and supportive. Highly recommended.", name: "Anu K, Kollam" },
    { text: "Excellent facilities and fast service.", name: "Rahul N, Kottayam" },
    { text: "My son's checkup was handled gently. Good child-friendly clinic.", name: "Divya S, Trivandrum" },
    { text: "Affordable pricing and expert doctors.", name: "Aravind R, Thrissur" },
    { text: "Great optical shop and quality lenses.", name: "Meera V, Palakkad" },
  ];

  return (
    <section className="bg-gray-50">

      {/* ⭐ Section Header */}
      <motion.div
        className="bg-[#6A8E4F] text-white flex flex-col mb-10 justify-center items-center py-20 gap-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.h3
          className="text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Testimonials
        </motion.h3>

        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Hear From Our Patients
        </motion.h1>
      </motion.div>

      {/* ⭐ Testimonials Layout */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Row 1 - 2 Cards */}
        <div className="flex justify-center flex-wrap gap-6 mb-8">
          {cards.slice(0, 2).map((c, i) => (
            <TestimonialCard key={i} {...c} />
          ))}
        </div>

        {/* Row 2 - 3 Cards */}
        <div className="flex justify-center flex-wrap gap-6 mb-8">
          {cards.slice(2, 5).map((c, i) => (
            <TestimonialCard key={i} {...c} />
          ))}
        </div>

        {/* Row 3 - 2 Cards */}
        <div className="flex justify-center flex-wrap gap-6 mb-8">
          {cards.slice(5, 7).map((c, i) => (
            <TestimonialCard key={i} {...c} />
          ))}
        </div>
      </div>

      {/* ⭐ ADD REVIEW SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto mt-16 mb-20 bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-[#6A8E4F] mb-2">
          Add Your Review
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Share your experience with us. Your feedback helps others!
        </p>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Your Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6A8E4F] outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Location</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6A8E4F] outline-none"
              placeholder="City, Place"
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Your Rating</label>
            <div className="flex gap-2 text-yellow-400 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>★</span>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Your Review</label>
            <textarea
              rows="4"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#6A8E4F] outline-none"
              placeholder="Write your feedback here..."
            ></textarea>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#6A8E4F] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#5c7a42] transition"
          >
            Submit Review
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
