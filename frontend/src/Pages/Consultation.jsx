import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaVideo,
  FaEye,
  FaRedo,
  FaTimes,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Consultation = () => {
  const navigate = useNavigate();

  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: true,
    });
  }, []);

  const [consultations, setConsultations] = React.useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/user/consultations/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setConsultations(data))
      .catch(() => setConsultations([]));
    // Listen for navigation events to refresh consultations
    const handleVisibility = () => {
      fetch("http://127.0.0.1:8000/api/user/consultations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setConsultations(data))
        .catch(() => setConsultations([]));
    };
    window.addEventListener("focus", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleVisibility);
    };
  }, []);

  const handleView = (id) => {
    navigate(`/consultationdetails/${id}`);
  };

  const handleCompleted = (id) => {
    navigate("/consultComplete");
  };

  const handleReschedule = (id) => {
    // Navigate to date time selection with the intention to reschedule
    navigate("/SelectDateTime", { state: { rescheduleId: id } });
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this consultation? A refund will be initiated to your original payment method."
    );
    if (confirmCancel) {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
        const res = await fetch(`http://127.0.0.1:8000/api/user/consultations/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setConsultations(consultations.filter(item => item.id !== id));
          alert(data.message || "Consultation cancelled successfully. A refund has been initiated to your original payment method. You will receive a confirmation email shortly.");
        } else {
          alert(data.error || "Failed to cancel consultation.");
        }
      } catch (err) {
        console.error("Error cancelling:", err);
        alert("An error occurred while cancelling.");
      }
    }
  };

  // Filter consultations for scheduled and completed
  const scheduledConsultations = consultations.filter(
    (item) => item.status === "Upcoming" || item.status === "Ongoing"
  );
  const completedConsultations = consultations.filter(
    (item) => item.status === "Completed"
  );

  // Scroll-to-top button
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>

      {/* HEADER */}
      <div
        className="bg-[#6A8E4F] text-white py-10 text-center"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold">Your Consultations</h1>
        <p className="mt-2 text-lg">
          Manage your scheduled sessions and review past consultations
        </p>
      </div>

      {/* SCHEDULED CONSULTATIONS */}
      <div
        className="p-6 md:p-12 m-10 rounded-2xl bg-[#ECF3DF] h-auto"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Your Scheduled Sessions
        </h2>
        <p className="text-gray-600 mb-6">
          These are your confirmed consultation slots. You can join when the
          session starts or view more details anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scheduledConsultations.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 relative"
              data-aos="fade-up"
            >
              <span className="absolute top-4 right-4 bg-[#EEAB4E] px-4 py-1 rounded-full text-sm font-medium shadow z-10 pointer-events-auto">
                Upcoming
              </span>

              {/* Booking ID */}
              <div className="absolute top-4 left-4">
                <p className="text-[10px] font-black uppercase text-[#EEAB4E] tracking-widest bg-orange-50 px-2 py-1 rounded-md border border-orange-100 shadow-sm">
                  Booking ID: BK-{new Date(item.date_time).getFullYear()}-{item.id}
                </p>
              </div>

              {/* Patient & Doctor */}
              <div className="flex justify-between mt-6">
                <div>
                  <p className="text-gray-500 text-lg">Patient</p>
                  <p className="text-lg font-semibold">{item.patient_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-lg">Doctor</p>
                  <p className="text-lg font-semibold">{item.doctor_name}</p>
                </div>
              </div>

              {/* Video */}
              <div className="flex items-center gap-4 mt-6  p-4 rounded-lg">
                <FaVideo className=" w-8 h-8 rounded rounded-sm bg-[#E4F7FB] p-2" />
                <p className="text-xl font-semibold">{item.consultation_type.charAt(0).toUpperCase() + item.consultation_type.slice(1)} Consultation</p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#E4F7FB] p-3 rounded-lg">
                  <p className="text-left text-gray-500 text-xs">Date</p>
                  <p className="text-base font-semibold">{new Date(item.date_time).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#E4F7FB] p-3 rounded-lg text-right">
                  <p className="text-gray-500 text-xs">Time</p>
                  <p className="text-base font-semibold">{new Date(item.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8 flex-wrap">
                <button
                  onClick={() => handleView(item.id)}
                  className="flex items-center gap-2 bg-[#B0D07D] text-white px-4 py-2 rounded-lg transition z-10"
                >
                  <FaEye /> View Details
                </button>

                <button
                  onClick={() => handleCancel(item.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition z-10"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLETED CONSULTATIONS */}
      <div
        className="p-6 md:p-12 m-10 rounded-2xl"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Your Completed Consultations
        </h2>
        <p className="text-gray-600 mb-6">
          Review the details, prescriptions, and treatment plans from past
          sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {completedConsultations.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 relative"
              data-aos="fade-up"
            >
              <span className="absolute top-4 right-4 bg-green-500 px-4 py-1 rounded-full text-sm font-medium shadow z-10 pointer-events-auto">
                Completed
              </span>

              {/* Booking ID */}
              <div className="absolute top-4 left-4">
                <p className="text-[10px] font-black uppercase font-mono text-gray-400 tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                  Booking ID: BK-{new Date(item.date_time).getFullYear()}-{item.id}
                </p>
              </div>

              {/* Patient & Doctor */}
              <div className="flex justify-between mt-6">
                <div>
                  <p className="text-gray-500 text-lg">Patient</p>
                  <p className="text-lg font-semibold">{item.patient_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-lg">Doctor</p>
                  <p className="text-lg font-semibold">{item.doctor_name}</p>
                </div>
              </div>

              {/* Video */}
              <div className="flex items-center gap-4 mt-6  p-4 rounded-lg">
                <FaVideo className=" w-8 h-8 rounded rounded-sm bg-[#E4F7FB] p-2" />
                <p className="text-xl font-semibold">{item.consultation_type.charAt(0).toUpperCase() + item.consultation_type.slice(1)} Consultation</p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#E4F7FB] p-3 rounded-lg">
                  <p className="text-left text-gray-500 text-xs">Date</p>
                  <p className="text-base font-semibold">{new Date(item.date_time).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#E4F7FB] p-3 rounded-lg text-right">
                  <p className="text-gray-500 text-xs">Time</p>
                  <p className="text-base font-semibold">{new Date(item.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollUp}
        className="fixed bottom-6 right-6 bg-[#6A8E4F] text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-[#55753F] transition"
      >
        ↑
      </button>
    </div>
  );
};

export default Consultation;