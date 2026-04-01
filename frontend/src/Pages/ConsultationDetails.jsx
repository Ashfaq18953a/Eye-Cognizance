import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./api"; // Axios instance with auth token

const ConsultationDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
        const res = await api.get(`/api/user/consultations/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (!booking || !booking.date_time) return;

    const checkJoinTime = () => {
      const now = new Date();
      const apptTime = new Date(booking.date_time);
      const endTime = new Date(apptTime.getTime() + 30 * 60000); // 30 mins later
      const diffMs = apptTime - now;

      const isExpired = now > endTime;
      const isWithinJoinWindow = diffMs <= 360000; // 6 mins in ms

      if (!isExpired && isWithinJoinWindow) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
      }
    };

    checkJoinTime(); // initial execution
    const intervalId = setInterval(checkJoinTime, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [booking]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl font-bold text-gray-500">Loading details...</p></div>;
  if (!booking) return <div className="flex justify-center items-center h-screen"><p className="text-xl font-bold text-red-500">Booking not found</p></div>;

  return (
    <div className="bg-[#F7FAF4] min-h-screen pb-12">
      <div className="bg-[#6A8E4F] py-10 text-center text-white p-6 shadow-md rounded-b-3xl mb-8">
        <h1 className="text-3xl font-bold">Consultation Details</h1>
        <p className="mt-2 text-green-100 text-lg">Detailed view of your booked appointment</p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 shadow-xl rounded-2xl">
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Booking Info</h2>
            <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-semibold uppercase tracking-wider text-sm shadow-sm">
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            <div className="space-y-4">
              <div className="bg-[#ECF3DF] p-4 rounded-xl border border-green-100">
                <p className="text-sm font-bold text-gray-500 uppercase">Patient Information</p>
                <p className="font-bold text-gray-800 text-xl mt-1">{booking.patient_name}</p>
                {booking.patient_dob && (
                  <p className="text-gray-600 mt-2 text-sm">
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(booking.patient_dob).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 uppercase">Doctor</p>
                <p className="font-bold text-gray-800 mt-1">Dr. {booking.doctor_name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Consultation Type</p>
                  <p className="font-bold text-gray-800 capitalize mt-1">{booking.consultation_type}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
                  {booking.consultation_type === "video" ? "📹" : booking.consultation_type === "audio" ? "📞" : "💬"}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 uppercase">Schedule</p>
                <p className="font-bold text-gray-800 mt-1">
                  {new Date(booking.date_time).toLocaleDateString()} at {new Date(booking.date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>

          {booking.meeting_link && (
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Meeting Details</h3>
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-1 tracking-wider uppercase">Link</p>
                  <p className="text-blue-600 underline font-medium break-all">{booking.meeting_link}</p>
                </div>
                <button
                  onClick={() => {
                    if (canJoin) {
                      window.open(booking.meeting_link, "_blank");
                    } else {
                      alert("You can only join the meeting 5 minutes before the scheduled time.");
                    }
                  }}
                  className={`${canJoin ? "bg-blue-600 hover:bg-blue-700 pointer-events-auto" : "bg-gray-400 cursor-not-allowed"} text-white px-6 py-3 rounded-xl font-bold shadow-md transition ml-4 shrink-0`}
                >
                  Join Meeting
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Please make sure you have a stable internet connection and necessary reports ready.
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-10 py-3 rounded-xl transition"
            >
              Back to Consultations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;