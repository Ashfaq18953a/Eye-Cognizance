import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

export default function PrescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [appt, setAppt] = useState(null);

  const [formData, setFormData] = useState({
    re_sph: "", re_cyl: "", re_axis: "", re_add: "", re_va: "",
    le_sph: "", le_cyl: "", le_axis: "", le_add: "", le_va: "",
    medicines: "",
    treatment_advised: "",
    doctor_notes: "",
    opticals_advised: ""
  });

  const medicinelists = {
    "Antibiotics": ["Vigamox", "Ciplox", "Tobrex", "Moxiflox", "Gatifloxacin"],
    "Steroids": ["Pred Forte", "Lotepred", "Fluorometholone", "Maxidex"],
    "Lubricants": ["Softdrops", "Refresh Tears", "Systane Ultra", "Eye Mist", "Tear Drops"],
    "Glaucoma": ["Bimat", "Travatan", "Timolol", "Alphagan", "Lumigan"],
    "Anti-Allergy": ["Olopat", "Patanol", "Bepreve", "Lastacaft"]
  };

  const treatmentlists = [
    "Cataract Surgery (Phaco)", "LASIK Eye Surgery", "PRP Laser Treatment",
    "Anti-VEGF Injection", "Keratoplasty", "Glaucoma Filtration Surgery",
    "Vision Therapy", "Squint Correction", "Eyelid Surgery", "Chalazion Removal"
  ];

  const opticallists = [
    "Single Vision", "Bifocal Lenses", "Progressive Lenses", "Blue Cut Lenses",
    "Anti-Glare (ARC)", "Photochromic", "Contact Lenses", "Cylindrical Lens"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apptRes = await api.get(`/api/admin/appointments/`); 
        const currentAppt = apptRes.data.find(a => a.id === parseInt(id));
        setAppt(currentAppt);

        const preRes = await api.get(`/api/admin/appointments/${id}/prescription/`);
        if (preRes.data && !preRes.data.error) {
          setFormData(preRes.data);
        }
      } catch (err) {
        console.error("Prescription load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post(`/api/admin/appointments/${id}/prescription/`, formData);
      if (response.data.success) {
        alert("✅ Prescription saved successfully!");
      }
    } catch (err) {
      alert("❌ Error saving prescription.");
    } finally {
      setSaving(false);
    }
  };

  const sendWhatsApp = () => {
    if (!appt || !appt.patient_mobile || appt.patient_mobile === "N/A") {
        alert("Patient mobile number not found.");
        return;
    }

    const text = `
📜 *EYE PRESCRIPTION* 📜
🏥 *Eye Cognizance Clinic*

*Patient:* ${appt.patient_name}
*Date:* ${new Date().toLocaleDateString()}

👁️ *VISION POWER*
----------------------
*Right Eye (RE):* SPH: ${formData.re_sph || '-'} | CYL: ${formData.re_cyl || '-'} | AXIS: ${formData.re_axis || '-'}
*Left Eye (LE):* SPH: ${formData.le_sph || '-'} | CYL: ${formData.le_cyl || '-'} | AXIS: ${formData.le_axis || '-'}

💊 *MEDICINES*
${formData.medicines || 'None'}

_Wishing you a speedy recovery!_
    `;

    const encodedText = encodeURIComponent(text.trim());
    window.open(`https://web.whatsapp.com/send?phone=${appt.patient_mobile}&text=${encodedText}`, "_blank");
  };

  const [showPrintMenu, setShowPrintMenu] = useState(false);

  const handlePrint = () => {
    setShowPrintMenu(false);
    window.print();
  };

  const appendToField = (field, value) => {
    setFormData(prev => ({
        ...prev,
        [field]: prev[field] ? prev[field] + "\n• " + value : "• " + value
    }));
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Clinical Dashboard...</div>;

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* MAIN UI (HIDDEN DURING PRINT) */}
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100 print:hidden">
        
        {/* Header */}
        <div className="bg-[#1e293b] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-xl">🩺</div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">Prescription Terminal</h1>
                <p className="text-blue-200 text-lg font-medium">{appt?.patient_name} <span className="opacity-30">|</span> {appt?.patient_email}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 relative">
                <div className="relative">
                  <button 
                    onClick={() => setShowPrintMenu(!showPrintMenu)} 
                    className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-sm font-black backdrop-blur-md transition-all border border-white/10 flex items-center gap-2"
                  >
                      <span>🖨️</span> Print & Share
                  </button>
                  {showPrintMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button onClick={handlePrint} className="w-full text-left px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 border-b border-gray-50 flex items-center gap-3">
                        <span className="text-lg">🖨️</span> Print Prescription
                      </button>
                      <button onClick={() => { setShowPrintMenu(false); sendWhatsApp(); }} className="w-full text-left px-5 py-4 text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-3">
                        <span className="text-lg">💬</span> Share to Patient
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => navigate(-1)} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-sm font-black transition-all">✕</button>
            </div>
        </div>

        <div className="p-10 space-y-12">
          
          {/* VISION POWER GRID */}
          <section className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-inner">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
              <span className="w-3 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></span> 
              Bilateral Eye Refraction
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-sm">
                <h3 className="font-black text-blue-900 tracking-widest uppercase italic mb-6 border-b border-blue-50 pb-4">Right Eye (OD)</h3>
                <div className="grid grid-cols-5 gap-4">
                  {['sph', 'cyl', 'axis', 'add', 'va'].map(f => (
                    <div key={f} className="space-y-2">
                      <label className="block text-[10px] font-black text-blue-400 uppercase">{f}</label>
                      <input type="text" value={formData[`re_${f}`]} onChange={e => setFormData({...formData, [`re_${f}`]: e.target.value})} className="w-full p-3 bg-blue-50/30 border border-blue-50 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 text-sm font-bold text-blue-900"/>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm">
                <h3 className="font-black text-emerald-900 tracking-widest uppercase italic mb-6 border-b border-emerald-50 pb-4">Left Eye (OS)</h3>
                <div className="grid grid-cols-5 gap-4">
                  {['sph', 'cyl', 'axis', 'add', 'va'].map(f => (
                    <div key={f} className="space-y-2">
                      <label className="block text-[10px] font-black text-emerald-400 uppercase">{f}</label>
                      <input type="text" value={formData[`le_${f}`]} onChange={e => setFormData({...formData, [`le_${f}`]: e.target.value})} className="w-full p-3 bg-emerald-50/30 border border-emerald-50 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 text-sm font-bold text-emerald-900"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* DRUGS & TREATMENT INTERACTIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
                <section className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                        <span className="w-3 h-10 bg-pink-600 rounded-full shadow-lg shadow-pink-200"></span> 
                        Rx Plan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                        {Object.entries(medicinelists).map(([category, items]) => (
                            <div key={category} className="space-y-3">
                                <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{category}</span>
                                <div className="flex flex-wrap gap-2">
                                    {items.map(m => (
                                        <button key={m} onClick={() => appendToField('medicines', m)} className="bg-slate-50 hover:bg-pink-50 px-3 py-2 text-[10px] font-black rounded-lg border border-slate-100 transition-all text-slate-500 hover:text-pink-600">
                                           + {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <textarea value={formData.medicines} onChange={e => setFormData({...formData, medicines: e.target.value})} className="w-full p-8 border border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-pink-50 h-72 font-mono text-sm leading-loose shadow-inner" placeholder="Detailed medicinal plan..."/>
                </section>
            </div>

            <div className="space-y-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">🩹 Treatment Advised</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {treatmentlists.map(t => (
                            <button key={t} onClick={() => appendToField('treatment_advised', t)} className="bg-orange-50 hover:bg-orange-600 hover:text-white p-2.5 text-[10px] font-black rounded-xl text-orange-700 transition-all border border-orange-100 shadow-sm">
                                {t}
                            </button>
                        ))}
                    </div>
                    <textarea value={formData.treatment_advised} onChange={e => setFormData({...formData, treatment_advised: e.target.value})} className="w-full p-6 bg-orange-50/30 border border-orange-100 rounded-3xl outline-none focus:ring-8 focus:ring-orange-50 h-40 text-sm font-bold text-orange-900" placeholder="Advised clinical procedures..."/>
                </section>

                <section className="space-y-4">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">👓 Optical Solutions</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {opticallists.map(o => (
                            <button key={o} onClick={() => appendToField('opticals_advised', o)} className="bg-indigo-50 hover:bg-indigo-600 hover:text-white p-2.5 text-[10px] font-black rounded-xl text-indigo-700 transition-all border border-indigo-100 shadow-sm">
                                {o}
                            </button>
                        ))}
                    </div>
                    <textarea value={formData.opticals_advised} onChange={e => setFormData({...formData, opticals_advised: e.target.value})} className="w-full p-6 bg-indigo-50/30 border border-indigo-100 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-50 h-40 text-sm font-bold text-indigo-900" placeholder="Recommend glasses..."/>
                </section>
            </div>
          </div>

          {/* ACTIONS FOOTER */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-10 -mx-10 -mb-10 gap-6 border-t border-slate-800 rounded-b-[2.5rem] shadow-2xl">
              <button 
                onClick={sendWhatsApp} 
                className="w-full md:w-auto bg-[#25D366] hover:bg-[#1DA851] text-white px-12 py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-4 transition-all shadow-xl shadow-green-900/20 active:scale-95"
              >
                <span className="text-2xl">💬</span> Send WhatsApp (Link + PDF)
              </button>

              <button 
                onClick={handleSave} 
                disabled={saving} 
                className={`w-full md:w-auto px-16 py-5 rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 flex items-center justify-center ${saving ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/5'}`}
              >
                {saving ? 'Processing Clinical Data...' : '💾 Finalize Prescription'}
              </button>
          </div>
        </div>
      </div>

      {/* PRINT TEMPLATE (HIDDEN UNLESS PRINTING) */}
      <div className="hidden print:block fixed inset-0 bg-white p-12 font-serif text-black overflow-hidden">
         <div className="text-center border-b-[8px] border-blue-900 pb-8 mb-10">
            <h1 className="text-5xl font-black text-blue-900 uppercase tracking-tighter mb-1">Eye Cognizance Clinic</h1>
            <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-[0.4em]">Advanced Ophthalmic Solution & Surgery Center</p>
            <p className="text-xs text-slate-400 mt-4 font-sans italic italic font-bold">123, Pearl Heights, Downtown Medical Park, New Delhi | +91 99887 76655</p>
         </div>

         <div className="grid grid-cols-2 gap-10 py-6 border-b border-slate-200 text-sm mb-10 font-sans">
            <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Patient Dashboard</span>
                <p className="text-xl font-black">{appt?.patient_name}</p>
                <p className="text-slate-500 mt-1">{appt?.patient_email}</p>
            </div>
            <div className="text-right">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Prescription ID</span>
                <p className="text-xl font-black">#PRE-{id}</p>
                <p className="text-slate-500 mt-1">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
         </div>

         <div className="mb-12">
            <h2 className="text-xs font-black uppercase mb-6 text-blue-900 flex items-center gap-3">
                <div className="w-1.5 h-4 bg-blue-900 rounded-full"></div> Bilateral Vision Examination
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-base text-center font-sans">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="border border-slate-300 p-4 font-black text-slate-500">OCULUS</th>
                        <th className="border border-slate-300 p-4 font-black text-blue-900">SPH</th>
                        <th className="border border-slate-300 p-4 font-black text-blue-900">CYL</th>
                        <th className="border border-slate-300 p-4 font-black text-blue-900">AXIS</th>
                        <th className="border border-slate-300 p-4 font-black text-blue-900">ADD</th>
                        <th className="border border-slate-300 p-4 font-black text-blue-900">VA</th>
                    </tr>
                </thead>
                <tbody className="font-bold">
                    <tr>
                        <td className="border border-slate-300 p-4 bg-slate-50 font-black text-xs uppercase">Right Eye (OD)</td>
                        <td className="border border-slate-300 p-4">{formData.re_sph || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.re_cyl || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.re_axis || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.re_add || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.re_va || '-'}</td>
                    </tr>
                    <tr>
                        <td className="border border-slate-300 p-4 bg-slate-50 font-black text-xs uppercase">Left Eye (OS)</td>
                        <td className="border border-slate-300 p-4">{formData.le_sph || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.le_cyl || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.le_axis || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.le_add || '-'}</td>
                        <td className="border border-slate-300 p-4">{formData.le_va || '-'}</td>
                    </tr>
                </tbody>
            </table>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
            <div>
                <h2 className="text-4xl font-serif font-black italic mb-6 text-blue-900">Rx</h2>
                <div className="pl-10 space-y-4">
                    <pre className="font-serif whitespace-pre-wrap text-lg leading-relaxed text-slate-800">
                        {formData.medicines || "Refer to clinical instructions."}
                    </pre>
                </div>
            </div>
            <div className="space-y-10">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Treatment Advised</h3>
                    <p className="text-base font-serif italic text-slate-700 leading-relaxed">{formData.treatment_advised || "Observation & Follow-up"}</p>
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Optical Prescription</h3>
                    <p className="text-base font-serif italic text-slate-700 leading-relaxed">{formData.opticals_advised || "No specialized optical gear required"}</p>
                </div>
            </div>
         </div>

         <div className="mt-32 pt-10 border-t-2 border-slate-100 flex justify-between items-end italic font-sans italic text-slate-400 text-xs">
            <div>
                <p className="font-bold uppercase text-slate-300 mb-2">Instructions</p>
                <p>• Avoid bright light for 2 hours post consultation.</p>
                <p>• Review prescription in 45 days.</p>
                <p>• Digital Audit-trail # {id}-{Date.now()}</p>
            </div>
            <div className="text-center font-sans not-italic">
                <p className="text-sm font-black text-slate-900">Dr. Maimunissa</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Chief Ophthalmic Surgeon</p>
                <p className="text-[8px] text-slate-400 mt-0.5">Registration No. #IND-123456</p>
            </div>
         </div>
      </div>
    </div>
  );
}
