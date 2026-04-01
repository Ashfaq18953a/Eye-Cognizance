import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaArrowLeft, FaCalendarCheck, FaUserMd, FaClock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Loading Screen ─────────────────────────────────────── */
const steps = [
  { icon: "📋", text: "Saving your booking details…" },
  { icon: "📅", text: "Confirming your appointment slot…" },
  { icon: "📧", text: "Sending confirmation to your email…" },
  { icon: "✅", text: "All done! Preparing your confirmation…" },
];

const BookingLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Duration between 5000 ms and 10000 ms — controlled externally, so
  // progress bar simply animates for however long the parent keeps this mounted.
  useEffect(() => {
    // Cycle status messages every 1.5 s
    const msgInterval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    // Smooth progress bar — tick every 80 ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 1 : prev));
    }, 80);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a27 50%, #1a3a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        gap: "2rem",
      }}
    >
      {/* Pulsing ring around spinner */}
      <div style={{ position: "relative", width: 110, height: 110 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(83,213,108,0.25)",
            animation: "pulse-ring 1.5s ease-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: "4px solid transparent",
            borderTopColor: "#53d56c",
            borderRightColor: "#53d56c",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            background: "rgba(83,213,108,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaCalendarCheck style={{ color: "#53d56c", fontSize: 30 }} />
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          Processing Your Booking
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 6, fontSize: "0.9rem" }}>
          Please wait, do not close this page
        </p>
      </div>

      {/* Step message */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(83,213,108,0.25)",
          borderRadius: 14,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 280,
          justifyContent: "center",
          transition: "opacity 0.4s",
        }}
      >
        <span style={{ fontSize: "1.3rem" }}>{steps[stepIndex].icon}</span>
        <span style={{ color: "#c8f5d2", fontWeight: 600, fontSize: "0.92rem" }}>
          {steps[stepIndex].text}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "min(320px, 80vw)",
          background: "rgba(255,255,255,0.12)",
          borderRadius: 99,
          height: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #35A114, #53d56c)",
            borderRadius: 99,
            transition: "width 0.08s linear",
          }}
        />
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.4); opacity: 0;   }
          100% { transform: scale(1.4); opacity: 0;   }
        }
      `}</style>
    </div>
  );
};

/* ─── Main Confirmation Component ────────────────────────── */
const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Show loader for a random 5–10 seconds
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const duration = 1000; // 1 second
    const timer = setTimeout(() => {
      setLoading(false);
      // Small delay so fade-in triggers after DOM paint
      requestAnimationFrame(() => requestAnimationFrame(() => setFadeIn(true)));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const selectedType = state?.selectedType || "video";
  const selectedDate = state?.selectedDate || "Not available";
  const selectedTime = state?.selectedTime || "Not available";
  const totalAmount = state?.totalAmount || "0";
  const selectedPatient =
    state?.patient || JSON.parse(localStorage.getItem("selectedPatient")) || {};

  const typeConfig = {
    message: "Questionnaire Consultation",
    video: "Video Consultation",
    audio: "Audio Consultation",
  };

  return (
    <>
      {loading && <BookingLoader />}

      <div
        className="min-h-screen bg-gray-50 pb-20"
        style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <FaArrowLeft
          className="ml-6 mt-6 text-2xl text-green-700 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-[#35A114] text-5xl" />
          </div>
          <h2 className="text-3xl font-black text-[#2C3A23] mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Your consultation has been successfully scheduled. We've sent the details to your email.
          </p>

          {/* Booking ID */}
          <div className="bg-[#D3E4B6]/30 border border-green-100 p-6 rounded-2xl text-left mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-green-800 uppercase tracking-widest mb-1">
                  Booking ID
                </h3>
                <p className="text-xl font-black text-[#2C3A23]">BK-{new Date().getFullYear()}-{state?.bookingId}</p>
              </div>
              <div className="bg-[#35A114] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Confirmed
              </div>
            </div>
          </div>

          {/* Consultation Summary */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl text-left border border-gray-100">
            <h3 className="text-lg font-black text-[#2C3A23] mb-6 uppercase tracking-wider">
              Consultation Details
            </h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mode</span>
                <p className="font-black text-[#2C3A23]">{typeConfig[selectedType]}</p>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                <p className="font-black text-[#2C3A23]">{selectedDate}</p>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
                <p className="font-black text-green-700">{selectedTime}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-gray-400 uppercase">Amount Paid</span>
                <span className="text-2xl font-black text-[#2C3A23]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Meeting Link */}
            <h3 className="text-lg font-semibold mt-6">Meeting Link</h3>
            <p className="text-blue-700 underline break-all mb-2">
              <a href={state?.meetLink} target="_blank" rel="noopener noreferrer">
                {state?.meetLink || "Not available"}
              </a>
            </p>
            <p className="text-xs text-gray-500 mb-4 italic">
              Note: This link will only activate EXACTLY 6 minutes before your scheduled appointment time.
            </p>

            {/* Patient Info */}
            <h3 className="text-lg font-semibold mt-6">Patient Information</h3>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Name:</span> {selectedPatient.name || "N/A"}</p>
              <p><span className="font-medium">Email:</span> {selectedPatient.email || "N/A"}</p>
              <p><span className="font-medium">Phone:</span> {selectedPatient.mobile || "N/A"}</p>
              <p><span className="font-medium">Gender:</span> {selectedPatient.gender || "Not specified"}</p>
              <p>
                <span className="font-medium">Date of Birth:</span>{" "}
                {selectedPatient.dob
                  ? new Date(selectedPatient.dob).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={() => navigate("/Consultation")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              Go to My Consultations
            </button>
            <button
              onClick={() => window.print()}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              Print Receipt
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentConfirmation;