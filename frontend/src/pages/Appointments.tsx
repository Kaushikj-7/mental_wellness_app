import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("Video Call");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch therapists
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/therapists")
      .then((res) => setTherapists(res.data))
      .catch(() => setTherapists([]));
  }, []);

  // Fetch user's appointments
  const fetchAppointments = () => {
    axios
      .get(`http://localhost:5000/api/appointments/user/${user.id}`)
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]));
  };
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  // When therapist changes, update available days
  useEffect(() => {
    if (!selectedTherapist) {
      setAvailableDays([]);
      setAvailableTimes([]);
      setSelectedDay("");
      setSelectedTime("");
      return;
    }
    const therapist = therapists.find((t) => t._id === selectedTherapist);
    if (therapist && therapist.availability) {
      setAvailableDays(therapist.availability.map((a) => a.day));
      setSelectedDay("");
      setAvailableTimes([]);
      setSelectedTime("");
    }
  }, [selectedTherapist, therapists]);

  // When day changes, update available times
  useEffect(() => {
    if (!selectedTherapist || !selectedDay) {
      setAvailableTimes([]);
      setSelectedTime("");
      return;
    }
    const therapist = therapists.find((t) => t._id === selectedTherapist);
    if (therapist && therapist.availability) {
      const slot = therapist.availability.find((a) => a.day === selectedDay);
      if (slot) {
        // Generate 30-min slots between start and end
        const times = [];
        let [h, m] = slot.start.split(":").map(Number);
        const [eh, em] = slot.end.split(":").map(Number);
        while (h < eh || (h === eh && m < em)) {
          const time = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
          times.push(time);
          m += 30;
          if (m >= 60) {
            h++;
            m = 0;
          }
        }
        setAvailableTimes(times);
        setSelectedTime("");
      }
    }
  }, [selectedDay, selectedTherapist, therapists]);

  // Book appointment: use selectedDay and selectedTime to build date
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user || !user.id) {
      setError("You must be logged in to book an appointment.");
      return;
    }
    if (!selectedTherapist || !selectedDay || !selectedTime) {
      setError("Please select a therapist, day, and time.");
      return;
    }
    // Build date string for next selectedDay
    const today = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let dayIdx = daysOfWeek.indexOf(selectedDay);
    let diff = (dayIdx - today.getDay() + 7) % 7;
    let apptDate = new Date(today);
    apptDate.setDate(today.getDate() + diff);
    const [h, m] = selectedTime.split(":");
    apptDate.setHours(Number(h), Number(m), 0, 0);
    // Format as ISO string
    const date = apptDate.toISOString();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/appointments", {
        user: user.id,
        therapist: selectedTherapist,
        date,
        type,
      });
      setSuccess("Appointment booked!");
      setSelectedTherapist("");
      setSelectedDay("");
      setSelectedTime("");
      setDate("");
      setType("Video Call");
      fetchAppointments();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError("Failed to book appointment: " + err.response.data.error);
      } else if (err.message) {
        setError("Failed to book appointment: " + err.message);
      } else {
        setError("Failed to book appointment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="card mb-4">
        <div className="card-header fw-bold">Book Appointment</div>
        <div className="card-body">
          <form onSubmit={handleBook} className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Therapist</label>
              <select
                className="form-select"
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
                required
              >
                <option value="">Select therapist</option>
                {therapists.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Day</label>
              <select
                className="form-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                required
                disabled={!availableDays.length}
              >
                <option value="">Select day</option>
                {availableDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Time</label>
              <select
                className="form-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!availableTimes.length}
              >
                <option value="">Select time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Video Call">Video Call</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || !user}
              >
                {loading ? "Booking..." : "Book"}
              </button>
            </div>
            {error && (
              <div className="col-12 alert alert-danger py-2">{error}</div>
            )}
            {success && (
              <div className="col-12 alert alert-success py-2">{success}</div>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header fw-bold">My Appointments</div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Therapist</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{new Date(a.date).toLocaleString()}</td>
                  <td>
                    {a.therapist?.name} ({a.therapist?.email})
                  </td>
                  <td>{a.type || "Video Call"}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
