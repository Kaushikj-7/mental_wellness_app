import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const UserDashboard = () => {
  console.log("UserDashboard component rendered");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalAppointment, setModalAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    console.log("User data from localStorage:", userData);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/login");
      }
    } else {
      console.log("No user data found in localStorage");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      if (user.role === "therapist") {
        navigate("/therapist-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }
    }
  }, [user, navigate]);

  // Fetch real appointments
  const fetchAppointments = () => {
    if (!user) return;
    setLoading(true);
    setError("");
    axios
      .get(API_ENDPOINTS.USER_APPOINTMENTS(user.id))
      .then((res) => {
        console.log("Appointments fetched:", res.data);
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments");
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    setRecentActivities(generateRecentActivities());
  }, [appointments, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user?.name || user?.username || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setEditMode(true);
    setProfileError("");
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Basic validation
    if (!editForm.name.trim()) {
      setProfileError("Name is required");
      return;
    }

    setProfileLoading(true);
    setProfileError("");

    try {
      const response = await axios.put(
        API_ENDPOINTS.USER_PROFILE(user.id),
        editForm
      );
      console.log("Profile updated:", response.data);

      // Update local user data
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Add profile update activity
      const newActivity = {
        id: `profile-update-${Date.now()}`,
        activity: "Updated profile information",
        time: "Just now",
        type: "profile",
        date: new Date(),
      };
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)]);

      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileError("");
  };

  const generateRecentActivities = () => {
    const activities = [];

    // Add appointment activities
    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const now = new Date();
      const timeDiff = now - date;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff <= 7) {
        // Show activities from last 7 days
        if (appointment.status === "completed") {
          activities.push({
            id: `appt-${appointment._id}`,
            activity: `Completed session with ${
              appointment.therapist?.name || appointment.therapist
            }`,
            time:
              daysDiff === 0
                ? "Today"
                : `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`,
            type: "appointment",
            date: date,
          });
        } else {
          activities.push({
            id: `appt-${appointment._id}`,
            activity: `Booked appointment with ${
              appointment.therapist?.name || appointment.therapist
            }`,
            time:
              daysDiff === 0
                ? "Today"
                : `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`,
            type: "appointment",
            date: date,
          });
        }
      }
    });

    // Add profile update activity if user has phone or address
    if (user?.phone || user?.address) {
      activities.push({
        id: "profile-update",
        activity: "Updated profile information",
        time: "Recently",
        type: "profile",
        date: new Date(),
      });
    }

    // Add welcome activity for new users
    if (user?.createdAt) {
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      const daysSinceCreated = Math.floor(
        (now - createdDate) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceCreated <= 7) {
        activities.push({
          id: "welcome",
          activity: "Joined MindWell platform",
          time:
            daysSinceCreated === 0
              ? "Today"
              : `${daysSinceCreated} day${daysSinceCreated > 1 ? "s" : ""} ago`,
          type: "welcome",
          date: createdDate,
        });
      }
    }

    // Sort by date (most recent first) and take top 5
    return activities.sort((a, b) => b.date - a.date).slice(0, 5);
  };

  // Find next appointment within 24 hours
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const soonAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    return apptDate > now && apptDate <= next24h;
  });

  if (!user) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Reminder banner */}
      {soonAppointments.length > 0 && (
        <div className="alert alert-warning text-center mb-3">
          <b>Reminder:</b> You have an upcoming appointment with{" "}
          {soonAppointments[0].therapist?.name || soonAppointments[0].therapist}{" "}
          on {new Date(soonAppointments[0].date).toLocaleDateString()} at{" "}
          {new Date(soonAppointments[0].date).toLocaleTimeString()}.
        </div>
      )}

      {/* Header */}
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">MindWell</span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">
              Welcome back, {user?.name || user?.username}!
            </span>
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
                <div className="fw-bold fs-2">
                  {appointments.filter((a) => a.status !== "completed").length}
                </div>
                <div className="text-secondary">Upcoming Sessions</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 text-center">
                <div className="fw-bold fs-2">
                  {appointments.filter((a) => a.status === "completed").length}
                </div>
                <div className="text-secondary">Completed Sessions</div>
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
            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
              All Appointments
              <button
                className={`btn btn-sm ${
                  showOnlyUpcoming ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
              >
                {showOnlyUpcoming ? "Show All" : "Show Upcoming Only"}
              </button>
            </div>
            <div className="card-body">
              {loading && <div>Loading appointments...</div>}
              {error && <div className="text-danger">{error}</div>}
              {!loading && !error && appointments.length === 0 && (
                <div>
                  No appointments found.{" "}
                  <button
                    className="btn btn-link"
                    onClick={() => navigate("/appointments")}
                  >
                    Book your first appointment
                  </button>
                </div>
              )}
              {appointments
                .filter(
                  (appointment) =>
                    !showOnlyUpcoming || appointment.status !== "completed"
                )
                .map((appointment) => (
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
                      <div className="text-primary small">
                        {appointment.type}
                      </div>
                      <div className="text-muted small">
                        Status:{" "}
                        <span
                          className={`badge ${
                            appointment.status === "completed"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`btn btn-sm ${
                        appointment.status === "completed"
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                      onClick={() => {
                        setModalAppointment(appointment);
                        setShowModal(true);
                      }}
                    >
                      {appointment.status === "completed"
                        ? "View Details"
                        : "Join Session"}
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
              {recentActivities.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <i className="fas fa-info-circle me-2"></i>
                  No recent activity. Start by booking an appointment or
                  updating your profile!
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="d-flex align-items-center border-bottom py-2"
                  >
                    <div className="me-3">
                      {activity.type === "appointment" && (
                        <i className="fas fa-calendar-check text-primary"></i>
                      )}
                      {activity.type === "profile" && (
                        <i className="fas fa-user-edit text-info"></i>
                      )}
                      {activity.type === "welcome" && (
                        <i className="fas fa-heart text-success"></i>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">
                        {activity.activity}
                      </div>
                      <div className="text-muted small">{activity.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">Your Appointments</div>
            <div className="card-body">
              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/appointments")}
                >
                  Book New Appointment
                </button>
              </div>
              {loading && <div>Loading appointments...</div>}
              {error && <div className="text-danger">{error}</div>}
              {!loading && !error && appointments.length === 0 && (
                <div>No appointments found.</div>
              )}
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
                    <div className="text-muted small">
                      Status:{" "}
                      <span
                        className={`badge ${
                          appointment.status === "completed"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`btn btn-sm ${
                      appointment.status === "completed"
                        ? "btn-success"
                        : "btn-primary"
                    }`}
                    onClick={() => {
                      setModalAppointment(appointment);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="card mb-4">
            <div className="card-header fw-bold">AI Wellness Assistant</div>
            <div className="card-body">
              <p className="text-secondary mb-3">
                Chat with our AI assistant for immediate mental health support
                and guidance.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/chat")}
              >
                Start Chat
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card mb-4">
            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
              Your Profile
              {!editMode && (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="card-body">
              {profileError && (
                <div className="alert alert-danger mb-3">{profileError}</div>
              )}
              <div className="row">
                <div className="col-md-6">
                  <h5>Personal Information</h5>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={user?.name || user?.username || ""}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user?.email || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    {editMode ? (
                      <input
                        type="tel"
                        className="form-control"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <input
                        type="tel"
                        className="form-control"
                        value={user?.phone || "Not provided"}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    {editMode ? (
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        placeholder="Enter your address"
                      />
                    ) : (
                      <textarea
                        className="form-control"
                        rows="3"
                        value={user?.address || "Not provided"}
                        readOnly
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <h5>Account Settings</h5>
                  <div className="mb-3">
                    <label className="form-label">Account Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.role || "User"}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Member Since</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Unknown"
                      }
                      readOnly
                    />
                  </div>
                  {editMode && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                      >
                        {profileLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={profileLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                {modalAppointment.status !== "completed" && (
                  <a
                    href={`https://meet.jit.si/wellness-app-${modalAppointment._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success mt-2"
                    style={{ background: "#43a047", borderColor: "#388e3c" }}
                  >
                    Join Video Call
                  </a>
                )}
                {modalAppointment.status === "completed" && (
                  <div className="alert alert-success mt-2">
                    <i className="fas fa-check-circle me-2"></i>
                    This session has been completed.
                  </div>
                )}
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
                          API_ENDPOINTS.APPOINTMENT_STATUS(
                            modalAppointment._id
                          ),
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
