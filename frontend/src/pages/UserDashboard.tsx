import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate("/login");
  };

  const upcomingAppointments = [
    {
      id: 1,
      therapist: "Dr. Sarah Johnson",
      date: "2024-06-22",
      time: "2:00 PM",
      type: "Video Call",
    },
    {
      id: 2,
      therapist: "Dr. Michael Chen",
      date: "2024-06-25",
      time: "10:00 AM",
      type: "In-Person",
    },
  ];

  const recentActivities = [
    { id: 1, activity: "Completed mood check-in", time: "2 hours ago" },
    { id: 2, activity: "Chatted with AI Assistant", time: "1 day ago" },
    {
      id: 3,
      activity: "Booked appointment with Dr. Johnson",
      time: "3 days ago",
    },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">MindWell</span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">Welcome back, John!</span>
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
            { id: "chat", label: "AI Assistant" },
            { id: "profile", label: "Profile" },
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
            <div className="col-md-4">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">2</div>
                <div className="text-secondary">Upcoming Sessions</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">12</div>
                <div className="text-secondary">AI Conversations</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">7</div>
                <div className="text-secondary">Days Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        {activeTab === "overview" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">Upcoming Appointments</div>
            <div className="card-body">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <div className="fw-semibold">{appointment.therapist}</div>
                    <div className="text-secondary small">
                      {appointment.date} at {appointment.time}
                    </div>
                    <div className="text-primary small">{appointment.type}</div>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    Join Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {activeTab === "overview" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">Recent Activity</div>
            <div className="card-body">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="d-flex align-items-center border-bottom py-2"
                >
                  <div>
                    <div className="text-secondary small">
                      {activity.activity}
                    </div>
                    <div className="text-muted small">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {activeTab === "appointments" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">Book New Appointment</div>
            <div className="card-body">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/appointments")}
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">AI Wellness Assistant</div>
            <div className="card-body">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/chat")}
              >
                Start Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
