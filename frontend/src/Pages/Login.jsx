import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // --- 1. SEND OTP (DIRECT TO BACKEND) ---
  const handleSendOtp = async () => {
    if (!mobile) {
      alert("Please enter mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/send-otp/", {
        mobile: mobile
      });
      setOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIN (PASSWORD OR MOBILE OTP) ---
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginMethod === "password") {
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
          email, password
        });

        const data = response.data;
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("loggedUser", JSON.stringify({ email }));
        localStorage.setItem("isAdmin", data.is_admin ? "true" : "false");

        setSuccess("Login successful!");
        setTimeout(() => {
          setSuccess("");
          if (data.is_admin) {
            navigate("/admin/dashboard");
          } else {
            // Check for post-login redirect
            const redirectData = localStorage.getItem("postLoginRedirect");
            if (redirectData) {
              const { pathname, state } = JSON.parse(redirectData);
              localStorage.removeItem("postLoginRedirect");
              navigate(pathname, { state });
            } else {
              navigate("/");
            }
          }
        }, 1500);

      } catch (error) {
        alert("Invalid email or password");
      } finally {
        setLoading(false);
      }

    } else {
      // OTP LOGIN (DIRECT TO BACKEND)
      if (!otp || !mobile) {
        alert("Please enter mobile and OTP");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/login-otp/",
          { mobile, otp }
        );

        const data = response.data;
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("loggedUser", JSON.stringify({ mobile }));
        localStorage.setItem("isAdmin", data.is_admin ? "true" : "false");

        setSuccess("Login successful!");
        setTimeout(() => {
          setSuccess("");
          if (data.is_admin) {
            navigate("/admin/dashboard");
          } else {
            // Check for post-login redirect
            const redirectData = localStorage.getItem("postLoginRedirect");
            if (redirectData) {
              const { pathname, state } = JSON.parse(redirectData);
              localStorage.removeItem("postLoginRedirect");
              navigate(pathname, { state });
            } else {
              navigate("/");
            }
          }
        }, 1500);

      } catch (error) {
        alert(error.response?.data?.error || "Invalid OTP or login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-gray-800 cursor-pointer hover:text-black"
        size={26}
      />

      <div className="bg-[#B0D07D] rounded-xl shadow-xl w-full max-w-md p-8">
        {success && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded p-2 text-center">
            {success}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-l-full font-semibold ${loginMethod === "password"
              ? "bg-green-700 text-white"
              : "bg-white text-green-700 border border-green-700"
              }`}
            onClick={() => setLoginMethod("password")}
          >
            Password
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r-full font-semibold ${loginMethod === "otp"
              ? "bg-green-700 text-white"
              : "bg-white text-green-700 border border-green-700"
              }`}
            onClick={() => setLoginMethod("otp")}
          >
            Mobile OTP
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-6 rounded-full">
            <User size={45} className="text-white" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-white mb-6">
          User Login
        </h2>

        {loginMethod === "password" ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-sm rounded-full bg-white outline-none"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-5 relative">
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-sm rounded-full bg-white pr-10 outline-none"
                placeholder="Enter password"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-9 text-gray-600 cursor-pointer"
              >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
              <div className="flex justify-end mt-1 px-2">
                <span
                  onClick={() => navigate("/forgot")}
                  className="text-white text-xs underline cursor-pointer hover:text-gray-100"
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-800 text-white px-10 py-2 rounded-full font-semibold text-sm hover:bg-gray-900 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-white text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="underline font-bold text-gray-900 cursor-pointer"
                >
                  Signup
                </span>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2 text-sm rounded-full bg-white outline-none"
                placeholder="Enter mobile number"
              />
            </div>

            <div className="mb-4 text-center">
              <button
                type="button"
                disabled={loading || otpSent}
                className="bg-green-700 text-white px-8 py-2 rounded-full font-semibold text-sm hover:bg-green-800 transition"
                onClick={handleSendOtp}
              >
                {otpSent ? "OTP Sent" : "Send OTP"}
              </button>
            </div>

            {otpSent && (
              <div className="mb-5">
                <label className="block text-white text-sm font-medium mb-1">Enter OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 text-sm rounded-full bg-white outline-none"
                  placeholder="Enter 6-digit code"
                />
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !otpSent}
                className="bg-gray-800 text-white px-10 py-2 rounded-full font-semibold text-sm hover:bg-gray-900 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-white text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="underline font-bold text-gray-900 cursor-pointer"
                >
                  Signup
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
