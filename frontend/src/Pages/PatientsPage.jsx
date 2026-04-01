// import { useEffect, useState } from "react";
// import axios from "axios";
// import Table from "../Components/Table"; // reuse Table
// import Badge from "../Components/Badge"; // reuse Badge

// export default function PatientsPage() {
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     axios.get("/admin/patients/")
//       .then(res => setPatients(Array.isArray(res.data) ? res.data : []))
//       .catch(err => setPatients([]));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Patients</h1>
//       <Table
//         title="Patient List"
//         data={patients}
//         columns={[
//           { label: "Name", key: "name" },
//           { label: "Email", key: "email" },
//           { label: "Mobile", key: "mobile" },
//           { label: "Total Consultations", key: "total_consultations" },
//         ]}
//       />
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import api from "./api"; // Axios instance
// import Table from "../Components/Table";

// export default function PatientsPage() {
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("access"); // JWT token
//     if (!token) return console.error("No JWT token found!");

//     api.get("/api/admin/patients/", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then(res => {
//       console.log("API DATA:", res.data); // 🔍 debug
//       setPatients(res.data);
//     })
//     .catch(err => {
//       console.error("ERROR FETCHING PATIENTS:", err.response || err);
//     });
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Patients</h1>

//       <Table
//         title="Patient List"
//         data={patients}
//         columns={[
//           { label: "Name", key: "name" },
//           { label: "Email", key: "email" },
//           { label: "Mobile", key: "mobile" },
//           { label: "Total Consultations", key: "total_consultations" },
//         ]}
//       />
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import api from "./api"; // Axios instance
// import Table from "../Components/Table";

// export default function PatientsPage() {
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     // Simple GET request, no auth
//     api.get("/api/admin/patients/")
//       .then(res => {
//         console.log("PATIENT DATA:", res.data);
//         setPatients(res.data);
//       })
//       .catch(err => {
//         console.error("ERROR FETCHING PATIENTS:", err);
//       });
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Patients</h1>

//       <Table
//         title="Patient List"
//         data={patients}
//         columns={[
//           { label: "Name", key: "name" },
//           { label: "Email", key: "email" },
//           { label: "Mobile", key: "mobile" },
//           { label: "Total Consultations", key: "total_consultations" },
//         ]}
//       />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "./api"; // Axios instance
import Table from "../Components/Table";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // 'all' means show entire patient database, otherwise use date string
  const [selectedDate, setSelectedDate] = useState("all");

  const fetchPatients = async (date) => {
    setLoading(true);
    try {
      // If date is 'all', we send 'all' to backend
      const res = await api.get(`/api/admin/patients/?date=${date}`);
      setPatients(res.data);
      console.log("Patients:", res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component mounts and whenever date changes
  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#2C3E1F] tracking-tight">Patient Database</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Currently viewing: {selectedDate === 'all' ? 'All Registered Patients' : `Appointments on ${selectedDate}`}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
             <button 
                onClick={() => setSelectedDate("all")}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${selectedDate === 'all' ? 'bg-[#35A114] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
                VIEW ALL
             </button>
             
             <div className="h-6 w-[2px] bg-gray-200" />

             <div className="flex items-center gap-2 px-3">
                <span className="text-[10px] font-black text-gray-300 uppercase">Filter Date:</span>
                <input
                    type="date"
                    value={selectedDate === 'all' ? '' : selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value || "all")}
                    className="bg-white border text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35A114]"
                />
             </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No patients found for {selectedDate}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-50 text-[10px] font-black uppercase text-gray-300 tracking-widest">
                  <th className="px-6 py-4">Full Name / Username</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 text-center">Identity</th>
                  <th className="px-6 py-4 text-center">Consultations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((patient, idx) => (
                  <tr key={idx} className="group hover:bg-green-50/50 transition-colors">
                    <td className="px-6 py-5">
                       <p className="font-black text-[#2C3E1F] text-lg group-hover:text-[#35A114] transition-colors">{patient.name}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Patient UID: EY-{patient.id || idx + 1000}</p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-sm font-bold text-gray-600">{patient.email}</p>
                       <p className="text-xs font-black text-[#35A114] mt-1">{patient.mobile}</p>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-600">{patient.gender || "N/A"}</span>
                          <span className="text-[9px] font-bold text-gray-400">{patient.dob || "DOB NOT SET"}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="inline-block text-xl font-black text-[#2C3E1F] bg-green-100/50 min-w-10 py-1 rounded-xl border border-green-200 shadow-sm">
                          {patient.total_consultations}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}