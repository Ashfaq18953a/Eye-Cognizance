import React from "react";

const StatCard = ({ title, value, color }) => {
  const colorClass = color ? `text-${color}-700` : "text-green-700";
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-3xl font-black mt-2 ${colorClass}`}>{value}</p>
    </div>
  );
};

export default StatCard;
