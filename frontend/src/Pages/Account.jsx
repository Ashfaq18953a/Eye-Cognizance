import React from "react";
import Navbar from "../Components/Navbar";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-gray-50 min-h-screen">


      {/* ------------ STEP TRACKER ------------ */}
      <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-10 mx-6 px-6 py-4 bg-[#B0D07D] rounded-full shadow-sm">

        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">1</div>
          <span className="font-medium text-gray-700">Consultation Type</span>
        </div>

        <div className="hidden lg:block w-20 h-[2px] bg-gray-300"></div>

        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">2</div>
          <span className="font-medium text-gray-700">Select Date & Time</span>
        </div>

        <div className="hidden lg:block w-20 h-[2px] bg-gray-300"></div>

        {/* Step 3 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">3</div>
          <span className="font-medium text-gray-700">Personal Details</span>
        </div>

        <div className="hidden lg:block w-20 h-[2px] bg-gray-300"></div>

        {/* Step 4 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">4</div>
          <span className="font-medium text-gray-700">Payment</span>
        </div>
      </div>

      {/* ------------ MAIN CONTENT ------------ */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800">Continue Your Booking</h1>
        <p className="text-gray-600 mt-2">
          Sign in or create a new account to complete your appointment booking.
        </p>
      </div>

      {/* ------------ CARD SECTION ------------ */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 mb-16">

        {/* --- SIGN IN CARD --- */}
        <div className="bg-white  shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-2xl text-center font-bold text-gray-800">Sign In</h3>
          <p className="text-gray-600  mt-2">Already have an account? Access your profile and bookings.</p>

          <ul className="mt-5 space-y-2  text-gray-700">
            <li className="flex items-center  gap-2">
              <FaCheckCircle className="text-green-600" /> Quick access to your appointments
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> View your medical history
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Manage multiple patient profiles
            </li>
          </ul>

          <button
            onClick={goToLogin}
            className="mt-6 w-full bg-[#6A8E4F] hover:bg-[#5a783f] text-white py-3 rounded-full font-semibold transition"
          >
            Sign In
          </button>
        </div>

        {/* --- CREATE ACCOUNT CARD --- */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-2xl font-bold text-center text-gray-800">Create Account</h3>
          <p className="text-gray-600 mt-2">Start booking by creating your personal account.</p>

          <ul className="mt-5 space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Easy registration process
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Secure account protection
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Start booking immediately
            </li>
          </ul>

          <button
            onClick={goToSignup}
            className="mt-6 w-full bg-[#6A8E4F] hover:bg-[#5a783f] text-white py-3 rounded-full font-semibold transition"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* ------------ BOTTOM INFO BAR ------------ */}
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-xl text-center mb-16">
        <h4 className="text-xl font-bold text-gray-700">Don't have an account yet?</h4>
        <p className="text-gray-600 mt-2">
          You can also create a new account during the booking process. We’ll guide you step by step.
        </p>
      </div>
    </div>
  );
};

export default Account;
