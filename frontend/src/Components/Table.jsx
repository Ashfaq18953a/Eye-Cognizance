// src/Components/Table.jsx
import React from "react";

export default function Table({ title, data, columns }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-x-auto p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="p-3">{row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}