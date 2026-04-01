// src/Pages/PatientsPage.jsx
import { useEffect, useState } from "react";
import api from "./api"; // Axios instance
import Badge from "./components/Table"; // optional for styling
import React from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/admin/patients/") // backend endpoint
      .then((res) => {
        setPatients(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch patients:", err);
        setPatients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Patients</h1>

      {loading && <p className="text-gray-500 mb-4">Loading patients...</p>}

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Total Consultations</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.mobile}</td>
                  <td>{patient.total_consultations}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}