import React from "react";

const Badge = ({ status, paid }) => {
  let color = "bg-gray-200 text-gray-700";
  if (paid) {
    color = status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
  } else {
    switch (status) {
      case "Completed":
        color = "bg-green-200 text-green-800";
        break;
      case "Pending":
        color = "bg-yellow-200 text-yellow-800";
        break;
      case "Cancelled":
        color = "bg-red-200 text-red-800";
        break;
      default:
        color = "bg-gray-200 text-gray-700";
    }
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
};

export default Badge;
