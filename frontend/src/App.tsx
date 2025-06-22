import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import Chat from "./pages/Chat";
import Therapists from "./pages/Therapists";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./pages/Appointments";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <div
      className="nature-bg"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Router>
          <div className="container py-5">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route
                path="/therapist-dashboard"
                element={<TherapistDashboard />}
              />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/therapists" element={<Therapists />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
