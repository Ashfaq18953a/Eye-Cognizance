import { Routes, Route } from "react-router-dom";
import UsersPage from "./UsersPage";
import Dashboard from "./Dashboard";
import AppointmentsPage from "./AppointmentsPage";
import PatientsPage from "./PatientsPage";
import PaymentsPage from "./PaymentsPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import LeavePage from "./LeavePage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />          {/* default /admin */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="patients" element={<PatientsPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="leave" element={<LeavePage />} />
    </Routes>
  );
}