import React, { useState, useEffect } from "react";
import { FaHourglassHalf, FaVideo, FaPhoneAlt } from "react-icons/fa";
import { PiMicrosoftTeamsLogoFill } from "react-icons/pi";
import { SiGooglemeet } from "react-icons/si";

const Status = () => {
  const [searchType, setSearchType] = useState("mobile"); // 'mobile' or 'bookingId'
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apptData, setApptData] = useState(null);
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [canJoin, setCanJoin] = useState(false);

  // CRITICAL: Your login page saves the token as "accessToken", NOT "access".
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      setSearchType("bookingId");
    }
  }, [isLoggedIn]);

  const handleCheck = async () => {
    setError("");
    setShowDetails(false);

    if (searchType === "mobile") {
      if (!phone.trim()) {
        setError("Please enter a mobile number");
        return;
      }
      if (!isLoggedIn) {
        setError("You must be logged in to search by mobile number.");
        return;
      }
    } else {
      if (!bookingId.trim()) {
        setError("Please enter a Booking ID");
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const queryParam = searchType === "mobile" ? `mobile=${phone}` : `bookingId=${bookingId}`;

      const headers = { "Content-Type": "application/json" };
      if (token && searchType === "mobile") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/patient/status/?${queryParam}`,
        { method: "GET", headers }
      );

      const data = await res.json();

      if (res.ok) {
        setApptData(data);
        setShowDetails(true);
      } else {
        setError(data.error || "No appointment found.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apptData || !apptData.date_time) return;

    const updateTimer = () => {
      const now = new Date();
      const apptTime = new Date(apptData.date_time);
      const endTime = new Date(apptTime.getTime() + 30 * 60000); // 30 mins later
      const diffMs = apptTime - now;

      const isExpired = now > endTime;
      const isTooEarly = diffMs > 300000; // 5 mins in ms

      if (!isTooEarly && !isExpired) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
      }

      if (isExpired) {
        setTimeLeftStr("Meeting Expired");
        return;
      }

      if (diffMs <= 0) {
        setTimeLeftStr("Meeting Ongoing...");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeftStr(
        `${hours.toString().padStart(2, "0")} hrs ${mins
          .toString()
          .padStart(2, "0")} mins left`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [apptData]);

  const getPlatformIcon = () => {
    if (!apptData) return <FaVideo size={30} />;
    if (apptData.consultation_type === "audio") return <FaPhoneAlt size={28} />;
    const link = apptData.meeting_link || "";
    if (link.includes("teams")) return <PiMicrosoftTeamsLogoFill size={28} />;
    if (link.includes("meet") || link.includes("jit")) return <SiGooglemeet size={28} />;
    return <FaVideo size={28} />;
  };

  const getPlatformName = () => {
    if (!apptData) return "Video Meeting";
    if (apptData.consultation_type === "audio") return "Audio Call";
    const link = apptData.meeting_link || "";
    if (link.includes("teams")) return "Microsoft Teams";
    if (link.includes("meet") || link.includes("jit")) return "Google Meet / Jitsi";
    return "Video Meeting";
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return (
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      " • " +
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const getConsultationTypeName = (type) => {
    if (type === "video") return "Video Consultation";
    if (type === "audio") return "Audio Consultation";
    return "Consultation";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-[#6A8E4F] flex flex-col justify-center items-center py-20 gap-4 text-white text-center px-4 no-print">
        <h1 className="text-3xl font-bold font-serif">Appointment Status Tracker</h1>
        <p className="max-w-2xl text-green-50 font-medium">
          Search by Mobile Number (Login Required) or Booking ID to track your appointment in real-time.
        </p>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* SEARCH BOX */}
        <div className="bg-white shadow-2xl border border-gray-100 rounded-[2.5rem] p-10 max-w-3xl mx-auto mb-16 transform transition-all no-print">

          {/* TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-10 w-fit mx-auto sm:mx-0 shadow-inner">
            <button
              onClick={() => { if(isLoggedIn) { setSearchType("mobile"); setError(""); } }}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 ${searchType === "mobile" ? "bg-white text-[#35A114] shadow-lg" : "text-gray-400"} ${!isLoggedIn ? "cursor-not-allowed opacity-50" : "hover:text-gray-600"}`}
              title={!isLoggedIn ? "Login required for Mobile search" : ""}
            >
              MOBILE NUMBER
            </button>
            <button
              onClick={() => { setSearchType("bookingId"); setError(""); }}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 ${searchType === "bookingId" ? "bg-white text-[#35A114] shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
            >
              BOOKING ID
            </button>
          </div>

          <label className="block font-black text-[#2C3E1F] text-xl mb-4 uppercase tracking-tighter">
            {searchType === "mobile" ? "Patient Mobile Number" : "Unique Booking ID"}
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={searchType === "mobile" ? "Enter Mobile Number..." : `e.g. BK-${new Date().getFullYear()}-123`}
              className="border-2 border-gray-100 bg-gray-50/50 p-5 rounded-[1.5rem] w-full focus:outline-none focus:border-[#6A8E4F] focus:bg-white transition-all text-xl font-bold shadow-sm"
              value={searchType === "mobile" ? phone : bookingId}
              onChange={(e) =>
                searchType === "mobile"
                  ? setPhone(e.target.value.replace(/\D/g, ""))
                  : setBookingId(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck();
              }}
            />

            <button
              className="bg-[#35A114] hover:bg-green-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-green-200/50 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 shrink-0"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? "SEARCHING..." : "TRACK NOW"}
            </button>
          </div>

          {searchType === "mobile" && !isLoggedIn && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-amber-800 text-sm font-bold flex items-center gap-2 italic">
                ⚠️ Secure Search: Please <a href="/login" className="underline font-black hover:text-amber-600">Login</a> to search appointments by your mobile number.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
              <p className="text-red-600 text-sm font-black flex items-center gap-2">
                ❌ {error}
              </p>
            </div>
          )}
        </div>

        {/* RESULTS */}
        {showDetails && apptData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">

            {/* MAIN INFO */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-10">

              <div className="bg-white shadow-2xl border border-gray-100 rounded-[3rem] p-10 relative overflow-hidden">
                <div className="print-only mb-8 text-center border-b-2 border-black pb-4">
                  <h1 className="text-2xl font-black uppercase tracking-widest text-black">Official Medical Consultation Receipt</h1>
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mt-2 italic">Eye-Cognizance Healthcare Services</p>
                </div>

                {/* 🏥 OFFICIAL PRINT-ONLY RECEIPT (Hidden on Screen) */}
                <div className="print-only w-full bg-white text-black p-0">
                  {/* HEADER */}
                  <div className="text-center border-b-4 border-black pb-8 mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-2">Eye-Cognizance</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.5em] text-gray-600 italic mb-4">Advanced Eye Care & Research Center</p>
                    <div className="text-[10px] space-y-1 font-bold">
                        <p>MG Road, Digital Health Square, Bangalore - 560001</p>
                        <p>Ph: +91 80 4567 8900 | support@eyecognizance.com</p>
                        <p className="text-blue-600 underline">www.eyecognizance.com</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-8 italic">
                    <h2 className="text-xl font-black uppercase border-b-2 border-black">Payment Receipt & Consultation Pass</h2>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase">Receipt No: {apptData.id}/{new Date().getFullYear()}</p>
                        <p className="text-[9px] font-black uppercase">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* RECEIPT GRID */}
                  <div className="grid grid-cols-2 gap-y-6 border-2 border-black p-8 rounded-none mb-10 text-sm">
                    <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Patient Name</p>
                        <p className="font-black text-lg">{apptData.patient_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Booking ID</p>
                        <p className="font-mono font-black text-lg underline">BK-{apptData.id}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Specialist</p>
                        <p className="font-black italic underline decoration-black underline-offset-4">Dr. {apptData.doctor_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Consultation Mode</p>
                        <p className="font-black uppercase">{apptData.consultation_type}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Appointment Schedule</p>
                        <p className="font-black">{formatDateTime(apptData.date_time)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Patient Gender</p>
                        <p className="font-black">{apptData.patient_gender || "Not Specified"}</p>
                    </div>
                  </div>

                  {/* FINANCIAL TABLE */}
                  <div className="mb-10">
                    <table className="w-full border-2 border-black text-sm">
                        <thead className="bg-gray-100 italic border-b-2 border-black font-black uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="p-4 text-left border-r-2 border-black">Description</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="font-bold uppercase text-xs">
                            <tr>
                                <td className="p-4 border-r-2 border-black border-b-2">Specialist Consultation Fee ({apptData.consultation_type})</td>
                                <td className="p-4 text-right border-b-2">₹{apptData.amount}.00</td>
                            </tr>
                            <tr>
                                <td className="p-4 border-r-2 border-black text-right font-black">Grand Total (Inclusive of Taxes)</td>
                                <td className="p-4 text-right text-xl font-black">₹{apptData.amount}.00</td>
                            </tr>
                        </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-end mb-16">
                    <div className="w-1/2 space-y-4">
                        <div className="border-4 border-green-800 text-green-800 w-fit p-3 opacity-50 font-black text-2xl rotate-[-12deg] rounded-xl border-double uppercase tracking-tighter">
                            Validated & Paid
                        </div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed max-w-sm italic">
                           * Please join the platform 6 mins before your slot.<br/>
                           * Digital receipt verified by Razorpay Gateway.<br/>
                           * No Physical Signature Required.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-40 h-20 border-b-2 border-black mb-2 opacity-10" />
                        <p className="text-[9px] font-black uppercase tracking-widest">Authorised Clinic Seal</p>
                    </div>
                  </div>

                  <div className="text-center border-t-2 border-dashed border-gray-300 pt-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">Authenticated Digital Copy</p>
                    <p className="text-[8px] font-bold">Transaction Reference: {apptData.transaction_id || "GATEWAY_MANUAL_AUTH"}</p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-full -z-0 no-print" />

                <h2 className="text-3xl font-black text-[#2C3E1F] pb-6 border-b border-gray-50 mb-8 flex items-center gap-4 relative z-10 no-print">
                  <span className="w-12 h-12 bg-[#35A114] text-white flex items-center justify-center rounded-2xl shadow-lg ring-4 ring-green-100">📋</span>
                  Appointment Pass
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 no-print">
                  <div className="space-y-8">
                    <div>
                      <p className="text-[#35A114] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Booking ID</p>
                      <p className="font-mono text-[#2C3E1F] font-black text-2xl bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-sm inline-block">BK-{new Date().getFullYear()}-{apptData.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Patient Full Name</p>
                      <p className="font-black text-[#2C3E1F] text-2xl">{apptData.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Slot Allocation</p>
                      <p className="font-bold text-gray-700 text-xl">{formatDateTime(apptData.date_time)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Patient Gender</p>
                      <p className="font-black text-[#2C3E1F] text-xl">{apptData.patient_gender || "Not Specified"}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Lead Specialist</p>
                      <p className="font-black text-[#2C3E1F] text-xl underline decoration-[#35A114] underline-offset-4">Dr. {apptData.doctor_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Service Type</p>
                      <p className="font-black text-gray-700 italic border-l-4 border-gray-200 pl-3">{getConsultationTypeName(apptData.consultation_type)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Current Status</p>
                      <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-black uppercase bg-green-600 text-white shadow-xl shadow-green-100">
                        ● {apptData.status || "CONFIRMED"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* PRINT ONLY FOOTER */}
                <div className="print-only mt-12 pt-8 border-t-2 border-dashed border-gray-300 no-print">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-4 underline">Terms & Conditions of Service</h4>
                  <ul className="text-[8px] text-gray-500 space-y-2 list-disc pl-4 italic">
                    <li>This is a digitally generated document. No physical signature is required for validation.</li>
                    <li>Please join the secure consultation link exactly 6 minutes before your scheduled slot.</li>
                    <li>Security protocols will automatically terminate any session that has expired for more than 30 minutes.</li>
                    <li>Refunds are subject to our cancellation policy (min. 24 hours notice required).</li>
                  </ul>
                  <div className="mt-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 text-center">Certified Digital Pass • Timestamp: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* PAYMENT CARD */}
              <div className="bg-[#2C3E1F] shadow-2xl rounded-[3rem] p-10 text-white relative overflow-hidden no-print">
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/5 rounded-full no-print" />

                <h2 className="text-2xl font-black pb-6 border-b border-white/10 mb-8 flex items-center gap-4 print:text-black print:border-black">
                  <span className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-xl font-serif no-print">₹</span>
                  Finance Snapshot
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                  <div>
                    <span className="text-white/40 text-[10px] font-black uppercase block mb-1 print:text-black/60">Total Paid</span>
                    <span className="text-3xl font-black">₹{apptData.amount}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] font-black uppercase block mb-1 print:text-black/60">Receipt Status</span>
                    <span className="text-sm font-black bg-[#35A114] px-4 py-1.5 rounded-full shadow-lg shadow-green-900/50 print:bg-gray-100 print:text-black print:border print:border-black print:shadow-none">{apptData.payment_status}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-white/40 text-[10px] font-black uppercase block mb-1 print:text-black/60">Transaction Ref</span>
                    <span className="text-xs font-mono font-bold text-white/70 block break-all print:text-black/70">{apptData.transaction_id || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              {/* PRINT BUTTON - HIDDEN ON PRINT */}
              <button 
                onClick={handlePrint}
                className="no-print bg-white border-2 border-green-600 text-green-700 font-black py-4 px-8 rounded-2xl hover:bg-green-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-100 w-fit mx-auto lg:mx-0 uppercase tracking-widest text-xs"
              >
                🖨️ Print Offical Receipt
              </button>
            </div>

            {/* ACTION CENTER */}
            <div className="flex flex-col gap-10 no-print">

              {/* TIMER */}
              <div className="bg-gradient-to-br from-[#B0D07D] to-[#86AE52] shadow-2xl rounded-[3rem] p-10 text-white transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3 opacity-70 mb-6">
                  <FaHourglassHalf size={24} className="animate-pulse" />
                  <h2 className="font-black uppercase tracking-[0.2em] text-xs">Live Status</h2>
                </div>
                <div>
                  <p className="text-5xl font-black mb-2 tracking-tighter">{timeLeftStr}</p>
                  <p className="text-green-900/60 font-black text-sm uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl inline-block">
                    {apptData.status === "cancelled" ? "VOID" : "ON SCHEDULE"}
                  </p>
                </div>
              </div>

              {/* JOIN BOX */}
              <div className="bg-white shadow-2xl border-4 border-green-50 rounded-[3rem] p-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  {getPlatformIcon()}
                </div>

                <h2 className="text-2xl font-black text-[#2C3E1F] mb-4">{getPlatformName()}</h2>
                <p className="text-gray-500 font-bold text-sm mb-10 px-4 leading-relaxed">
                  The secure consultation link is locked and will activate <span className="text-[#35A114]">5 minutes</span> before your slot.
                </p>

                <button
                  className={`w-full font-black py-6 rounded-[2rem] text-xl shadow-2xl transition-all duration-300 ${canJoin ? "bg-[#35A114] hover:bg-green-700 text-white hover:shadow-green-300 shadow-green-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  onClick={() => {
                    if (!canJoin) {
                      alert(timeLeftStr === "Meeting Expired" ? "Session Terminated: This consultation has expired." : "Security Protocol: Your consultation link activates exactly 5 minutes before the start time.");
                      return;
                    }
                    if (apptData.meeting_link) {
                      window.open(apptData.meeting_link, "_blank");
                    } else {
                      alert("Generating Secure Key: Please refresh in 30 seconds.");
                    }
                  }}
                >
                  ENTER SESSION
                </button>

                {!canJoin && timeLeftStr !== "Meeting Expired" && (
                  <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">
                    Waiting for Security Clearance...
                  </p>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }

        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; font-family: 'Times New Roman', serif; }
          .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .grid { display: block !important; }
          .col-span-1, .col-span-2 { width: 100% !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
          .shadow-2xl, .shadow-xl, .shadow-lg, .shadow-sm { box-shadow: none !important; }
          .rounded-[3rem], .rounded-[2.5rem], .rounded-[1.5rem] { border-radius: 0 !important; }
          .bg-white { background: white !important; }
          .bg-gray-50 { background: white !important; }
        }
        .print-only { display: none; }
      `}</style>
    </div>
  );
};

export default Status;