import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  FaVideo,
  FaRedo,
  FaTimes,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

const ConsultationDetails = () => {
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();

  // Fake API Call
  useEffect(() => {
    setTimeout(() => {
      const data = {
        id: 1,
        status: "Completed",
        patientName: "John Doe",
        patientAge: 23,
        patientImg: "https://via.placeholder.com/150",
        doctor: "Dr. Maimunnissa",
        type: "Video Consultation",
        date: "28 Nov 2025",
        time: "11:30 AM – 12:00 PM",
      };
      setAppointment(data);
      setLoading(false);
    }, 400);
  }, []);

  const handleJoin = () => alert("Joining Consultation…");
  const confirmCancel = () => {
    alert("Appointment Cancelled Successfully!");
    setShowCancelModal(false);
  };
  const confirmReschedule = () =>
    alert(`Appointment Updated:\n📅 ${selectedDate}\n⏰ ${selectedTime}`);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-[#F7FAF4] min-h-screen">
    

      <div className="p-6 flex justify-center">
        <div className="max-w-8xl w-full space-y-10">

         {/* ---------------- HEADER / BANNER ---------------- */}
<div className="relative bg-[#6A8E4F] text-white py-8 h-50 text-center rounded-xl shadow flex justify-center">

  {/* Back Arrow Button */}
  <button
    onClick={() => navigate(-1)}
    className="absolute left-5 top-5 text-white text-2xl p-2 rounded-full hover:bg-[#5a7842]"
  >
    <FaArrowLeft />
  </button>

  <h1 className="text-3xl pt-6 font-bold"> Past Consultation Details</h1>
</div>


        
          <div className="bg-white p-6 shadow-md rounded-xl space-y-6">

            {/* Title + Status */}
            <div className="flex items-center w-full justify-between  mb-4">
              <h2 className="text-2xl font-bold">Consultation Summary</h2>

              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                {appointment.status}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <img
                src={appointment.patientImg}
                className="w-20 h-20 rounded-full border-2 border-white shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold">{appointment.patientName}</h3>
                <p className="text-gray-600">{appointment.patientAge} years</p>
              </div>
            </div>
  


            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[#ECF3DF] p-6 rounded-xl gap-6">

              <div className="flex items-center gap-3">
                <FaVideo className="text-2xl" />
                <div>
                  <p className="text-lg font-bold">Consultation</p>
                  <p>{appointment.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-2xl" />
                <div>
                  <p className="text-lg font-bold">Date</p>
                  <p>{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-xl" />
                <div>
                  <p className="text-lg font-bold">Time</p>
                  <p>{appointment.time}</p>
                </div>
              </div>

            </div>
          

          {/* ---------------- JOIN CONSULTATION ---------------- */}
          <div className="bg-[#ECF3DF] p-6 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-2">Doctor’s Assessment</h2>

           

            <p className="p-6 rounded-lg text-gray-700">
             Your symptoms were linked to mild eye irritation caused by dryness. No major concerns were identified. Improvement expected with regular hydration and eye drops.
            </p>

           
            
          </div>

          {/* ---------------- CONTROLS ---------------- */}
          <div className="bg-[#ECF3DF] p-6 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Prescribed Treatment</h2>

            <div className="flex flex-wrap justify-center gap-4">

             <ul>
                <li>Lubricating Eye Drops</li>
                <p>3 times daily</p>
                <p>Duration: Follow for 5 days</p>
                 <li>Cold compress</li>
                 <p>3 times daily</p>
                 <p>Duration: Follow for 5 days</p>
             </ul>

             

            </div>
          </div>

          {/* ---------------- NOTES ---------------- */}
          <div className="bg-[#ECF3DF] p-6  rounded-2xl">
            <h2 className="text-2xl font-bold">Additional Notes</h2>

            <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-700">
              <li>Reduce screen exposure for long durations.</li>
              <li>Maintain proper lighting while working.</li>
              <li>Follow-up consultation recommended if symptoms persist after 7 days..</li>
            </ul>

           <div className="flex flex-wrap justify-center mt-5 gap-4">
           
                         <button
                           onClick={() => setShowRescheduleModal(true)}
                           className="bg-[#6A8E4F] text-white px-6 py-3 w-full md:w-[450px]
                                      rounded-lg flex items-center justify-center gap-2 text-lg"
                         >
                         Download Prescription
                         </button>
           
                         <button
                           onClick={() => setShowCancelModal(true)}
                           className="bg-[#6A8E4F] text-white px-6 py-3 w-full md:w-[450px]
                                      rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-red-700"
                         >
                       Book Follow-Up Consultation
                         </button>
           
                       </div>
          </div>
         
        </div>
      </div>

      {/* ---------------- MODALS (unchanged design) ---------------- */}
     
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaRedo /> Reschedule Appointment
            </h2>

            <label className="font-medium">Select Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded-md mt-2"
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {selectedDate && (
              <div className="mt-4">
                <p className="font-medium mb-2">Available Time Slots</p>

                <div className="grid grid-cols-2 gap-3">
                  {["10:00 AM", "11:30 AM", "3:00 PM", "4:30 PM"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-2 rounded-lg border ${
                        selectedTime === t ? "bg-[#6A8E4F] text-white" : "bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>

              <button
                disabled={!selectedTime}
                onClick={confirmReschedule}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedTime ? "bg-[#6A8E4F]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <FaTimes /> Cancel Appointment
            </h2>

            <p className="text-gray-600">
              Are you sure you want to cancel this consultation?
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                No
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

    </div>
  );
};

export default ConsultationDetails;
