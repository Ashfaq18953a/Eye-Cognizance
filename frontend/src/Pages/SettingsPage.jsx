import { useState, useEffect } from "react";
import api from "./api";

const ALL_TIMES = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
  "07:00 PM", "07:30 PM",
];

const DURATIONS = [10, 15, 20, 30, 45, 60];

const emptyRange = () => ({ from: "", to: "", duration: 30 });
const defaultRows = () => [emptyRange(), emptyRange(), emptyRange()];

export default function AdminSettingsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [savedRanges, setSavedRanges] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editRanges, setEditRanges] = useState(defaultRows());

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);



  /* ── Toast helper ─────────────── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Fetch when date changes ──── */
  useEffect(() => {
    setLoading(true);
    setSavedRanges([]);
    setSavedSlots([]);
    setIsEditing(false);

    api.get(`api/admin/settings/?date=${selectedDate}`)
      .then(res => {
        const ranges = res.data.time_ranges;
        const slots = res.data.available_slots || [];
        if (ranges && Array.isArray(ranges) && ranges.length > 0) {
          setSavedRanges(ranges.map(r => ({ ...r, duration: r.duration || 30 })));
          setSavedSlots(slots);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [selectedDate]);



  /* ── Enter edit mode ─────────── */
  const startEditing = () => {
    if (savedRanges.length > 0) {
      const rows = savedRanges.map(r => ({ ...r }));
      while (rows.length < 3) rows.push(emptyRange()); // pad to 3
      setEditRanges(rows);
    } else {
      setEditRanges(defaultRows()); // 3 blank rows
    }
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  /* ── Edit helpers ────────────── */
  const handleRangeChange = (i, field, value) =>
    setEditRanges(editRanges.map((r, idx) =>
      idx === i ? { ...r, [field]: field === "duration" ? Number(value) : value } : r
    ));

  const addRange = () => setEditRanges([...editRanges, emptyRange()]);
  const removeRange = (i) => {
    if (editRanges.length > 1) setEditRanges(editRanges.filter((_, idx) => idx !== i));
  };

  /* ── Save ──────────────────── */
  const saveAvailability = async () => {
    const filled = editRanges.filter(r => r.from || r.to);
    if (filled.length === 0) { showToast("error", "⚠️ Please fill at least one time range."); return; }
    for (let r of filled) {
      if (!r.from || !r.to) { showToast("error", "⚠️ Both From and To are required for each filled range."); return; }
    }
    setLoading(true);
    try {
      const res = await api.post("api/admin/settings/", {
        date: selectedDate,
        time_ranges: filled,
      });
      const slots = Array.isArray(res.data.available_slots) ? res.data.available_slots : [];
      setSavedRanges(filled);
      setSavedSlots(slots);
      setIsEditing(false);
      showToast("success", `✅ Saved! ${slots.length} slots generated for ${selectedDate}`);
    } catch {
      showToast("error", "❌ Error saving availability.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete all overrides ─── */
  const deleteAll = async () => {
    if (!window.confirm("Delete all custom slots for this day? Patients will see default schedule.")) return;
    setLoading(true);
    try {
      await api.post("api/admin/settings/", { date: selectedDate, time_ranges: [] });
      setSavedRanges([]); setSavedSlots([]); setIsEditing(false);
      showToast("success", "🗑️ Override deleted — default schedule will apply.");
    } catch {
      showToast("error", "❌ Error deleting.");
    } finally { setLoading(false); }
  };

  /* ── Delete single range ──── */
  const deleteSingleRange = async (i) => {
    const updated = savedRanges.filter((_, idx) => idx !== i);
    setLoading(true);
    try {
      const res = await api.post("api/admin/settings/", {
        date: selectedDate,
        time_ranges: updated,
      });
      const slots = Array.isArray(res.data.available_slots) ? res.data.available_slots : [];
      setSavedRanges(updated);
      setSavedSlots(slots);
      showToast("success", `🗑️ Range removed. ${slots.length} slots remaining.`);
    } catch {
      showToast("error", "❌ Error removing range.");
    } finally { setLoading(false); }
  };

  const hasOverride = savedRanges.length > 0;

  return (
    <div style={css.page}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ ...css.toast, background: toast.type === "success" ? "#10b981" : "#ef4444" }}>
          {toast.msg}
        </div>
      )}

      <div style={css.card}>
        <h2 style={css.heading}>⚙️ Availability Settings</h2>



        {/* Date picker for availability override */}
        <div style={css.field}>
          <label style={css.label}>📅 Set Custom Availability (by date)</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={css.input}
          />
        </div>

        {loading && <p style={css.dim}>Loading…</p>}

        {/* ═══════════════════════════════════════════
            VIEW MODE — show saved schedule as cards
            ═══════════════════════════════════════════ */}
        {!loading && !isEditing && (
          <>
            {hasOverride ? (
              <>
                {/* Header */}
                <div style={css.row}>
                  <span style={css.sectionTitle}>📋 Saved Schedule</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={startEditing} style={css.editBtn}>✏️ Edit</button>
                    <button onClick={deleteAll} style={css.delAllBtn}>🗑️ Delete All</button>
                  </div>
                </div>

                {/* Range cards */}
                {savedRanges.map((r, i) => (
                  <div key={i} style={css.rangeCard}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={css.timeText}>{r.from}</span>
                      <span style={css.arrow}>→</span>
                      <span style={css.timeText}>{r.to}</span>
                      <span style={css.badge}>{r.duration || 30} min slots</span>
                    </div>
                    <button onClick={() => deleteSingleRange(i)} style={css.xBtn} title="Remove this range">✕</button>
                  </div>
                ))}

                {/* Slot chips */}
                {savedSlots.length > 0 && (
                  <div style={css.slotsBox}>
                    <p style={css.slotsTitle}>🕒 Generated Slots ({savedSlots.length})</p>
                    <div style={css.slotGrid}>
                      {savedSlots.map(sl => <span key={sl} style={css.chip}>{sl}</span>)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div style={css.emptyBox}>
                <p style={css.emptyMain}>No custom schedule for <strong>{selectedDate}</strong></p>
                <p style={css.emptySub}>Default slots (9 AM – 7:30 PM) will apply to patients.</p>
                <button onClick={startEditing} style={css.addFirstBtn}>+ Set Custom Schedule</button>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════
            EDIT MODE — 3 rows ready to fill
            ═══════════════════════════════════════════ */}
        {!loading && isEditing && (
          <>
            <div style={css.row}>
              <span style={css.sectionTitle}>✏️ Set Available Time Ranges</span>
              <button onClick={cancelEditing} style={css.cancelSmBtn}>✕ Cancel</button>
            </div>

            {editRanges.map((range, i) => (
              <div key={i} style={css.editCard}>
                <span style={css.rangeLabel}>Slot {i + 1}</span>
                <div style={css.selectRow}>

                  <div style={css.colGroup}>
                    <label style={css.miniLabel}>From</label>
                    <select
                      value={range.from}
                      onChange={e => handleRangeChange(i, "from", e.target.value)}
                      style={css.sel}
                    >
                      <option value="">-- Select --</option>
                      {ALL_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <span style={{ ...css.arrow, paddingBottom: 2 }}>→</span>

                  <div style={css.colGroup}>
                    <label style={css.miniLabel}>To</label>
                    <select
                      value={range.to}
                      onChange={e => handleRangeChange(i, "to", e.target.value)}
                      style={css.sel}
                    >
                      <option value="">-- Select --</option>
                      {ALL_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div style={css.colGroup}>
                    <label style={css.miniLabel}>Duration</label>
                    <select
                      value={range.duration}
                      onChange={e => handleRangeChange(i, "duration", e.target.value)}
                      style={css.sel}
                    >
                      {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                    </select>
                  </div>

                  {editRanges.length > 1 && (
                    <button onClick={() => removeRange(i)} style={{ ...css.xBtn, alignSelf: "flex-end" }} title="Remove row">✕</button>
                  )}
                </div>
              </div>
            ))}

            <button onClick={addRange} style={css.addMoreBtn}>+ Add Another Range</button>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={saveAvailability} style={css.saveBtn} disabled={loading}>
                {loading ? "Saving…" : "💾 Save Schedule"}
              </button>
              <button onClick={cancelEditing} style={css.cancelLgBtn}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────── */
const css = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff,#f0fdf4)",
    display: "flex", justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "100%", maxWidth: 700,
    background: "#fff", borderRadius: 24,
    padding: "36px 40px",
    boxShadow: "0 12px 48px rgba(0,0,0,0.09)",
    height: "fit-content",
  },
  heading: { fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 28 },
  field: { marginBottom: 24 },
  label: { display: "block", fontWeight: 600, color: "#334155", marginBottom: 8 },
  input: {
    width: "100%", padding: "10px 14px",
    borderRadius: 10, border: "1.5px solid #cbd5e1",
    fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  dim: { color: "#94a3b8", textAlign: "center", padding: "18px 0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontWeight: 700, fontSize: 15, color: "#1e293b" },

  /* buttons */
  editBtn: { padding: "7px 16px", borderRadius: 8, border: "1.5px solid #3b82f6", background: "#eff6ff", color: "#3b82f6", fontWeight: 600, cursor: "pointer", fontSize: 13 },
  delAllBtn: { padding: "7px 16px", borderRadius: 8, border: "1.5px solid #ef4444", background: "#fff1f1", color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: 13 },
  cancelSmBtn: { padding: "6px 14px", borderRadius: 8, border: "1.5px solid #94a3b8", background: "#f8fafc", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 13 },
  xBtn: { width: 30, height: 30, borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  addFirstBtn: { padding: "10px 26px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#10b981,#3b82f6)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  addMoreBtn: { padding: "9px 18px", borderRadius: 9, border: "1.5px dashed #94a3b8", background: "transparent", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 4 },
  saveBtn: { flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#10b981,#3b82f6)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  cancelLgBtn: { flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 14 },

  /* view-mode range card */
  rangeCard: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
  timeText: { fontWeight: 700, color: "#1e293b", fontSize: 15 },
  arrow: { color: "#94a3b8", fontWeight: 700, fontSize: 18 },
  badge: { background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "3px 10px" },

  /* slots preview */
  slotsBox: { marginTop: 18, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "16px 18px" },
  slotsTitle: { fontWeight: 700, color: "#15803d", fontSize: 13, marginBottom: 10 },
  slotGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { background: "#fff", border: "1.5px solid #86efac", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#166534" },

  /* empty state */
  emptyBox: { textAlign: "center", padding: "28px 0", borderRadius: 16, background: "#f8fafc", border: "2px dashed #e2e8f0" },
  emptyMain: { fontSize: 15, color: "#334155", marginBottom: 4 },
  emptySub: { fontSize: 13, color: "#94a3b8", marginBottom: 20 },

  /* edit-mode */
  editCard: { background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", marginBottom: 12 },
  rangeLabel: { display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  selectRow: { display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" },
  colGroup: { display: "flex", flexDirection: "column", gap: 4 },
  miniLabel: { fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 },
  sel: { padding: "8px 10px", borderRadius: 9, border: "1.5px solid #cbd5e1", fontSize: 13, outline: "none", background: "#fff", cursor: "pointer" },

  /* toast */
  toast: { position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 22px", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" },


};