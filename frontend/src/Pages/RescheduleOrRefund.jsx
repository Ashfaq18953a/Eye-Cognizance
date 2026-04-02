import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function RescheduleOrRefund() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDone, setActionDone] = useState(null); // null | "reschedule" | "cancel" | "already_rescheduled" | "already_cancelled"
  const [processing, setProcessing] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const [error, setError] = useState(null);

  // New state for confirmation and upload
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  // Flow from email: "reschedule" or "cancel"
  const flow = searchParams.get("action");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/patient/reschedule-or-refund/${id}/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
            setError(data.error);
            setLoading(false);
            return;
        }
        setAppt(data);
        
        // Locked states
        if (data.emergency_rescheduled) {
            setActionDone("already_rescheduled");
        } else if (data.status === "cancelled" && data.payment_status === "refunded") {
            setActionDone("already_cancelled");
        }
        
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load appointment details.");
        setLoading(false);
      });
  }, [id]);

  const handleAction = async (action) => {
    setProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("action", action);
      if (action === "cancel") {
        formData.append("reason", reason);
        if (file) formData.append("document", file);
      }

      const res = await fetch(`http://127.0.0.1:8000/api/patient/reschedule-or-refund/${id}/`, {
        method: "POST",
        body: formData, // Sending multipart/form-data
      });
      
      const data = await res.json();
      if (data.success) {
        setActionDone(action);
        if (action === "cancel") setRefundStatus(data.refund_status);
        if (action === "reschedule") {
          setTimeout(() => navigate("/selectDateTime", { state: { isReschedule: true, oldApptId: id } }), 1500);
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setProcessing(false);
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading appointment details...</p>
      </div>
    );
  }

  if (error && !appt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-4 border-red-500">
          <p className="text-red-600 font-bold text-lg mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const ApptInfo = () => (
    <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200 text-sm space-y-2 shadow-inner">
      <div className="flex justify-between"><span className="text-gray-500">Doctor:</span> <strong className="text-gray-800">{appt.doctor_name}</strong></div>
      <div className="flex justify-between"><span className="text-gray-500">Original Slot:</span> <strong className="text-gray-800">{new Date(appt.date_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong></div>
      <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Paid Amount:</span> <strong className="text-green-600">₹{appt.amount}</strong></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECF3DF] to-[#d6eaf8] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden">
        {processing && <div className="absolute top-0 left-0 h-1 bg-blue-500 animate-progress-indefinite w-full"></div>}

        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Emergency Update</h1>
            <p className="text-gray-500 mt-2">Managing your cancelled appointment.</p>
        </div>

        {/* ALREADY DONE STATES */}
        {actionDone === "already_rescheduled" || actionDone === "reschedule" ? (
            <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
                <div className="text-5xl mb-4">🗓️</div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Already Rescheduled</h2>
                <p className="text-green-700 text-sm">
                    This appointment has already been rescheduled. 
                    {actionDone === "reschedule" ? " Redirecting you now..." : " No further changes can be made."}
                </p>
            </div>
        ) : actionDone === "already_cancelled" || actionDone === "cancel" ? (
            <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-2xl font-bold text-blue-800 mb-2">Already Refunded</h2>
                <p className="text-blue-700 text-sm">
                    Your refund of ₹{appt.amount} has been initiated. 
                    Expect it in 3-5 business days.
                </p>
            </div>
        ) : !showConfirm ? (
          <>
            <ApptInfo />
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm animate-shake">⚠️ {error}</div>}
            
            <div className="space-y-4">
                {flow === "reschedule" ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-4 rounded-2xl bg-[#6A8E4F] hover:bg-[#5a7a41] text-white font-bold text-lg transition-all shadow-lg active:scale-95"
                    >
                        📅 Reschedule for Free
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Reason for refund (optional)</label>
                             <textarea 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Tell us why you are requesting a refund..."
                                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-[#6A8E4F] outline-none h-24 transition-all"
                             />
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Upload supporting document (optional)</label>
                             <input 
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                             />
                        </div>

                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all shadow-lg active:scale-95"
                        >
                            💰 Confirm & Request Refund
                        </button>
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="py-10 text-center space-y-6">
              <div className="text-6xl animate-bounce">{flow === "reschedule" ? "🗓️" : "❓"}</div>
              <h2 className="text-2xl font-bold text-gray-800">
                {flow === "reschedule" ? "Are you sure you want to reschedule?" : "Are you sure you want to cancel and refund?"}
              </h2>
              <p className="text-gray-500 text-sm">
                Once confirmed, this action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    disabled={processing}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => handleAction(flow)}
                    disabled={processing}
                    className={`flex-1 py-3 rounded-xl text-white font-bold transition shadow-md active:scale-95 disabled:opacity-50 ${flow === 'reschedule' ? 'bg-[#6A8E4F] hover:bg-[#5a7a41]' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {processing ? "Confirming..." : "Yes, Proceed"}
                  </button>
              </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress-indefinite { 0% { left: -100%; width: 100%; } 100% { left: 100%; width: 100%; } }
        .animate-progress-indefinite { animation: progress-indefinite 1.5s infinite linear; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
