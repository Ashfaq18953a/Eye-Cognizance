import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email and otp from navigation state
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPass) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }
    if (!email || !otp) {
      setError("Missing email or OTP. Please restart the reset process.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/password-reset-verify-otp/", {
        email,
        otp,
        new_password: password
      });
      setLoading(false);
      alert("Password successfully reset!");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#B0D07D] p-8 rounded-2xl shadow-lg">
        
        {/* Lock Icon */}
        <div className="flex justify-center mb-4">
          <Lock size={55} className="text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Reset Password
        </h2>
        <p className="text-center text-sm mb-6 text-gray-700">
            Your New Password must be Different from previously 
used Password
        </p>

        {/* Form */}
        <form onSubmit={handleReset}>
          {error && (
            <p className="text-center text-red-600 text-sm mb-4">{error}</p>
          )}

          {/* New Password */}
          <div className="relative mb-4">
            <label className="text-gray-700 font-medium text-sm">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              className="w-full p-3 pl-3 pr-10 bg-white rounded-xl focus:ring-2 focus:ring-[#0c733f] outline-none mt-1"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-[55%] cursor-pointer text-gray-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <label className="text-gray-700 font-medium text-sm">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full p-3 pl-3 pr-10 bg-white rounded-xl focus:ring-2 focus:ring-[#0c733f] outline-none mt-1"
              placeholder="Confirm new password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <span
              className="absolute right-4 top-[55%] cursor-pointer text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold  transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center mt-5 text-sm">
          Remember your password?{" "}
          <span
            className="text-white font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
