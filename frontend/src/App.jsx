import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Pages/AdminLayout";

// USER PAGES
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Forgot from "./Pages/Forgot";
import ResetPassword from "./Pages/ResetPassword";
import About from "./Pages/About";
import Appointment from "./Pages/Appointment";
import AppointmentDetails from "./Pages/AppointmentDtails";
import SelectDateTime from "./Pages/SelectDateTime";
import Testimonial from "./Pages/Testimonial";
import Contact from "./Pages/Contact";
import Consultation from "./Pages/Consultation";
import ConsultationDetails from "./Pages/ConsultationDetails";
import ConsultComplete from "./Pages/CounsultComplete";
import Blog from "./Pages/Blog";
import Status from "./Pages/Status";
import PersonalData from "./Pages/PersonalData";
import Account from "./Pages/Account";
import Payment from "./Pages/Payment";
import Confirmation from "./Pages/Confirmation";
import BlogInner from "./Pages/BlogInner";
import ProfilePage from "./Pages/ProfilePage";
import UsersPage from "./Pages/UsersPage";

// ADMIN PAGES
import Dashboard from "./Pages/Dashboard";
import AppointmentsPage from "./Pages/AppointmentsPage";
import PrescriptionPage from "./Pages/PrescriptionPage";
import PatientsPage from "./Pages/PatientsPage";
import PaymentsPage from "./Pages/PaymentsPage";
import AdminMessages from "./Pages/AdminMessages";
import SettingsPage from "./Pages/SettingsPage";
import LeavePage from "./Pages/LeavePage";
import RescheduleOrRefund from "./Pages/RescheduleOrRefund";

/* ===============================
   🔐 ADMIN ROUTE GUARD
================================ */
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/login" replace />;
};

/* ===============================
   APP COMPONENT
================================ */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/about" element={<About />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointmentdetails" element={<AppointmentDetails />} />
          <Route path="/selectDateTime" element={<SelectDateTime />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/consultationdetails/:id" element={<ConsultationDetails />} />
          <Route path="/consultcomplete" element={<ConsultComplete />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/status" element={<Status />} />
          <Route path="/personaldata" element={<PersonalData />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/bloginner" element={<BlogInner />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reschedule-or-refund/:id" element={<RescheduleOrRefund />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Nested admin routes */}
          <Route index element={<Dashboard />} /> {/* default dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:id/prescription" element={<PrescriptionPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}