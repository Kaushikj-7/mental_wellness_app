import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="nature-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <h2 className="fw-bold" style={{ color: "#355c3a", fontFamily: "Quicksand, Nunito, sans-serif" }}>
              Forgot Password
            </h2>
            <div className="text-muted mb-2">Enter your email to reset your password</div>
          </div>
          {submitted ? (
            <div className="alert alert-success text-center">
              If this email exists, a reset link has been sent.<br />Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
          <div className="mt-3 text-center">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 