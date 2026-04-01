import { useEffect, useState } from "react";
import api from "./api"; // Axios instance

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" or "logged_in"

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile?.includes(searchTerm);
    if (!matchesSearch) return false;

    if (activeTab === "logged_in") {
      if (!u.last_login) return false;
      const lastLogin = new Date(u.last_login);
      const now = new Date();
      const hoursDiff = (now - lastLogin) / (1000 * 60 * 60);
      return hoursDiff < 24; // Logged in within 24 hours
    }

    return true;
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#2C3E1F] tracking-tight">User Management</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Showing {filteredUsers.length} accounts {activeTab === "logged_in" && "(Logged In)"}
            </p>
          </div>

          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#35A114] focus:bg-white transition-all shadow-inner"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-20">🔍</span>
            </div>
          </div>
        </div>

        {/* --- Tabs --- */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-100 pb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "all"
                ? "bg-[#2C3E1F] text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("logged_in")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "logged_in"
                ? "bg-[#35A114] text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            Logged In Users (Last 24h)
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#35A114] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Loading Accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-black italic">No user accounts found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-50 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">
                  <th className="px-6 py-5">Global UID</th>
                  <th className="px-6 py-5">Account Details</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5">Registered On</th>
                  <th className="px-6 py-5">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-green-50/50 transition-colors">
                    <td className="px-6 py-6 font-mono text-[10px] font-black text-gray-400">#USE-{user.id + 5000}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${user.is_admin ? 'bg-[#2C3E1F]' : 'bg-[#35A114]'}`}>
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#2C3E1F] text-lg leading-tight">{user.username}</p>
                          <p className="text-sm text-gray-400 lowercase">{user.email}</p>
                          <p className="text-[10px] font-black text-[#35A114] mt-1 tabular-nums">{user.mobile || "NO MOBILE"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      {user.is_admin ? (
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#2C3E1F] text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/10 ring-4 ring-gray-100">ADMIN</span>
                      ) : (
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-widest shadow-sm">PATIENT</span>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-black text-[#2C3E1F] italic">{new Date(user.date_joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">{new Date(user.date_joined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-6">
                      {user.last_login ? (
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter opacity-60">
                          {new Date(user.last_login).toLocaleDateString("en-IN", {
                             day: "2-digit", month: "short", year: "numeric",
                             hour: "2-digit", minute: "2-digit", hour12: true
                          })}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-200 uppercase tracking-widest italic">NEVER ACTIVE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
