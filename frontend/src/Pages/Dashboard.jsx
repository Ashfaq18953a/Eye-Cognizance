import { useEffect, useState } from "react";
import api from "./api";
import StatCard from "./Components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/api/admin/analytics/");
      setStats(statsRes.data || {});
      const notifRes = await api.get("/api/admin/notifications/");
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.post("/api/admin/notifications/mark-read/");
      setNotifications([]);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <div className="p-10 bg-gray-50/50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">👋 Hello Admin,</h1>
          <p className="text-gray-500 mt-2 text-lg">Detailed insight into your clinic's performance today.</p>
        </header>

        {/* ── Stats Highlights ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <StatBox title="Appointments" value={stats.appointments_today || 0} icon="📅" color="blue" subtitle="Scheduled for today" />
          <StatBox title="Revenue Today" value={`₹${stats.today_revenue || 0}`} icon="💰" color="green" subtitle="Cash in today" />
          <StatBox title="Monthly Revenue" value={`₹${stats.monthly_revenue || 0}`} icon="📈" color="purple" subtitle="Total for current month" />
          <StatBox title="Video Calls" value={stats.video_today || 0} icon="📹" color="teal" />
          <StatBox title="Audio Calls" value={stats.audio_today || 0} icon="📞" color="orange" />
          <StatBox title="Messages" value={stats.message_today || 0} icon="💬" color="pink" />
        </section>

        {/* ── Alerts & Notifications ── */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
              🔔 Activity Alerts
              {notifications.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {notifications.length} NEW
                </span>
              )}
            </h2>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>

          <div className="p-8">
            {notifications.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <span className="text-6xl mb-4 grayscale opacity-30">✨</span>
                <p className="text-gray-400 font-medium text-lg">Your workspace is all clear!</p>
                <p className="text-gray-300 text-sm">No new cancellation alerts to show.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {notifications.map((n) => (
                    <div key={n.id} className="p-5 bg-red-50/50 border border-red-100 rounded-2xl flex items-center gap-4 group hover:bg-red-50 transition-all duration-300">
                        <div className="w-12 h-12 bg-red-100/50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚠️</div>
                        <div className="flex-1">
                            <p className="text-red-900 font-bold leading-tight">{n.message}</p>
                            <p className="text-[11px] text-red-400 uppercase font-black tracking-widest mt-1">
                                {new Date(n.created_at).toLocaleString('en-IN', { hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short'})}
                            </p>
                        </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({ title, value, icon, color, subtitle }) {
    const theme = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        teal: "bg-teal-50 text-teal-600",
        orange: "bg-orange-50 text-orange-600",
        pink: "bg-pink-50 text-pink-600",
    };
    
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className={`w-14 h-14 ${theme[color] || theme.blue} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
            {subtitle && <p className="text-[11px] text-gray-400 font-medium mt-3 uppercase tracking-wider">{subtitle}</p>}
        </div>
    );
}
