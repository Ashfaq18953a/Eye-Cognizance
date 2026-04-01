import { useEffect, useState } from "react";
import api from "./api"; // Axios instance
import Badge from "../Components/Badge";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Default today
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time update for "Join" button state
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); 
    return () => clearInterval(timer);
  }, []);

  const fetchAppointments = async (date) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/appointments/?date=${date}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/admin/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("/api/admin/notifications/mark-read/");
      setNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      console.error("Error marking notifications read:", err);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6">

        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Appointments</h1>

          <div className="flex items-center gap-4">
            {/* 🔔 Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                title="Cancellation Notifications"
              >
                <span className="text-2xl">🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <p className="font-semibold text-gray-700">Cancellation Alerts</p>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y">
                      {notifications.map((n) => (
                        <li key={n.id} className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Date picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />

            {/* 🚨 Emergency Leave Button */}
            <button
              onClick={async () => {
                if (window.confirm("⚠️ EMERGENCY LEAVE: This will cancel ALL remaining appointments for today and notify patients. Are you sure?")) {
                  try {
                    const res = await api.post("/api/admin/leave-today/");
                    if (res.data.success) {
                      alert(`✅ Success: ${res.data.message}`);
                      fetchAppointments(selectedDate); // Refresh table
                    }
                  } catch (err) {
                    alert("Failed to set leave.");
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition flex items-center gap-2"
            >
              🛑 Emergency Leave
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No appointments found for {selectedDate}
          </div>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Patient</th>
                <th className="border px-4 py-2">DOB</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Consultation</th>
                <th className="border px-4 py-2">Date &amp; Time</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Meeting</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{appt.patient_name}</td>
                  <td className="border px-4 py-2">
                    {appt.patient_dob ? new Date(appt.patient_dob).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2">{appt.patient_email}</td>
                  <td className="border px-4 py-2">{appt.consultation_type}</td>
                  <td className="border px-4 py-2">
                    {appt.date_time ? new Date(appt.date_time).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit", hour12: true
                    }) : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    <Badge status={appt.status} />
                  </td>
                  <td className="border px-4 py-2">
                    <Badge
                      status={appt.payment_status === "paid" ? "Paid" : "Unpaid"}
                      paid={appt.payment_status === "paid"}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {appt.meeting_link ? (
                      (() => {
                        const start = new Date(appt.date_time);
                        const fiveMinsBefore = new Date(start.getTime() - 5 * 60000);
                        const end = new Date(start.getTime() + 30 * 60000);
                        const isJoinable = currentTime >= fiveMinsBefore && currentTime < end;

                        if (isJoinable) {
                          return (
                            <a
                              href={appt.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700 transition shadow"
                            >
                              Join
                            </a>
                          );
                        } else if (currentTime < fiveMinsBefore) {
                          const diffMs = fiveMinsBefore - currentTime;
                          const diffMins = Math.ceil(diffMs / 60000);
                          return (
                            <span className="text-gray-400 text-xs italic" title={`Activates at ${fiveMinsBefore.toLocaleTimeString()}`}>
                              Wait {diffMins}m
                            </span>
                          );
                        } else {
                          return <span className="text-red-400 text-xs italic">Ended</span>;
                        }
                      })()
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}