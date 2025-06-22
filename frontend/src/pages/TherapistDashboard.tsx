import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const therapist = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAppointment, setModalAppointment] = useState(null);

  useEffect(() => {
    if (!therapist) {
      navigate("/login");
    } else if (therapist.role === "user") {
      navigate("/user-dashboard");
    } else if (therapist.role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [therapist, navigate]);

  const fetchData = () => {
    setLoading(true);
    setError("");
    Promise.all([
      axios.get(
        `http://localhost:5000/api/appointments/therapist/${therapist.id}`
      ),
      axios.get(`http://localhost:5000/api/patients/therapist/${therapist.id}`),
    ])
      .then(([aRes, pRes]) => {
        setAppointments(aRes.data);
        setPatients(pRes.data);
      })
      .catch((err) => {
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (therapist && therapist.role === "therapist") fetchData();
    // eslint-disable-next-line
  }, [therapist]);

  // Accept/reject appointment
  const handleStatus = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, {
        status,
      });
      setSuccess(`Appointment ${status}.`);
      fetchData();
    } catch (err) {
      setError("Failed to update appointment status.");
    }
  };

  // Add/update notes/medication for an appointment
  const handleSaveNotes = async (appointmentId, notes, medication) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/notes`,
        { notes, medication }
      );
      setSuccess("Notes updated!");
      fetchData();
    } catch (err) {
      setError("Failed to update notes.");
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">
            MindWell - Therapist Portal
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">{therapist?.name}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 1000 }}>
        {loading && <div className="alert alert-info">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "appointments", label: "Appointments" },
            { id: "patients", label: "Patients" },
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

        <div
          className="card mb-4"
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
          }}
        >
          {/* Overview Tab: Next appointment */}
          {activeTab === "overview" && (
            <div className="card-header fw-bold">
              Pending Appointment Requests
            </div>
          )}
          <div className="card-body">
            {appointments.filter((a) => a.status === "pending").length === 0 ? (
              <div>No pending requests.</div>
            ) : (
              appointments
                .filter((a) => a.status === "pending")
                .map((a) => (
                  <div
                    key={a._id}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >
                    <div>
                      <div className="fw-semibold">
                        {a.user?.name} ({a.user?.email})
                      </div>
                      <div className="text-secondary small">
                        {new Date(a.date).toLocaleString()}
                      </div>
                      <div className="text-muted small">
                        Type: {a.type || "Video Call"}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatus(a._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleStatus(a._id, "rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setModalAppointment(a);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Appointments Tab: All appointments with notes/medication editing */}
        {activeTab === "appointments" && (
          <div
            className="card mb-4"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
              boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
            }}
          >
            <div className="card-header fw-bold">All Appointments</div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Medication</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No appointments found.
                      </td>
                    </tr>
                  )}
                  {appointments.map((a) => (
                    <tr key={a._id}>
                      <td>{new Date(a.date).toLocaleString()}</td>
                      <td>
                        {a.user?.name} ({a.user?.email})
                      </td>
                      <td>{a.type || "Video Call"}</td>
                      <td>{a.status}</td>
                      <td>
                        <textarea
                          defaultValue={a.notes || ""}
                          onBlur={(e) =>
                            handleSaveNotes(a._id, e.target.value, a.medication)
                          }
                          className="form-control"
                          rows={2}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={a.medication || ""}
                          onBlur={(e) =>
                            handleSaveNotes(a._id, a.notes, e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary mb-1"
                          onClick={() =>
                            handleSaveNotes(a._id, a.notes, a.medication)
                          }
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setModalAppointment(a);
                            setShowModal(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patients Tab: List of patients */}
        {activeTab === "patients" && (
          <div
            className="card mb-4"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
              boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
            }}
          >
            <div className="card-header fw-bold">My Patients</div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No patients found.
                      </td>
                    </tr>
                  )}
                  {patients.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.phone}</td>
                      <td>{p.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for appointment/session details and video call */}
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
                  background:
                    "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
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
                    <b>Patient:</b> {modalAppointment.user?.name} (
                    {modalAppointment.user?.email})
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {new Date(modalAppointment.date).toLocaleString()}
                  </p>
                  <p>
                    <b>Type:</b> {modalAppointment.type || "Video Call"}
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
                          fetchData();
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
    </div>
  );
};

export default TherapistDashboard;
