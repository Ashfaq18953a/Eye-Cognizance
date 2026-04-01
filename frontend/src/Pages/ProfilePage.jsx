import React, { useState, useEffect, useMemo } from "react";
import { User, Lock, Users, Save, Eye, EyeOff, Loader2, ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Profile State
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        mobile: "",
        address: ""
    });

    // Password State
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

    // Patients State
    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredPatients = useMemo(() => {
        return patients.filter(p => 
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
        setCurrentPage(1);
    }, [searchTerm]);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchProfile();
        fetchPatients();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/auth/profile/");
            setProfile(res.data);
        } catch (err) {
            console.error("Error fetching profile", err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get("/api/patients/");
            setPatients(res.data);
        } catch (err) {
            console.error("Error fetching patients", err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.put("/api/auth/profile/", profile);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.post("/api/auth/change-password/", passwords);
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswords({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to change password" });
        } finally {
            setLoading(false);
        }
    };

    const handlePatientUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/api/patients/${editingPatient.id}/`, editingPatient);
            setEditingPatient(null);
            fetchPatients();
            setMessage({ type: "success", text: "Patient updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update patient" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${
                        message.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage({ type: "", text: "" })} className="text-sm font-bold">×</button>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b">
                        <button 
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === "profile" ? "text-green-700 border-b-2 border-green-700 bg-green-50/30" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <User size={18} />
                            Profile
                        </button>
                        <button 
                            onClick={() => setActiveTab("password")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === "password" ? "text-green-700 border-b-2 border-green-700 bg-green-50/30" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Lock size={18} />
                            Password
                        </button>
                        <button 
                            onClick={() => setActiveTab("patients")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === "patients" ? "text-green-700 border-b-2 border-green-700 bg-green-50/30" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Users size={18} />
                            Patients
                        </button>
                    </div>

                    <div className="p-8">
                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                                    <input 
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input 
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                    <input 
                                        type="tel"
                                        value={profile.mobile}
                                        onChange={(e) => setProfile({...profile, mobile: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                                    <textarea 
                                        value={profile.address}
                                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                                        className="w-full p-3 h-32 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Enter your address"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </form>
                        )}

                        {/* PASSWORD TAB */}
                        {activeTab === "password" && (
                            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Old Password</label>
                                    <input 
                                        type={showPass.old ? "text" : "password"}
                                        value={passwords.old_password}
                                        onChange={(e) => setPasswords({...passwords, old_password: e.target.value})}
                                        className="w-full p-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPass({...showPass, old: !showPass.old})}
                                        className="absolute right-4 bottom-3 text-gray-400"
                                    >
                                        {showPass.old ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <input 
                                        type={showPass.new ? "text" : "password"}
                                        value={passwords.new_password}
                                        onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                                        className="w-full p-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPass({...showPass, new: !showPass.new})}
                                        className="absolute right-4 bottom-3 text-gray-400"
                                    >
                                        {showPass.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <input 
                                        type={showPass.confirm ? "text" : "password"}
                                        value={passwords.confirm_password}
                                        onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                                        className="w-full p-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                                        className="absolute right-4 bottom-3 text-gray-400"
                                    >
                                        {showPass.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Update Password
                                </button>
                            </form>
                        )}

                        {/* PATIENTS TAB */}
                        {activeTab === "patients" && (
                            <div className="space-y-6">
                                {editingPatient ? (
                                    <div className="bg-[#B0D07D]/10 p-8 rounded-3xl border border-[#B0D07D]">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                                <Users size={24} className="text-green-700" />
                                                Edit Patient Details
                                            </h3>
                                            <button 
                                                onClick={() => setEditingPatient(null)} 
                                                className="text-gray-500 hover:text-black font-semibold flex items-center gap-1"
                                            >
                                                ✕ Cancel
                                            </button>
                                        </div>
                                        <form onSubmit={handlePatientUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Patient Name</label>
                                                <input 
                                                    type="text"
                                                    value={editingPatient.name}
                                                    onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                                                <input 
                                                    type="email"
                                                    value={editingPatient.email}
                                                    onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                                                <input 
                                                    type="tel"
                                                    value={editingPatient.mobile}
                                                    onChange={(e) => setEditingPatient({...editingPatient, mobile: e.target.value})}
                                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
                                                <input 
                                                    type="date"
                                                    value={editingPatient.dob || ""}
                                                    onChange={(e) => setEditingPatient({...editingPatient, dob: e.target.value})}
                                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Gender</label>
                                                <div className="flex gap-4 p-1">
                                                    {["Male", "Female", "Other"].map(g => (
                                                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                                            <input 
                                                                type="radio" 
                                                                name="gender" 
                                                                value={g}
                                                                checked={editingPatient.gender === g}
                                                                onChange={(e) => setEditingPatient({...editingPatient, gender: e.target.value})}
                                                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                                                            />
                                                            <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 mt-4">
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={22} />}
                                                    Save Patient Details
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <h3 className="font-bold text-gray-800 text-lg">Your Patient Records</h3>
                                            <div className="relative w-full md:w-72">
                                                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                                                <input 
                                                    type="text"
                                                    placeholder="Search by name, email, or mobile..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            {paginatedPatients.length > 0 ? (
                                                <div className="min-w-full inline-block align-middle">
                                                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">DOB / Gender</th>
                                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-100">
                                                                {paginatedPatients.map((p) => (
                                                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                                        <td className="px-6 py-5 whitespace-nowrap font-bold text-gray-800">{p.name}</td>
                                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-700">{p.email}</div>
                                                                            <div className="text-xs text-gray-400 mt-1 font-medium">{p.mobile}</div>
                                                                        </td>
                                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-700">{p.dob || "—"}</div>
                                                                            <div className="text-xs text-gray-400 mt-1">{p.gender || "—"}</div>
                                                                        </td>
                                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                                            <button 
                                                                                onClick={() => setEditingPatient(p)}
                                                                                className="inline-flex items-center gap-2 py-2 px-4 rounded-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-sm hover:shadow-green-100"
                                                                            >
                                                                                <Save size={14} />
                                                                                Update Details
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Pagination Controls */}
                                                    {totalPages > 1 && (
                                                        <div className="flex items-center justify-between bg-white px-4 py-6 sm:px-6 mt-2">
                                                            <div className="flex flex-1 justify-between sm:hidden">
                                                                <button
                                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                    disabled={currentPage === 1}
                                                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                                >
                                                                    Previous
                                                                </button>
                                                                <button
                                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                                    disabled={currentPage === totalPages}
                                                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                                >
                                                                    Next
                                                                </button>
                                                            </div>
                                                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                                                <div>
                                                                    <p className="text-sm text-gray-700">
                                                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredPatients.length)}</span> of{' '}
                                                                        <span className="font-medium">{filteredPatients.length}</span> results
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                                        <button
                                                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                            disabled={currentPage === 1}
                                                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30"
                                                                        >
                                                                            <ChevronLeft size={20} />
                                                                        </button>
                                                                        {[...Array(totalPages)].map((_, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={() => setCurrentPage(i + 1)}
                                                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1 ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}`}
                                                                            >
                                                                                {i + 1}
                                                                            </button>
                                                                        ))}
                                                                        <button
                                                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                                            disabled={currentPage === totalPages}
                                                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30"
                                                                        >
                                                                            <ChevronRight size={20} />
                                                                        </button>
                                                                    </nav>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-gray-400 mt-4 italic text-center">
                                                        Patients are automatically added to this list when you book an appointment for them.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="py-16 text-center text-gray-400 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                                    <Users className="mx-auto mb-4 opacity-10" size={64} />
                                                    <h4 className="text-lg font-bold text-gray-800">
                                                        {searchTerm ? "No Matching Records" : "No Patient Records Found"}
                                                    </h4>
                                                    <p className="max-w-xs mx-auto mt-2 text-sm">
                                                        {searchTerm ? "Try searching for a different name or contact number." : "Successfully booked patients will appear here for you to manage."}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
