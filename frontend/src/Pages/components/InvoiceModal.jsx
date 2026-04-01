import React from 'react';

export default function InvoiceModal({ isOpen, onClose, invoiceData }) {
  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:shadow-none print:max-w-full print:m-0 print:rounded-none">
        
        {/* Header (Hidden on Print) */}
        <div className="p-6 border-b flex items-center justify-between bg-gray-50 print:hidden">
          <h2 className="text-xl font-bold text-gray-800">Payment Invoice</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
            >
              <span>🖨️</span> Print Invoice
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-8 md:p-12 overflow-y-auto flex-1 print:overflow-visible">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-green-700 tracking-tighter uppercase line-through decoration-amber-400 decoration-4">
                EYE COGNIZANCE
              </h1>
              <div className="text-sm text-gray-500 font-medium max-w-xs">
                <p>{invoiceData.hospital_address}</p>
                <p>Contact: {invoiceData.hospital_contact}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-4xl font-black text-gray-900 mb-2">INVOICE</h2>
              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">#{invoiceData.invoice_no}</p>
              <p className="text-gray-400 text-xs font-semibold">{invoiceData.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-gray-100">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Bill To</p>
              <h3 className="text-lg font-bold text-gray-900">{invoiceData.patient_name}</h3>
              <p className="text-gray-600 text-sm">{invoiceData.patient_email}</p>
              <p className="text-gray-600 text-sm">{invoiceData.patient_mobile}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Appointment Info</p>
              <p className="font-bold text-gray-800">{invoiceData.consultation_type} Consultation</p>
              <p className="text-gray-600 text-sm">{invoiceData.appointment_date}</p>
              <p className="text-gray-600 text-sm font-medium bg-gray-50 inline-block px-2 py-0.5 rounded ml-auto mt-1">{invoiceData.appointment_time}</p>
            </div>
          </div>

          <table className="w-full mb-12 text-sm">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-4 text-left font-black uppercase tracking-widest text-[11px] text-gray-400">Description</th>
                <th className="py-4 text-right font-black uppercase tracking-widest text-[11px] text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-6">
                  <p className="font-bold text-gray-900">{invoiceData.consultation_type} Consultation Fee</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">Professional medical consultation service including screening and diagnosis.</p>
                </td>
                <td className="py-6 text-right font-black text-gray-900 text-lg">
                  ₹{invoiceData.amount}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col items-end gap-4 mb-16">
             <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span>₹{invoiceData.amount}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Tax (0%)</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                  <span className="text-xl font-black text-gray-900 uppercase italic">Total</span>
                  <span className="text-2xl font-black text-green-700">₹{invoiceData.amount}</span>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-dashed border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-3">
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
                  invoiceData.payment_status?.toUpperCase() === 'PAID' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
                }`}>
                  PAYMENT {invoiceData.payment_status?.toUpperCase()}
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">
                  Razorpay ID: {invoiceData.razorpay_payment_id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Authorized Signatory</p>
                <div className="h-10 w-48 border-b-2 border-gray-900 mt-2 opacity-[0.03]"></div>
                <p className="text-[9px] text-gray-400 mt-2 font-bold tracking-widest uppercase">Eye Cognizance Clinic</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-gray-300 text-[9px] font-bold uppercase tracking-[0.4em] print:mt-10">
            Vision is our mission. Thank you for trusting us.
          </div>
        </div>
      </div>
    </div>
  );
}
