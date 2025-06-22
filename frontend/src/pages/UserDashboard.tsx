import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalAppointment, setModalAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "therapist") {
      navigate("/therapist-dashboard");
    } else if (user.role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [user, navigate]);

  // Fetch real appointments
  const fetchAppointments = () => {
    if (!user) return;
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:5000/api/appointments/user/${user.id}`)
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [user]);

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

  // Find next appointment within 24 hours
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const soonAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    return apptDate > now && apptDate <= next24h;
  });

  return (
    <div className="min-vh-100 bg-light">
      {/* Reminder banner */}
      {soonAppointments.length > 0 && (
        <div className="alert alert-warning text-center mb-3">
          <b>Reminder:</b> You have an upcoming appointment with{" "}
          {soonAppointments[0].therapist} on {soonAppointments[0].date} at{" "}
          {soonAppointments[0].time}.
        </div>
      )}

      {/* Header */}
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">MindWell</span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">Welcome back, {user?.name}!</span>
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
              {appointments.length === 0 && <div>No appointments found.</div>}
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <div className="fw-semibold">
                      {appointment.therapist?.name || appointment.therapist}
                    </div>
                    <div className="text-secondary small">
                      {new Date(appointment.date).toLocaleString()}
                    </div>
                    <div className="text-primary small">{appointment.type}</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setModalAppointment(appointment);
                      setShowModal(true);
                    }}
                  >
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

      {showModal && modalAppointment && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
                boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
              }}
            >
              <div
                className="modal-header"
                style={{
                  background: "#b2dfdb",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <h5 className="modal-title" style={{ color: "#00695c" }}>
                  Session Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <b>Therapist:</b>{" "}
                  {modalAppointment.therapist?.name ||
                    modalAppointment.therapist}
                </p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(modalAppointment.date).toLocaleString()}
                </p>
                <p>
                  <b>Type:</b> {modalAppointment.type}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        modalAppointment.status === "completed"
                          ? "#388e3c"
                          : "#fbc02d",
                    }}
                  >
                    {modalAppointment.status}
                  </span>
                </p>
                <a
                  href={`https://meet.jit.si/wellness-app-${modalAppointment._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success mt-2"
                  style={{ background: "#43a047", borderColor: "#388e3c" }}
                >
                  Join Video Call
                </a>
              </div>
              <div
                className="modal-footer"
                style={{
                  background: "#e0f2f1",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              >
                {modalAppointment.status !== "completed" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: "#388e3c", borderColor: "#2e7d32" }}
                    onClick={async () => {
                      try {
                        await axios.put(
                          `http://localhost:5000/api/appointments/${modalAppointment._id}/status`,
                          { status: "completed" }
                        );
                        setModalAppointment({
                          ...modalAppointment,
                          status: "completed",
                        });
                        // Optionally, refresh appointments list
                        fetchAppointments();
                      } catch (err) {
                        alert("Failed to update status.");
                      }
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
