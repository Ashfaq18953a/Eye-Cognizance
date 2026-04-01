// src/Pages/PersonalData.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaFileUpload, FaInfoCircle, FaArrowLeft } from "react-icons/fa";

import api from "./api";

const inputStyle =
  "w-full p-3 rounded-lg bg-white text-gray-800 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500";

const PersonalData = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm]);

  useEffect(() => {
    // Fetch patients from backend
    api.get("/api/patients/")
      .then(res => {
        setPatients(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        setPatients([]);
      });
  }, []);
  const [form, setForm] = useState({
    id: "",
    name: "",
    age: "",
    gender: "",
    relation: "",
    mobile: "",
    email: "",
    dob: "",
    address: "",
    reason: "",
    file: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("access");
    if (!token) {
      // Save intended route and booking state
      localStorage.setItem("postLoginRedirect", JSON.stringify({
        pathname: "/PersonalData",
        state: location.state
      }));
      navigate("/login");
    }
  }, [navigate, location.state]);

  const selectPatient = (p) => {
    setForm({ ...p, file: null });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setForm({ ...form, file: e.target.files[0] });

  const handleContinue = async () => {
    if (!form.name || !form.mobile || !form.email || !form.dob || !form.gender) {
      alert("Please fill name, email, mobile, date of birth & gender");
      return;
    }

    let finalId = form.id;

    // If no ID (just typing), check if these details match an existing patient perfectly
    if (!finalId) {
      const match = patients.find(
        (p) =>
          p.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
          p.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
          p.mobile.trim() === form.mobile.trim()
      );
      if (match) {
        finalId = match.id;
        console.log("Existing patient detected via match");
      }
    }

    try {
      // If patient exists (via selection or match), update details in DB
      if (finalId) {
        await api.put(`/api/patients/${finalId}/`, {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          dob: form.dob,
          gender: form.gender
        });
        console.log("Patient updated successfully");
      }
    } catch (err) {
      console.error("Error updating patient:", err);
    }

    const patient = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      dob: form.dob,
      gender: form.gender,
    };

    navigate("/Payment", {
      state: {
        ...location.state,
        patient,
      },
    });
  };

  return (
    <div>
      {/* Back */}
      <FaArrowLeft
        className="ml-6 mt-6 text-2xl text-green-700 cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* Steps */}
      <div className="mx-4 lg:mx-20 mt-6 mb-8 px-4 py-4 bg-[#D3E4B6] rounded-2xl">
        <div className="flex justify-between gap-4">
          {["Mode", "Schedule", "Details", "Payment"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
                  }`}
              >
                {i + 1}
              </div>
              <span className="text-xs font-bold">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-10 px-6 lg:px-20 pb-16">
        {/* LEFT */}
        <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow flex flex-col">
          <h2 className="text-xl font-bold mb-4">Existing Patients</h2>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 pl-9 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex-1 overflow-y-auto">
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => selectPatient(p)}
                  className={`p-4 mb-3 rounded-xl cursor-pointer border transition-all ${form.id === p.id || (form.name === p.name && form.email === p.email && form.mobile === p.mobile)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.email}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{p.mobile}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-10 italic">
                {searchTerm ? "No matching patients found." : "No existing patients found."}
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                disabled={currentPage === 1}
                className="p-2 text-xs font-bold text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-xs font-bold text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:w-2/3 bg-[#D3E4B6] p-8 rounded-2xl">
          <div className="flex items-center gap-3 bg-[#6A8E4F] text-white px-5 py-2 rounded-full w-fit mb-6">
            <FaUser />
            <span className="font-semibold">Personal Details</span>
          </div>

          <div className="space-y-5">
            <input type="hidden" name="id" value={form.id} />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputStyle}
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className={inputStyle}
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={inputStyle}
            />

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-bold mb-1 ml-1" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className={inputStyle}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-bold mb-1 ml-1" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Describe your problem"
              className={`${inputStyle} h-24`}
            />

            <div className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm">
              <FaFileUpload className="mb-2 text-gray-600" />
              <input type="file" onChange={handleFile} />
            </div>

            <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-xl">
              <FaInfoCircle className="mt-1 text-gray-600" />
              <p className="text-sm text-gray-700">
                Your personal information is secure and used only for
                consultation purposes.
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="mt-8 bg-[#6A8E4F] hover:bg-green-700 transition text-white px-10 py-3 rounded-full font-semibold block mx-auto"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalData;



// test api key rzp_test_SEQn9YN6JnqAT3 test key secret LEo2MXZx2bc71Vywy0zLfp24