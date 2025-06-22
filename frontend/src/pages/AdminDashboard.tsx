import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTherapist, setNewTherapist] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    address: "",
    availability: [{ day: "Monday", start: "09:00", end: "17:00" }],
  });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch therapists
  const fetchTherapists = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/therapists")
      .then((res) => setTherapists(res.data))
      .catch(() => setTherapists([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (activeTab === "therapists") fetchTherapists();
  }, [activeTab]);

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  // Fetch appointments
  const fetchAppointments = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (activeTab === "appointments") fetchAppointments();
  }, [activeTab]);

  // Add therapist
  const handleAddTherapist = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/admin/therapists",
        newTherapist
      );
      setSuccess("Therapist added!");
      setShowAdd(false);
      setNewTherapist({
        name: "",
        email: "",
        password: "",
        specialization: "",
        phone: "",
        address: "",
        availability: [{ day: "Monday", start: "09:00", end: "17:00" }],
      });
      fetchTherapists();
    } catch (err) {
      setError("Failed to add therapist.");
    } finally {
      setLoading(false);
    }
  };

  // Delete therapist
  const handleDeleteTherapist = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/therapists/${id}`);
      setSuccess("Therapist deleted.");
      fetchTherapists();
    } catch (err) {
      setError("Failed to delete therapist.");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setSuccess("User deleted.");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Add availability slot
  const addSlot = () => {
    setNewTherapist((t) => ({
      ...t,
      availability: [
        ...t.availability,
        { day: "Monday", start: "09:00", end: "17:00" },
      ],
    }));
  };
  // Remove availability slot
  const removeSlot = (idx) => {
    setNewTherapist((t) => ({
      ...t,
      availability: t.availability.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold text-primary">
            MindWell - Admin Panel
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">{user?.name}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <ul className="nav nav-tabs mb-4">
          {[
            { id: "users", label: "Users" },
            { id: "therapists", label: "Therapists" },
            { id: "appointments", label: "Appointments" },
            { id: "chatbot", label: "Chatbot Usage" },
            { id: "reports", label: "Reports" },
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
          className="card"
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
          }}
        >
          <div className="card-body">
            {activeTab === "therapists" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Therapists</h5>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAdd(true)}
                  >
                    Add Therapist
                  </button>
                </div>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}
                {loading && <div>Loading...</div>}
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {therapists.map((t) => (
                      <tr key={t._id}>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                        <td>{t.specialization}</td>
                        <td>{t.phone}</td>
                        <td>{t.address}</td>
                        <td>
                          {(t.availability || []).map((a, i) => (
                            <div key={i}>
                              {a.day}: {a.start}-{a.end}
                            </div>
                          ))}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTherapist(t._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Add Therapist Modal */}
                {showAdd && (
                  <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Add Therapist</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowAdd(false)}
                          ></button>
                        </div>
                        <form onSubmit={handleAddTherapist}>
                          <div className="modal-body">
                            <div className="mb-2">
                              <label>Name</label>
                              <input
                                className="form-control"
                                value={newTherapist.name}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    name: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label>Email</label>
                              <input
                                className="form-control"
                                type="email"
                                value={newTherapist.email}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    email: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label>Password</label>
                              <input
                                className="form-control"
                                type="password"
                                value={newTherapist.password}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    password: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label>Specialization</label>
                              <input
                                className="form-control"
                                value={newTherapist.specialization}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    specialization: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-2">
                              <label>Phone</label>
                              <input
                                className="form-control"
                                value={newTherapist.phone}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    phone: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-2">
                              <label>Address</label>
                              <input
                                className="form-control"
                                value={newTherapist.address}
                                onChange={(e) =>
                                  setNewTherapist((t) => ({
                                    ...t,
                                    address: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-2">
                              <label>Availability</label>
                              {newTherapist.availability.map((a, idx) => (
                                <div
                                  className="d-flex align-items-center mb-1"
                                  key={idx}
                                >
                                  <select
                                    className="form-select me-2"
                                    style={{ width: 120 }}
                                    value={a.day}
                                    onChange={(e) =>
                                      setNewTherapist((t) => ({
                                        ...t,
                                        availability: t.availability.map(
                                          (slot, i) =>
                                            i === idx
                                              ? { ...slot, day: e.target.value }
                                              : slot
                                        ),
                                      }))
                                    }
                                  >
                                    {[
                                      "Monday",
                                      "Tuesday",
                                      "Wednesday",
                                      "Thursday",
                                      "Friday",
                                      "Saturday",
                                      "Sunday",
                                    ].map((day) => (
                                      <option key={day} value={day}>
                                        {day}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="time"
                                    className="form-control me-2"
                                    style={{ width: 120 }}
                                    value={a.start}
                                    onChange={(e) =>
                                      setNewTherapist((t) => ({
                                        ...t,
                                        availability: t.availability.map(
                                          (slot, i) =>
                                            i === idx
                                              ? {
                                                  ...slot,
                                                  start: e.target.value,
                                                }
                                              : slot
                                        ),
                                      }))
                                    }
                                  />
                                  <span className="mx-1">-</span>
                                  <input
                                    type="time"
                                    className="form-control me-2"
                                    style={{ width: 120 }}
                                    value={a.end}
                                    onChange={(e) =>
                                      setNewTherapist((t) => ({
                                        ...t,
                                        availability: t.availability.map(
                                          (slot, i) =>
                                            i === idx
                                              ? { ...slot, end: e.target.value }
                                              : slot
                                        ),
                                      }))
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeSlot(idx)}
                                    disabled={
                                      newTherapist.availability.length === 1
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm mt-1"
                                onClick={addSlot}
                              >
                                Add Slot
                              </button>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                              Add
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowAdd(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab === "users" && (
              <>
                <h5>Users</h5>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}
                {loading && <div>Loading...</div>}
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.phone}</td>
                        <td>{u.address}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {activeTab === "appointments" && (
              <>
                <h5>Appointments</h5>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}
                {loading && <div>Loading...</div>}
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>User</th>
                      <th>Therapist</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id}>
                        <td>{new Date(a.date).toLocaleString()}</td>
                        <td>
                          {a.user?.name} ({a.user?.email})
                        </td>
                        <td>
                          {a.therapist?.name} ({a.therapist?.email})
                        </td>
                        <td>{a.type}</td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {activeTab === "chatbot" && (
              <div>Chatbot usage stats coming soon...</div>
            )}
            {activeTab === "reports" && (
              <div>System reports coming soon...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
