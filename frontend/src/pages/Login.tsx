import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PlantSVG from "../components/PlantSVG";

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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      // Save token and user info as needed
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Redirect based on role
      switch (res.data.user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "therapist":
          navigate("/therapist-dashboard");
          break;
        default:
          navigate("/user-dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="nature-bg"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="card shadow p-4"
          style={{
            borderRadius: 32,
            maxWidth: 400,
            width: "100%",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
          }}
        >
          <div className="text-center mb-4">
            <PlantSVG width={60} height={60} />
            <h2
              className="fw-bold"
              style={{
                color: "#388e3c",
                fontFamily: "Quicksand, Nunito, sans-serif",
              }}
            >
              Welcome Back
            </h2>
            <div className="text-muted mb-2">Sign in to your peaceful mind</div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <div className="text-end mt-1">
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary"
                  style={{ fontSize: "0.95em" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-3 text-center">
            <span>Don't have an account? </span>
            <button
              className="btn btn-link p-0"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
