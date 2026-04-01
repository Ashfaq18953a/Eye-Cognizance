import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, UserCheck, ArrowLeft } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const otpRefs = useRef([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/password-reset-send-otp/", { email });
      setSent(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please check your email address.");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }
    // Pass email and OTP to reset password page
    navigate("/reset-password", { state: { email, otp: otp.join("") } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="bg-[#B0D07D] rounded-xl shadow-xl w-full max-w-md p-8 relative">

        {/* BACK ARROW ICON */}
        <ArrowLeft
          size={26}
          className=" absolute left-6 top-6 cursor-pointer hover:text-gray-200"
          onClick={() => navigate(-1)}
        />

        {/* ICON */}
        <div className="flex justify-center mb-4 mt-4">
          <div className="bg-white/20 p-6 rounded-full">
            {!sent ? (
              <Mail size={45} className="text-white" />
            ) : (
              <UserCheck size={45} className="text-white" />
            )}
          </div>
        </div>

        {/* HEADING */}
        <h2 className="text-center text-2xl font-bold text-white mb-3">
          {sent ? "Verify Code" : "Forgot Password"}
        </h2>

        
        {!sent ? (
          <>
            <p className="text-center text-sm mb-6 px-4">
              Enter your email and we’ll send you an OTP to reset your password.
            </p>
            {error && (
              <p className="text-center text-red-600 text-sm mb-4">{error}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-center text-sm mb-6 px-4">
              An OTP has been sent to <br />
              <span className="font-semibold">{email}</span>
            </p>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  ref={el => (otpRefs.current[idx] = el)}
                  className="w-10 h-12 text-center text-xl rounded bg-white outline-none border border-gray-300 focus:ring"
                />
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleVerify}
                className="bg-green-700 text-white px-10 py-2 rounded-full font-semibold text-sm"
              >
                Verify OTP
              </button>
            </div>
            {error && (
              <p className="text-center text-red-600 text-sm mt-2">{error}</p>
            )}
          </>
        )}

       
        {!sent && (
          <form method="POST" onSubmit={handleSend}>
            <div className="mb-5 relative">
              <label className="block text-white text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-sm rounded-full bg-white outline-none focus:ring focus:ring-gray-300 pl-10"
                placeholder="Enter email"
              />

              {/* Email ICON */}
              <Mail
                size={18}
                className="absolute left-3 top-9 text-gray-600 pointer-events-none"
              />
            </div>

            {/* SEND BUTTON */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gray-800 text-white px-10 py-2 rounded-full font-semibold text-sm"
              >
                Send
              </button>
            </div>
          </form>
        )}

        {/* OTP SCREEN */}
        {/* No OTP for Gmail reset, just show confirmation */}

        {/* BACK TO LOGIN */}
        <p className="text-center text-white text-sm mt-5 cursor-pointer">
          <span
            onClick={() => navigate("/login")}
            className="underline font-semibold text-gray-900"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
