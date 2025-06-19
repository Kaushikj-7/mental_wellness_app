import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate("/login");
  };

  const pendingAppointments = [
    {
      id: 1,
      patient: "John D.",
      date: "2024-06-22",
      time: "2:00 PM",
      reason: "Anxiety support",
    },
    {
      id: 2,
      patient: "Sarah M.",
      date: "2024-06-23",
      time: "10:00 AM",
      reason: "Depression counseling",
    },
  ];

  const todaySchedule = [
    {
      id: 1,
      patient: "Mike R.",
      time: "9:00 AM",
      type: "Initial consultation",
    },
    { id: 2, patient: "Emma K.", time: "11:00 AM", type: "Follow-up session" },
    { id: 3, patient: "David L.", time: "2:00 PM", type: "Group therapy" },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">
            MindWell - Therapist Portal
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">Dr. Sarah Johnson</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "appointments", label: "Appointments" },
            { id: "patients", label: "Patients" },
            { id: "schedule", label: "Schedule" },
          ].map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link${
                  activeTab === tab.id ? " active fw-bold text-primary" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="row g-4 mb-4">
            {/* Quick Stats */}
            <div className="col-md-3">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">28</div>
                <div className="text-secondary">Active Patients</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">3</div>
                <div className="text-secondary">Today's Sessions</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">2</div>
                <div className="text-secondary">Pending Requests</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">95%</div>
                <div className="text-secondary">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Appointment Requests */}
        {activeTab === "overview" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">
              Pending Appointment Requests
            </div>
            <div className="card-body">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <div className="fw-semibold">{appointment.patient}</div>
                    <div className="text-secondary small">
                      {appointment.date} at {appointment.time}
                    </div>
                    <div className="text-muted small">{appointment.reason}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm">Accept</button>
                    <button className="btn btn-outline-danger btn-sm">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        {activeTab === "overview" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">Today's Schedule</div>
            <div className="card-body">
              {todaySchedule.map((session) => (
                <div
                  key={session.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <div className="fw-semibold">{session.time}</div>
                    <div className="text-secondary small">
                      {session.patient} - {session.type}
                    </div>
                  </div>
                  <button className="btn btn-outline-primary btn-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
