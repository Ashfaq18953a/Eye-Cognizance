import { useState, useEffect } from "react";
import api from "./api";
import InvoiceModal from "./components/InvoiceModal";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("all"); 
  
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [fetchingInvoice, setFetchingInvoice] = useState(false);

  const fetchInvoice = (id) => {
    setFetchingInvoice(true);
    api.get(`/api/admin/payments/${id}/invoice/`)
      .then(res => {
        setSelectedInvoice(res.data);
        setIsInvoiceOpen(true);
      })
      .catch(err => {
        console.error("Error fetching invoice:", err);
        alert("Failed to load invoice details.");
      })
      .finally(() => setFetchingInvoice(false));
  };

  useEffect(() => {
    setLoading(true);
    const url = selectedDate === "all"
      ? "/api/admin/payments/?date=all"
      : `/api/admin/payments/?date=${selectedDate}`;

    api.get(url)
      .then(res => setPayments(res.data))
      .catch(err => {
        console.error("Error fetching payments:", err);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">💰 Payments</h1>
            <p className="text-gray-500 mt-1">Monitor all patient transactions and payment statuses.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg shadow-sm border p-1">
              <button
                onClick={() => setSelectedDate("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${selectedDate === "all" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
              >All Time</button>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${selectedDate !== "all" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
              >By Date</button>
            </div>

            {selectedDate !== "all" && (
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-white border text-sm px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading transaction records...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-5xl mb-4 block">🏜️</span>
              <h3 className="text-lg font-bold text-gray-800">No payments found</h3>
              <p className="text-gray-500">There are no records for the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(payment => (
                    <tr key={payment.appointment_id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{payment.patient}</span>
                          <span className="text-xs text-gray-500">{payment.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{payment.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${payment.paid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                          {payment.paid ? "● PAID" : "○ PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-700 font-medium">{new Date(payment.date).toLocaleDateString()}</span>
                          <span className="text-gray-400 text-xs">{new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => fetchInvoice(payment.appointment_id)}
                          disabled={fetchingInvoice}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-100 flex items-center gap-1.5"
                        >
                          {fetchingInvoice ? (
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <span>📄</span>
                          )}
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InvoiceModal 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
        invoiceData={selectedInvoice} 
      />
    </div>
  );
}