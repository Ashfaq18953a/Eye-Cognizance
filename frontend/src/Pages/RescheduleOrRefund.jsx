import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function RescheduleOrRefund() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDone, setActionDone] = useState(null); // null | "reschedule" | "cancel"
  const [processing, setProcessing] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const [error, setError] = useState(null);

  // Pre-select action from query param (?action=reschedule or ?action=cancel)
  const defaultAction = searchParams.get("action");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/patient/reschedule-or-refund/${id}/`)
      .then((r) => r.json())
      .then((data) => {
        setAppt(data);
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
      const res = await fetch(`http://127.0.0.1:8000/api/patient/reschedule-or-refund/${id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setActionDone(action);
        if (action === "cancel") setRefundStatus(data.refund_status);
        if (action === "reschedule") {
          // Redirect to booking page with state to bypass payment
          setTimeout(() => navigate("/selectDateTime", { state: { isReschedule: true, oldApptId: id } }), 2000);
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading your appointment…</p>
      </div>
    );
  }

  if (error && !appt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-red-600 font-bold text-lg">❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECF3DF] to-[#d6eaf8] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Appointment Cancelled</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your appointment was cancelled because the doctor is on leave today. Please choose what you'd like to do.
        </p>

        {/* Appointment Summary */}
        {appt && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200 text-sm space-y-1">
            <p><span className="text-gray-500">Doctor:</span> <strong>{appt.doctor_name}</strong></p>
            <p><span className="text-gray-500">Date & Time:</span> <strong>{new Date(appt.date_time).toLocaleString()}</strong></p>
            <p><span className="text-gray-500">Type:</span> <strong className="capitalize">{appt.consultation_type}</strong></p>
            <p><span className="text-gray-500">Amount Paid:</span> <strong>₹{appt.amount}</strong></p>
          </div>
        )}

        {/* Result messages */}
        {actionDone === "reschedule" && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-5 text-center">
            <p className="text-green-700 font-bold text-lg">✅ Reschedule Confirmed!</p>
            <p className="text-green-600 text-sm mt-1">
              You won't be charged again. Redirecting you to the booking page…
            </p>
          </div>
        )}

        {actionDone === "cancel" && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-5 text-center">
            <p className="text-blue-700 font-bold text-lg">✅ Cancellation Confirmed</p>
            <p className="text-blue-600 text-sm mt-1">
              Refund status: <strong>{refundStatus}</strong>
            </p>
            <p className="text-blue-500 text-xs mt-1">
              You'll receive a confirmation email shortly.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-4">
            <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
          </div>
        )}

        {/* Action buttons — only show if no action taken yet */}
        {!actionDone && (
          <div className="flex flex-col gap-4 mt-2">
            <button
              onClick={() => handleAction("reschedule")}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-[#6A8E4F] hover:bg-[#55753F] text-white font-bold transition disabled:opacity-50"
            >
              {processing ? "Processing…" : "📅 Reschedule (Free)"}
            </button>
            <button
              onClick={() => handleAction("cancel")}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50"
            >
              {processing ? "Processing…" : "💰 Cancel & Get Refund"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
