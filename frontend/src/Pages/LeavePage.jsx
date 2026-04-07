import { useState, useEffect } from "react";
import api from "./api";

export default function LeavePage() {
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split("T")[0]);
  const [markedLeaves, setMarkedLeaves] = useState([]);
  const [isLeave, setIsLeave] = useState(false);
  const [affectedPatients, setAffectedPatients] = useState([]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all leaves initially
  const fetchAllLeaves = () => {
    api.get("api/admin/leave-today/").then(res => setMarkedLeaves(res.data.all_leaves || [])).catch(() => { });
  };

  useEffect(() => {
    fetchAllLeaves()
  }, []);

  // Check state and affected patients for selected date
  useEffect(() => {
    setLoading(true);
    api.get(`api/admin/leave-today/?date=${leaveDate}`)
      .then(res => {
        // Find if this date is in the list of leaves
        const isCurrentlyLeave = res.data.all_leaves?.some(l => l.date === leaveDate);
        setIsLeave(isCurrentlyLeave);
        setAffectedPatients(res.data.appointments || []);
      })
      .catch(() => {
        setIsLeave(false);
        setAffectedPatients([]);
      })
      .finally(() => setLoading(false));
  }, [leaveDate]);

  const markLeave = async () => {
    if (!window.confirm(`Mark ${leaveDate} as leave? ${affectedPatients.length} patients will be cancelled and notified.`)) return;
    setLoading(true);
    try {
      const res = await api.post("api/admin/leave-today/", { 
        date: leaveDate,
        custom_message: customMessage
      });
      setIsLeave(true);
      setAffectedPatients([]); // cleared after cancellation
      fetchAllLeaves(); // refresh list
      showToast("success", `✅ Leave marked. ${res.data.cancelled || 0} patients notified.`);
    } catch {
      showToast("error", "❌ Failed to mark leave.");
    } finally { setLoading(false); }
  };

  const deleteLeave = async (targetDate) => {
    const d = targetDate || leaveDate;
    if (!window.confirm(`Remove leave for ${d}? Slots will be unlocked (silent).`)) return;
    setLoading(true);
    try {
      await api.delete(`api/admin/leave-today/?date=${d}`);
      if (d === leaveDate) setIsLeave(false);
      fetchAllLeaves(); // refresh list
      showToast("success", `🔓 Leave removed for ${d}. Slots unlocked.`);
    } catch {
      showToast("error", "❌ Failed to remove leave.");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      {toast && (
        <div style={{ ...s.toast, background: toast.type === "success" ? "#10b981" : "#ef4444" }}>
          {toast.msg}
        </div>
      )}

      <div style={s.card}>
        <h2 style={s.heading}>🚫 Doctor Leave Management</h2>

        <div style={s.field}>
          <label style={s.label}>📅 Select Leave Date</label>
          <input
            type="date"
            value={leaveDate}
            onChange={e => setLeaveDate(e.target.value)}
            style={s.input}
          />
        </div>

        <div style={s.statusBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={s.subhead}>Status for {leaveDate}</span>
            {isLeave
              ? <span style={s.leaveBadge}>🔴 ON LEAVE</span>
              : <span style={s.availBadge}>🟢 AVAILABLE</span>
            }
          </div>

          {!isLeave && affectedPatients.length > 0 && (
            <div style={s.affectedBox}>
              <h4 style={{ fontSize: 13, color: "#f59e0b", marginBottom: 10 }}>⚠️ {affectedPatients.length} Patients Affected:</h4>
              <div style={s.patientScroller}>
                {affectedPatients.map(p => (
                  <div key={p.id} style={s.pItem}>
                    <span>{p.time} - <strong>{p.patient_name}</strong></span>
                    <span style={{ fontSize: 10, opacity: 0.6 }}>{p.patient_email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            {!isLeave ? (
              <>
                <textarea 
                  placeholder="Optional custom message for patients..."
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  style={s.textarea}
                />
                <button onClick={markLeave} disabled={loading} style={s.markBtn}>
                  {loading ? "Processing..." : "🔴 Mark as Leave (Cancel Appts)"}
                </button>
              </>
            ) : (
              <button onClick={() => deleteLeave(leaveDate)} disabled={loading} style={s.delBtn}>
                {loading ? "Processing..." : "🔓 Remove Leave (Unlock Slots)"}
              </button>
            )}
          </div>
        </div>

        {/* ── LIST OF ALL MARKED LEAVES ─────────────────────────────── */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ ...s.subhead, marginBottom: 15, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            📋 Upcoming Marked Leaves
          </h3>
          {markedLeaves.length === 0 ? (
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
              No upcoming leaves marked yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {markedLeaves.map((l) => (
                <div key={l.id} style={s.leaveItem}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{l.date}</span>
                  <button onClick={() => deleteLeave(l.date)} style={s.delItemBtn}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.info}>
          <p><strong>Note:</strong> Marking leave will cancel appointments and send notifications. Deleting leave only unlocks the slots for new bookings.</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 500, background: "#fff", padding: 40, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 30, textAlign: "center", color: "#1e293b" },
  field: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none", fontSize: 14 },
  statusBox: { background: "#f8fafc", padding: 24, borderRadius: 20, border: "1.5px solid #e2e8f0" },
  subhead: { fontSize: 14, fontWeight: 600, color: "#475569" },
  leaveBadge: { background: "#fee2e2", color: "#dc2626", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 10 },
  availBadge: { background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 10 },
  markBtn: { width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer" },
  delBtn: { width: "100%", padding: "14px", borderRadius: 12, border: "1.5px solid #16a34a", background: "#f0fdf4", color: "#16a34a", fontWeight: 700, cursor: "pointer" },
  leaveItem: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1.5px solid #e2e8f0", padding: "10px 16px", borderRadius: 12 },
  delItemBtn: { padding: "4px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  info: { marginTop: 20, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 },
  toast: { position: "fixed", top: 24, right: 24, padding: "12px 24px", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 14, zIndex: 9999 },
  textarea: { width: "100%", height: 80, padding: 12, borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 13, marginBottom: 15, outline: "none", resize: "none", fontFamily: "inherit" },
  affectedBox: { marginTop: 20, padding: 15, background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a" },
  patientScroller: { maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 },
  pItem: { display: "flex", flexDirection: "column", fontSize: 12, color: "#92400e", borderBottom: "1px solid #fef3c7", paddingBottom: 5 }
};