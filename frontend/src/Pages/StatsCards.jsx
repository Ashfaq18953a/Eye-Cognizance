import React from "react";

const StatsCards = () => {
  const stats = [
    { title: "Total Appointments", value: 42 },
    { title: "Today’s Appointments", value: 5 },
    { title: "Upcoming Meetings", value: 7 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow border"
        >
          <h3 className="text-gray-500 text-sm">{item.title}</h3>
          <p className="text-3xl font-black text-green-700 mt-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
