// import { useEffect, useState } from "react";
// import api from "./api";

// export default function AdminAnalyticsPage() {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/api/admin/analytics/")
//       .then(res => {
//         setAnalytics(res.data);
//       })
//       .catch(err => {
//         console.error("Error fetching analytics:", err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div className="p-6">Loading analytics...</div>;
//   }

//   if (!analytics) {
//     return <div className="p-6 text-red-500">Failed to load analytics</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {/* Top Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <Card title="Today's Appointments" value={analytics.appointments_today} />
//         <Card title="Upcoming Appointments" value={analytics.upcoming_appointments} />
//         <Card title="Today's Revenue" value={`$${analytics.today_revenue}`} />
//         <Card title="Monthly Revenue" value={`$${analytics.monthly_revenue}`} />
//       </div>

//       {/* Consultation Breakdown */}
//       <div className="bg-white shadow rounded p-6">
//         <h2 className="text-xl font-semibold mb-4">Today's Paid Consultations</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card title="Video" value={analytics.video_today} />
//           <Card title="Audio" value={analytics.audio_today} />
//           <Card title="Message" value={analytics.message_today} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function Card({ title, value }) {
//   return (
//     <div className="bg-white shadow rounded p-5 text-center">
//       <h3 className="text-gray-600 text-sm">{title}</h3>
//       <p className="text-2xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }