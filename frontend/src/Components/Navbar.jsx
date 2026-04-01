import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Image/logo.png";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [mobileAppointmentOpen, setMobileAppointmentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const appointmentRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileAppointmentRef = useRef(null);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/About" },
    { name: "Testimonial", path: "/Testimonials" },
    { name: "Blog", path: "/Blog" },
    { name: "Contact", path: "/Contact" },
  ];

  const appointmentItems = [
    { name: "Search Booking", path: "/Status" },
    { name: "Scheduled Consultation", path: "/Consultation" },
  ];

  useEffect(() => {
    // Check JWT token in localStorage
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (appointmentRef.current && !appointmentRef.current.contains(e.target)) {
        setAppointmentOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for login/logout changes in other tabs
  useEffect(() => {
    const syncLogin = () => setIsLoggedIn(!!localStorage.getItem("accessToken"));
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("loggedUser");
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate("/Login");
  };

  return (
    <nav className="w-full sticky top-0 z-[100] bg-white shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

        {/* LEFT – LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-14 md:h-20 md:w-20 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-gray-900 leading-none">
              EYE COGNIZANCE
            </h1>
            <p className="text-[10px] md:text-xs text-green-700 font-medium tracking-wide mt-1 uppercase">
              Eye Care Solutions & Awareness
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU - Hidden on Mobile/Tablet */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-1 bg-gray-50/50 border border-gray-100 px-4 py-1.5 rounded-full shadow-sm">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-600 rounded-full transition-all hover:bg-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* APPOINTMENT DROPDOWN */}
            <li className="relative" ref={appointmentRef}>
              <button
                onClick={() => setAppointmentOpen(!appointmentOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all ${appointmentOpen ? "bg-white text-green-600" : "text-gray-700 hover:text-green-600 hover:bg-white"
                  }`}
              >
                Appointment <FaChevronDown className={`text-[10px] transition-transform ${appointmentOpen ? "rotate-180" : ""}`} />
              </button>

              {appointmentOpen && (
                <ul className="absolute top-full left-0 mt-3 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {appointmentItems.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setAppointmentOpen(false);
                        }}
                        className="w-full text-left px-5 py-2.5 font-medium text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          <Link
            to="/Appointment"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 text-sm font-bold rounded-full transition-all active:scale-95"
          >
            Book Appointment
          </Link>

          {/* LOGOUT BUTTON (Directly visible if logged in) */}
          {!!localStorage.getItem("accessToken") && (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="bg-green-50 text-green-700 hover:bg-green-100 px-6 py-2.5 text-sm font-bold rounded-full transition-all active:scale-95 border border-green-200 flex items-center gap-2"
              >
                <FaUserCircle size={18} />
                PROFILE
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("loggedUser");
                  window.location.href = "/Login";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-black rounded-full transition-all active:scale-95 shadow-lg shadow-red-100"
              >
                LOGOUT
              </button>
            </div>
          )}

          {/* PROFILE ICON (Only if NOT logged in) */}
          {!localStorage.getItem("accessToken") && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <FaUserCircle className="text-3xl" />
              </button>
              {profileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in scale-in-95 origin-top-right duration-200">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-base">Account Settings</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your profile and bookings</p>
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => { 
                        localStorage.setItem("redirectTo", location.pathname);
                        navigate("/Login"); 
                        setProfileOpen(false); 
                      }}
                      className="w-full py-2.5 px-4 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => { navigate("/Signup"); setProfileOpen(false); }}
                      className="w-full py-2.5 px-4 bg-white border-2 border-green-600 text-green-600 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex lg:hidden items-center gap-4" ref={mobileMenuRef}>
          <Link
            to="/Appointment"
            className="hidden sm:block bg-green-600 text-white px-5 py-2 text-xs font-bold rounded-full shadow-md"
          >
            Book Now
          </Link>

          <button
            className="p-2 text-2xl text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* MOBILE MENU DROPDOWN */}
          {menuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-[100] animate-in slide-in-from-top-4 duration-300">
              <div className="max-h-[85vh] overflow-y-auto px-6 py-8">
                <ul className="space-y-6">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="block text-xl font-bold text-gray-800 hover:text-green-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}

                  {/* MOBILE APPOINTMENT */}
                  <li className="space-y-4">
                    <button
                      onClick={() => setMobileAppointmentOpen(!mobileAppointmentOpen)}
                      className="flex items-center justify-between w-full text-xl font-bold text-gray-800 hover:text-green-600"
                    >
                      Appointment
                      <FaChevronDown className={`text-sm transition-transform duration-300 ${mobileAppointmentOpen ? "rotate-180" : ""}`} />
                    </button>

                    {mobileAppointmentOpen && (
                      <ul className="pl-6 space-y-4 border-l-2 border-green-100 ml-1">
                        {appointmentItems.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.path}
                              onClick={() => {
                                setMobileAppointmentOpen(false);
                                setMenuOpen(false);
                              }}
                              className="block text-lg font-medium text-gray-600 hover:text-green-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>

                <hr className="my-8 border-gray-100" />

                {/* MOBILE ACCOUNT SECTION */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Account</h3>
                    <p className="text-sm text-gray-500">Access your eye care dashboard</p>
                  </div>
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-bold text-center hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem("accessToken");
                          localStorage.removeItem("refreshToken");
                          localStorage.removeItem("loggedUser");
                          setIsLoggedIn(false);
                          setMenuOpen(false);
                          navigate("/Login");
                        }}
                        className="bg-red-600 text-white py-4 px-6 rounded-2xl font-bold text-center hover:bg-red-700 transition-colors shadow-lg shadow-red-100 w-full"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            localStorage.setItem("redirectTo", location.pathname);
                            navigate("/Login");
                            setMenuOpen(false);
                          }}
                          className="bg-green-600 text-white py-4 px-6 rounded-2xl font-bold text-center hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => { navigate("/Signup"); setMenuOpen(false); }}
                          className="bg-gray-100 text-gray-800 py-4 px-6 rounded-2xl font-bold text-center hover:bg-gray-200 transition-colors"
                        >
                          Signup
                        </button>
                      </div>
                    </>
                  )}
                  <Link
                    to="/Appointment"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full bg-green-50 text-green-700 py-4 px-6 rounded-2xl font-bold text-center border border-green-200"
                  >
                    Book An Appointment
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
