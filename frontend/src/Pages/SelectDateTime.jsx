import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaVideo,
    FaCommentDots,
    FaPhoneAlt,
    FaArrowLeft,
    FaCalendarAlt
} from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

const DEFAULT_TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
];

const SelectDateTime = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [lockedSlots, setLockedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    // Calendar Display Logic
    const [viewDate, setViewDate] = useState(new Date());
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const totalDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    const calendarGrid = [];
    for (let i = 0; i < firstDay; i++) calendarGrid.push(null);
    for (let i = 1; i <= totalDays; i++) calendarGrid.push(i);

    const selectedType = state?.selectedType || "video";
    const typeConfig = {
        message: { title: "Questionnaire Consultation", price: "₹199", desc: "Digital prescription via secure message", icon: <FaCommentDots size={24} className="text-green-600" /> },
        video: { title: "Video Consultation", price: "₹599", desc: "15–20 minute face-to-face call", icon: <FaVideo size={24} className="text-green-600" /> },
        audio: { title: "Audio Consultation", price: "₹299", desc: "Expert guidance via audio call", icon: <FaPhoneAlt size={24} className="text-green-600" /> }
    };
    const currentType = typeConfig[selectedType];
    const today = new Date().toISOString().split("T")[0];

    // Helper: parse "HH:MM AM/PM" to total minutes for sorting
    const parseTimeToMins = (t) => {
        if (!t) return 0;
        const [time, mer] = t.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (mer === "PM" && h !== 12) h += 12;
        if (mer === "AM" && h === 12) h = 0;
        return h * 60 + m;
    };

    useEffect(() => {
        if (!selectedDate) return;

        // Fetch both in parallel; merge booked slots into the visible list
        Promise.all([
            axios.get(`${API_BASE}/admin/settings/?date=${selectedDate}`).catch(() => ({ data: {} })),
            axios.get(`${API_BASE}/locked-slots/?date=${selectedDate}`).catch(() => ({ data: { slots: [] } }))
        ]).then(([settingsRes, lockedRes]) => {
            const adminSlots  = settingsRes.data.available_slots || [];
            const booked      = lockedRes.data.slots || [];

            // Base slot list: custom admin config OR default 30-min grid
            const baseSlots = adminSlots.length > 0 ? adminSlots : DEFAULT_TIME_SLOTS;

            // Always include booked slots even if they fall outside baseSlots
            // (e.g. admin deleted 20-min config but patient already booked 11:20 AM)
            const merged = [...new Set([...baseSlots, ...booked])].sort(
                (a, b) => parseTimeToMins(a) - parseTimeToMins(b)
            );

            setAvailableSlots(merged);
            setLockedSlots(booked);
            setSelectedTime(null);
        });
    }, [selectedDate]);

    const handleContinue = () => {
        if (!selectedDate || !selectedTime) { alert("Please select date and time"); return; }
        navigate("/PersonalData", { state: { ...state, selectedDate, selectedTime } });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="px-4 lg:px-20 pt-6 flex items-center gap-4">
                <FaArrowLeft className="text-2xl text-green-700 cursor-pointer" onClick={() => navigate(-1)} />
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Back to Dashboard</span>
            </div>

            <div className="px-6 lg:px-20 my-8">
                <h1 className="text-4xl font-black text-[#2C3A23] tracking-tight italic">
                    {selectedDate ? "Choose Time" : "Select Date"}
                </h1>
                <p className="text-gray-500 font-medium">Complete your consultation booking</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 px-4 lg:px-20">
                <div className="w-full lg:flex-1">
                    
                    {/* 📅 STEP 1: CALENDAR (VISIABLE IF NO DATE SELECTED) */}
                    {!selectedDate && (
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-green-900/5 animate-in fade-in zoom-in-95 duration-500 border border-gray-100">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-black text-2xl text-[#2C3A23]">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
                                <div className="flex gap-4">
                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-3 hover:bg-green-50 text-green-600 rounded-2xl transition-all border border-gray-50 shadow-sm"><IoChevronBack size={20} /></button>
                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-3 hover:bg-green-50 text-green-600 rounded-2xl transition-all border border-gray-50 shadow-sm"><IoChevronForward size={20} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest mb-6">
                                {daysArr.map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-3">
                                {calendarGrid.map((day, i) => {
                                    if (!day) return <div key={i}></div>;
                                    const dStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const past = new Date(viewDate.getFullYear(), viewDate.getMonth(), day) < new Date().setHours(0,0,0,0);
                                    return (
                                        <button key={i} disabled={past} onClick={() => setSelectedDate(dStr)} className={`aspect-square flex items-center justify-center rounded-[1.2rem] font-black text-sm transition-all
                                            ${past ? 'text-gray-100 cursor-not-allowed opacity-20' : 'text-[#2C3A23] hover:bg-[#35A114] hover:text-white hover:shadow-xl hover:scale-110'}`}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 🕒 STEP 2: TIME SLOTS (VISIABLE IF DATE SELECTED) */}
                    {selectedDate && (
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-green-900/5 animate-in slide-in-from-right-10 duration-500 border border-gray-100">
                            <div className="flex justify-between items-end mb-10 border-b border-gray-50 pb-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Appointment Day</p>
                                    <h3 className="text-2xl font-black text-[#2C3A23] italic flex items-center gap-3">
                                        <FaCalendarAlt className="text-green-600" /> {selectedDate}
                                    </h3>
                                </div>
                                <button onClick={() => setSelectedDate(null)} className="text-xs font-black text-green-600 uppercase tracking-tighter hover:underline decoration-2 underline-offset-4">Change Date</button>
                            </div>

                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Available Consultation Times</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {availableSlots.map((slot) => {
                                    const lock = lockedSlots.includes(slot);
                                    let isPast = false;
                                    if (selectedDate === today) {
                                        const [t, m] = slot.split(" ");
                                        let [h, min] = t.split(":").map(Number);
                                        if (m === "PM" && h !== 12) h += 12;
                                        if (m === "AM" && h === 12) h = 0;
                                        const sTime = new Date();
                                        sTime.setHours(h, min, 0, 0);
                                        isPast = sTime <= new Date();
                                    }
                                    const dis = lock || isPast;
                                    const active = selectedTime === slot;
                                    return (
                                        <button key={slot} disabled={dis} onClick={() => setSelectedTime(slot)} className={`py-4 rounded-2xl font-black text-xs transition-all border
                                            ${dis ? "bg-gray-50 text-gray-200 strike" : 
                                              active ? "bg-[#35A114] text-white border-[#35A114] shadow-2xl scale-105" : 
                                              "bg-white border-gray-100 text-[#2C3A23] hover:border-green-600 hover:bg-green-50"}`}>
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 📌 SIDEBAR SUMMARY */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-[#2C3A23] rounded-[3rem] p-10 text-white shadow-2xl sticky top-8">
                        <h2 className="text-2xl font-black mb-8 border-b border-white/5 pb-6 italic">Summary</h2>
                        
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-green-400 shadow-inner">{currentType.icon}</div>
                            <div>
                                <p className="font-black text-lg leading-tight">{currentType.title}</p>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Eye-Cognizance</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center"><span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Date Selected</span><span className="font-black text-sm italic">{selectedDate || "Not Set"}</span></div>
                            <div className="flex justify-between items-center"><span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Time Selected</span><span className="font-black text-sm italic">{selectedTime || "Not Set"}</span></div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <span className="text-4xl font-black tracking-tighter italic text-green-400">{currentType.price}</span>
                            <button onClick={handleContinue} className={`px-8 py-4 rounded-2xl font-black transition-all shadow-xl
                                ${selectedDate && selectedTime ? "bg-white text-[#2C3A23] hover:bg-green-400 hover:scale-105" : "bg-white/5 text-white/20 cursor-not-allowed"}`}>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SelectDateTime;