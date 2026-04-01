import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import logo from "../assets/Image/logo.png"

export default function Footer() {
  return (
    <footer className="bg-[#414F31] text-gray-300 py-12 mt-10">
      <div className="max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

      
<div className="flex flex-col -mt-4 -ml-2 sm:-mt-6 sm:-ml-3">
  <div className="flex items-center gap-3">
    <img 
      src={logo} 
      alt="Eye Cognizance Logo" 
      className="w-36 h-32 sm:w-20"
    />
    <h3 className="text-2xl font-semibold text-white">
      EYE COGNIZANCE
    </h3>
  </div>

  {/* Subtext */}
  <div className="mt-3">
    <p>Eye Care Solutions with an Eye Care Awareness</p>
    <p className="text-gray-400 mt-1">
      Expert Online Consultation for Complete Eye Health
    </p>
  </div>
</div>


          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/Services" className="hover:text-white">Services</a></li>
              <li><a href="/About" className="hover:text-white">About</a></li>
              <li><a href="/Contact" className="hover:text-white">Contact</a></li>
              <li><a href="/How-it-works" className="hover:text-white">How it Works</a></li>
              <li><a href="/Testimonials" className="hover:text-white">Reviews</a></li>
              <li><a href="/Appointment" className="hover:text-white">Book Appointment</a></li>
              <li><a href="/FAQ" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>

            <p className="flex items-center gap-2 text-gray-400">
              <FaMapMarkerAlt /> Changanassery, Kerala, India
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <FaPhoneAlt /> +91 98765 43210
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <FaEnvelope /> drmaimunnissa.eye@gmail.com
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <FaWhatsapp /> WhatsApp: Available for patient queries
            </p>

            <p className="text-gray-400 mt-3">
              🕒 Hours: Monday–Saturday, 9:00 AM – 7:00 PM
            </p>
          </div>

          {/* CERTIFICATIONS */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Certifications & Trust</h3>

            <p className="flex items-center gap-2 text-gray-400">
              <BsCheckCircleFill className="text-green-400" /> NABH Certified
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <FaShieldAlt /> Secure Online Consultations
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <BsCheckCircleFill className="text-green-400" /> 10,000+ Patients Served
            </p>

            <p className="flex items-center gap-2 text-gray-400 mt-2">
              <FaUserShield /> 100% Data Privacy
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">

          {/* Policy Links */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-3 text-sm text-gray-300">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</a>
            <span>|</span>
            <a href="/refund-policy" className="hover:text-white">Refund Policy</a>
          </div>

          <p className="text-gray-400">
            © 2025 Dr. Maimunnissa EyeCare — All Rights Reserved  
          </p>

          <p className="text-gray-400">
            Made with ❤️ in Kerala
          </p>
        </div>

      </div>
    </footer>
  );
}
