import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [showBookingLoader, setShowBookingLoader] = useState(false);

  const { selectedType, selectedDate, selectedTime, patient, isReschedule, oldApptId } = state || {};
  // Check login
  const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
  if (!token) {
    // Save intended route and booking state
    localStorage.setItem("postLoginRedirect", JSON.stringify({
      pathname: "/payment",
      state: { selectedType, selectedDate, selectedTime, patient, isReschedule, oldApptId }
    }));
    navigate("/login");
    return null;
  }
  if (!selectedType || !selectedDate || !selectedTime || !patient) {
    navigate(-1);
    return null;
  }

  const typeConfig = {
    message: { title: "Questionnaire Consultation", fee: 300 },
    video: { title: "Video Consultation", fee: 300 },
    audio: { title: "Audio Consultation", fee: 300 },
  };
  const currentType = typeConfig[selectedType];
  const gstAmount = Math.round(currentType.fee * 0.05); // Changed to 5% tax
  const totalAmount = currentType.fee + gstAmount;

  const convertTo12HourFormat = (time24) => {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleFreeReschedule = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      };
      const res = await fetch("http://127.0.0.1:8000/api/patient/free-reschedule/", {
        method: "POST",
        headers,
        body: JSON.stringify({ oldApptId, selectedDate, selectedTime }),
      });
      const result = await res.json();
      if (result.success) {
        navigate("/confirmation", {
          state: {
            bookingId: result.bookingId,
            meetLink: result.meetLink,
            selectedType,
            selectedDate,
            selectedTime,
            totalAmount: 0, // No new charge
            patient,
          },
        });
      } else {
        alert(result.error || "Failed to reschedule. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amountInPaise = totalAmount * 100; // send exact paise to Razorpay

      // Create Razorpay Order
      const orderRes = await fetch("http://127.0.0.1:8000/api/create-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || "Unable to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key,
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: "INR",
        name: "Doctor Consultation",
        description: "Appointment Booking",
        handler: async function (response) {
          const payload = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            selectedType,
            selectedDate,
            selectedTime,    // already "3:00 PM" format from SelectDateTime
            patient,
            totalAmount: orderData.amount, // pass exact amount in paise
          };
          // ✅ Show loader INSTANTLY — Razorpay closed, payment done
          setShowBookingLoader(true);
          try {
            const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
            const verifyRes = await fetch("http://127.0.0.1:8000/api/razorpay/verify/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
              },
              body: JSON.stringify(payload),
            });
            const result = await verifyRes.json();
            if (result.success) {
              navigate("/confirmation", {
                state: {
                  bookingId: result.bookingId,
                  meetLink: result.meetLink,
                  selectedType,
                  selectedDate,
                  selectedTime,
                  totalAmount,
                  patient,
                },
              });
            } else {
              alert(result.message || "Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Try again.");
          }
        },
        prefill: {
          name: patient.name,
          email: patient.email,
          contact: patient.mobile,
        },
        theme: { color: "#35A114" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Instant overlay: shown right after Razorpay payment success ── */}
      {showBookingLoader && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "linear-gradient(135deg, #1a3a1a 0%, #2d5a27 50%, #1a3a1a 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "1.2rem",
        }}>
          {/* Spinner */}
          <div style={{ position: "relative", width: 90, height: 90 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "3px solid rgba(83,213,108,0.2)",
              animation: "bl-pulse 1.5s ease-out infinite",
            }} />
            <div style={{
              position: "absolute", inset: 8, borderRadius: "50%",
              border: "4px solid transparent",
              borderTopColor: "#53d56c", borderRightColor: "#53d56c",
              animation: "bl-spin 0.9s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: 20, borderRadius: "50%",
              background: "rgba(83,213,108,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>✅</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
              Payment Successful!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 5, fontSize: "0.85rem" }}>
              Please wait, confirming your booking…
            </p>
          </div>

          {/* Progress bar fills in ~1 s */}
          <div style={{
            width: "min(280px, 80vw)", background: "rgba(255,255,255,0.12)",
            borderRadius: 99, height: 6, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: "95%",
              background: "linear-gradient(90deg,#35A114,#53d56c)",
              borderRadius: 99, transition: "width 1s ease",
            }} />
          </div>

          <style>{`
            @keyframes bl-spin  { to { transform: rotate(360deg); } }
            @keyframes bl-pulse {
              0%  { transform:scale(0.9); opacity:0.7; }
              70% { transform:scale(1.4); opacity:0; }
              100%{ transform:scale(1.4); opacity:0; }
            }
          `}</style>
        </div>
      )}
      <FaArrowLeft className="ml-6 mt-6 text-2xl text-green-700 cursor-pointer" onClick={() => navigate(-1)} />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <p className="font-bold">{currentType.title}</p>
          <p>{selectedDate} • {selectedTime}</p>
          <hr className="my-4" />

          {isReschedule ? (
            <div className="flex justify-between font-bold text-lg mt-2 text-green-700">
              <span>Total due today</span>
              <span>₹0 (Free Reschedule)</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between"><span>Consultation Fee</span><span>₹{currentType.fee}</span></div>
              <div className="flex justify-between"><span>GST (5%)</span><span>₹{gstAmount}</span></div>
              <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₹{totalAmount}</span></div>
            </>
          )}

          <button
            onClick={isReschedule ? handleFreeReschedule : handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
          >
            {loading ? "Processing..." : (isReschedule ? "Confirm Reschedule (Free)" : "Pay Now")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;