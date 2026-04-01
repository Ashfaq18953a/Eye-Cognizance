import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 font-bold text-xl border-b">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink to="/admin/dashboard" label="Dashboard" active={location.pathname === "/admin/dashboard"} />
          <SidebarLink to="/admin/appointments" label="Appointments" active={location.pathname === "/admin/appointments"} />
          <SidebarLink to="/admin/patients" label="Patients" active={location.pathname === "/admin/patients"} />
          <SidebarLink to="/admin/users" label="Users" active={location.pathname === "/admin/users"} />
          <SidebarLink to="/admin/payments" label="Payments" active={location.pathname === "/admin/payments"} />
           <SidebarLink to="/admin/messages" label="Messages" active={location.pathname === "/admin/messages"} />
          <SidebarLink to="/admin/leave" label="🚫 Doctor Leave" active={location.pathname === "/admin/leave"} />
          {/* <SidebarLink to="/admin/analytics" label="Analytics" active={location.pathname === "/admin/analytics"} /> */}
          <SidebarLink to="/admin/settings" label="Settings" active={location.pathname === "/admin/settings"} />
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("loggedUser");
              window.location.href = "/Login";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* Renders the active page */}
      </main>
    </div>
  );
}

/* Sidebar Link */
function SidebarLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded hover:bg-gray-100 transition ${
        active ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
      }`}
    >
      {label}
    </Link>
  );
}