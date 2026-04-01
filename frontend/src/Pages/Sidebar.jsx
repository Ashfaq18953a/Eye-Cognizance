import React from "react";
import { FaCalendarAlt, FaUsers, FaVideo } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-green-700 text-white p-6">
      <h1 className="text-2xl font-black mb-10">Doctor Panel</h1>

      <nav className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded hover:bg-green-600 cursor-pointer">
          <FaCalendarAlt /> Appointments
        </div>

        <div className="flex items-center gap-3 p-3 rounded hover:bg-green-600 cursor-pointer">
          <FaUsers /> Patients
        </div>

        <div className="flex items-center gap-3 p-3 rounded hover:bg-green-600 cursor-pointer">
          <FaVideo /> Meetings
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
