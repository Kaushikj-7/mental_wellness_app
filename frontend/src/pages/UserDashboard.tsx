import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserMd,
  FaCalendarAlt,
  FaComments,
  FaCheckCircle,
  FaClock,
  FaUserCircle,
  FaSmile,
  FaRegSmile,
  FaMeh,
  FaFrown,
  FaRegFrown,
  FaRegGrinHearts,
} from "react-icons/fa";
import PlantSVG from "../components/PlantSVG";

const pastelGradient = {
  background: "linear-gradient(135deg, #f8f9e9 0%, #e6f6f3 100%)",
  minHeight: "100vh",
  paddingBottom: 40,
};

const moodOptions = [
  { label: "Love", icon: <FaRegGrinHearts color="#7bc47f" size={28} /> },
  { label: "Happy", icon: <FaSmile color="#ffe066" size={28} /> },
  { label: "Sad", icon: <FaFrown color="#6c757d" size={28} /> },
  { label: "Depress", icon: <FaRegFrown color="#adb5bd" size={28} /> },
  { label: "Worried", icon: <FaMeh color="#f6c23e" size={28} /> },
  { label: "Content", icon: <FaRegSmile color="#7bc47f" size={28} /> },
];

const dailyQuotes = [
  "You're doing great. Every step counts!",
  "Breathe in calm, breathe out stress.",
  "You are enough, just as you are.",
  "Today is a new beginning.",
  "Small progress is still progress.",
  "Be kind to yourself today.",
];

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
  const [chatCount, setChatCount] = useState(0);
  const [selectedMood, setSelectedMood] = useState(
    () => localStorage.getItem("mood") || null
  );
  const [showMoodSuccess, setShowMoodSuccess] = useState(false);
  const [quote, setQuote] = useState("");

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
      .get(`http://localhost:5000/api/appointments/user/${user.id}`)
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

  // Fetch chat history for AI Conversations count
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/chat/history/${user.id}`)
        .then((res) => {
          if (res.data.messages) {
            // Only count user messages
            setChatCount(
              res.data.messages.filter((m) => m.sender === "user").length
            );
          } else {
            setChatCount(0);
          }
        })
        .catch(() => setChatCount(0));
    }
  }, [user]);

  useEffect(() => {
    setQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
  }, []);

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
        `http://localhost:5000/api/users/${user.id}`,
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

  // Calculate days streak (consecutive days with at least one appointment)
  const calculateStreak = () => {
    if (!appointments.length) return 0;
    // Get all unique appointment dates (YYYY-MM-DD)
    const dates = Array.from(
      new Set(
        appointments.map((a) => new Date(a.date).toISOString().slice(0, 10))
      )
    )
      .sort()
      .reverse();
    if (!dates.length) return 0;
    let streak = 1;
    let prev = new Date(dates[0]);
    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
    return streak;
  };

  // Find next appointment within 24 hours
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const soonAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    return apptDate > now && apptDate <= next24h;
  });

  const handleMoodSelect = (idx) => {
    setSelectedMood(idx);
    localStorage.setItem("mood", idx);
    setShowMoodSuccess(true);
    setTimeout(() => setShowMoodSuccess(false), 1200);
  };

  const NatureBackground = () => (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        opacity: 0.18,
      }}
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="200" cy="200" rx="180" ry="80" fill="#c8e6c9" />
      <ellipse cx="1300" cy="700" rx="200" ry="100" fill="#a5d6a7" />
      <ellipse cx="900" cy="200" rx="120" ry="60" fill="#e6f6e3" />
      <ellipse cx="400" cy="800" rx="160" ry="60" fill="#b2dfdb" />
      <path
        d="M300 300 Q350 250 400 300 Q450 350 500 300"
        stroke="#81c784"
        strokeWidth="8"
        fill="none"
      />
      <path
        d="M1200 800 Q1250 750 1300 800 Q1350 850 1400 800"
        stroke="#388e3c"
        strokeWidth="8"
        fill="none"
      />
    </svg>
  );

  if (!user) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="nature-bg" style={pastelGradient}>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 40,
          paddingBottom: 40,
        }}
      >
        {/* Header with avatar, greeting, and plant illustration */}
        <nav
          className="navbar navbar-light bg-white shadow-sm rounded mb-4 px-4 d-flex align-items-center"
          style={{
            borderRadius: 24,
            margin: 24,
            marginBottom: 32,
            background: "#e6f6e3",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-success d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48 }}
            >
              <FaUserCircle color="#fff" size={32} />
            </div>
            <div>
              <div
                className="fw-bold fs-4"
                style={{
                  fontFamily: "Quicksand, Nunito, sans-serif",
                  color: "#388e3c",
                }}
              >
                Good day, {user?.name || user?.username || "Friend"}!
              </div>
              <div className="text-muted" style={{ fontSize: 16 }}>
                We're glad you're here 🌿
              </div>
            </div>
            <div className="ms-4">
              <PlantSVG width={60} height={60} />
            </div>
          </div>
          <button
            className="btn btn-outline-success btn-sm ms-auto"
            onClick={handleLogout}
            style={{ borderRadius: 20 }}
          >
            Logout
          </button>
        </nav>

        <div className="container-lg" style={{ maxWidth: 900 }}>
          {/* Daily Reflection Card - now just a positive quote, no input */}
          <div
            className="card mb-4 shadow-sm border-0 rounded-4 p-4"
            style={{ background: "#e6f6e3", borderRadius: 32 }}
          >
            <div className="d-flex align-items-center gap-3 mb-2">
              <span style={{ fontSize: 28, color: "#388e3c" }}>🌱</span>
              <span
                className="fw-bold fs-4"
                style={{ fontFamily: "Quicksand, Nunito, sans-serif" }}
              >
                Daily Reflection
              </span>
            </div>
            <div className="mb-2" style={{ fontSize: 20, color: "#388e3c" }}>
              {quote}
            </div>
          </div>

          {/* Daily Mood Log */}
          <div
            className="card mb-4 shadow-sm border-0 rounded-4 p-4"
            style={{ background: "#f0fbe8", borderRadius: 32 }}
          >
            <div
              className="fw-bold fs-5 mb-3"
              style={{
                fontFamily: "Quicksand, Nunito, sans-serif",
                color: "#388e3c",
              }}
            >
              Daily Mood Log
            </div>
            <div className="d-flex gap-4 mb-2">
              {moodOptions.map((mood, idx) => (
                <button
                  key={mood.label}
                  className={`btn btn-light d-flex flex-column align-items-center justify-content-center p-2 ${
                    selectedMood == idx
                      ? "border border-success shadow bg-success bg-opacity-10"
                      : ""
                  }`}
                  style={{
                    borderRadius: 20,
                    minWidth: 60,
                    background: selectedMood == idx ? "#e6f6e3" : "#fff",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleMoodSelect(idx)}
                >
                  {mood.icon}
                  <span
                    style={{ fontSize: 13, color: "#388e3c", marginTop: 2 }}
                  >
                    {mood.label}
                  </span>
                  {selectedMood == idx && (
                    <span style={{ fontSize: 18, color: "#388e3c" }}>✔️</span>
                  )}
                </button>
              ))}
            </div>
            {showMoodSuccess && (
              <div className="text-success mt-2">Mood logged! 😊</div>
            )}
          </div>

          {/* Main Dashboard Content (stats, appointments, etc.) */}
          <div className="container-lg">
            {/* Navigation Tabs */}
            <ul className="nav nav-tabs mb-4 shadow-sm rounded overflow-hidden">
              {[
                { id: "overview", label: "Overview", icon: <FaCalendarAlt /> },
                {
                  id: "appointments",
                  label: "Appointments",
                  icon: <FaUserMd />,
                },
                { id: "chat", label: "AI Assistant", icon: <FaComments /> },
                { id: "profile", label: "Profile", icon: <FaUserCircle /> },
              ].map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link px-4 py-2${
                      activeTab === tab.id
                        ? " active fw-bold text-primary bg-white border-bottom-0"
                        : " bg-light border-0"
                    }`}
                    style={{ fontSize: "1.1rem" }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="me-2">{tab.icon}</span>
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
                  <div className="card shadow-lg border-0 p-4 text-center rounded-4 h-100">
                    <div className="mb-2 text-primary">
                      <FaCalendarAlt size={32} />
                    </div>
                    <div className="fw-bold fs-1">
                      {
                        appointments.filter((a) => a.status !== "completed")
                          .length
                      }
                    </div>
                    <div className="text-secondary">Upcoming Sessions</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-lg border-0 p-4 text-center rounded-4 h-100">
                    <div className="mb-2 text-info">
                      <FaComments size={32} />
                    </div>
                    <div className="fw-bold fs-1">{chatCount}</div>
                    <div className="text-secondary">AI Conversations</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-lg border-0 p-4 text-center rounded-4 h-100">
                    <div className="mb-2 text-success">
                      <FaClock size={32} />
                    </div>
                    <div className="fw-bold fs-1">{calculateStreak()}</div>
                    <div className="text-secondary">Days Streak</div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments List (Overview) */}
            {activeTab === "overview" && (
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center rounded-top-4">
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
                    <div className="text-center text-muted py-3">
                      No appointments found.{" "}
                      <button
                        className="btn btn-link"
                        onClick={() => navigate("/appointments")}
                      >
                        Book your first appointment
                      </button>
                    </div>
                  )}
                  <div className="list-group list-group-flush">
                    {appointments
                      .filter(
                        (appointment) =>
                          !showOnlyUpcoming ||
                          appointment.status !== "completed"
                      )
                      .map((appointment) => (
                        <div
                          key={appointment._id}
                          className="list-group-item d-flex align-items-center justify-content-between py-3 px-2 bg-light rounded-3 mb-2 shadow-sm border-0"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 48, height: 48, fontSize: 24 }}
                            >
                              <FaUserMd />
                            </div>
                            <div>
                              <div className="fw-semibold fs-5">
                                {appointment.therapist?.name ||
                                  appointment.therapist}
                              </div>
                              <div className="text-secondary small">
                                {new Date(appointment.date).toLocaleString()}
                              </div>
                              <div className="text-primary small">
                                {appointment.type}
                              </div>
                              <span
                                className={`badge rounded-pill px-3 py-1 ${
                                  appointment.status === "completed"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          <button
                            className={`btn btn-${
                              appointment.status === "completed"
                                ? "success"
                                : "primary"
                            } btn-sm px-4 rounded-pill shadow`}
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
              </div>
            )}

            {/* Recent Activity */}
            {activeTab === "overview" && (
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white fw-bold rounded-top-4">
                  Recent Activity
                </div>
                <div className="card-body">
                  {recentActivities.length === 0 ? (
                    <div className="text-center text-muted py-3">
                      <FaClock className="me-2" />
                      No recent activity. Start by booking an appointment or
                      updating your profile!
                    </div>
                  ) : (
                    recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="d-flex align-items-center border-bottom py-2 gap-3"
                      >
                        <div className="me-3">
                          {activity.type === "appointment" && (
                            <FaCalendarAlt className="text-primary" />
                          )}
                          {activity.type === "profile" && (
                            <FaUserCircle className="text-info" />
                          )}
                          {activity.type === "welcome" && (
                            <FaCheckCircle className="text-success" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">
                            {activity.activity}
                          </div>
                          <div className="text-muted small">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-header bg-white fw-bold rounded-top-4">
                  Your Appointments
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <button
                      className="btn btn-primary rounded-pill px-4 shadow"
                      onClick={() => navigate("/appointments")}
                    >
                      Book New Appointment
                    </button>
                  </div>
                  {loading && <div>Loading appointments...</div>}
                  {error && <div className="text-danger">{error}</div>}
                  {!loading && !error && appointments.length === 0 && (
                    <div className="text-center text-muted py-3">
                      No appointments found.
                    </div>
                  )}
                  <div className="list-group list-group-flush">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="list-group-item d-flex align-items-center justify-content-between py-3 px-2 bg-light rounded-3 mb-2 shadow-sm border-0"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 48, height: 48, fontSize: 24 }}
                          >
                            <FaUserMd />
                          </div>
                          <div>
                            <div className="fw-semibold fs-5">
                              {appointment.therapist?.name ||
                                appointment.therapist}
                            </div>
                            <div className="text-secondary small">
                              {new Date(appointment.date).toLocaleString()}
                            </div>
                            <div className="text-primary small">
                              {appointment.type}
                            </div>
                            <span
                              className={`badge rounded-pill px-3 py-1 ${
                                appointment.status === "completed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                        <button
                          className={`btn btn-${
                            appointment.status === "completed"
                              ? "success"
                              : "primary"
                          } btn-sm px-4 rounded-pill shadow`}
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
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-header bg-white fw-bold rounded-top-4">
                  AI Wellness Assistant
                </div>
                <div className="card-body text-center">
                  <p className="text-secondary mb-3 fs-5">
                    <FaComments className="me-2 text-primary" />
                    Chat with our AI assistant for immediate mental health
                    support and guidance.
                  </p>
                  <button
                    className="btn btn-primary rounded-pill px-4 shadow"
                    onClick={() => navigate("/chat")}
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-header bg-white fw-bold rounded-top-4 d-flex justify-content-between align-items-center">
                  Your Profile
                  {!editMode && (
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill px-4"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {profileError && (
                    <div className="alert alert-danger mb-3">
                      {profileError}
                    </div>
                  )}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">Personal Information</h5>
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
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
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
                              setEditForm({
                                ...editForm,
                                address: e.target.value,
                              })
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
                      <h5 className="fw-bold mb-3">Account Settings</h5>
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
                            className="btn btn-primary rounded-pill px-4"
                            onClick={handleSaveProfile}
                            disabled={profileLoading}
                          >
                            {profileLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            className="btn btn-secondary rounded-pill px-4"
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

            {/* Appointment Modal */}
            {showModal && modalAppointment && (
              <div
                className="modal show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content rounded-4 shadow-lg">
                    <div className="modal-header bg-primary text-white rounded-top-4">
                      <h5 className="modal-title">
                        <FaCalendarAlt className="me-2" />
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
                          className={`badge rounded-pill px-3 py-1 ${
                            modalAppointment.status === "completed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {modalAppointment.status}
                        </span>
                      </p>
                      {modalAppointment.status !== "completed" && (
                        <a
                          href={`https://meet.jit.si/wellness-app-${modalAppointment._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success mt-2 rounded-pill px-4 shadow"
                        >
                          Join Video Call
                        </a>
                      )}
                      {modalAppointment.status === "completed" && (
                        <div className="alert alert-success mt-2 rounded-3">
                          <FaCheckCircle className="me-2" />
                          This session has been completed.
                        </div>
                      )}
                    </div>
                    <div className="modal-footer bg-light rounded-bottom-4">
                      {modalAppointment.status !== "completed" && (
                        <button
                          type="button"
                          className="btn btn-primary rounded-pill px-4"
                          style={{
                            background: "#388e3c",
                            borderColor: "#2e7d32",
                          }}
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
                        className="btn btn-secondary rounded-pill px-4"
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
