import React from "react";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mb-4 shadow-sm rounded">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-primary">MindWell</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link${
                  currentView === "home" ? " active fw-bold text-primary" : ""
                }`}
                onClick={() => onViewChange("home")}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link${
                  currentView === "appointments"
                    ? " active fw-bold text-primary"
                    : ""
                }`}
                onClick={() => onViewChange("appointments")}
              >
                Appointments
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link${
                  currentView === "chat" ? " active fw-bold text-primary" : ""
                }`}
                onClick={() => onViewChange("chat")}
              >
                AI Assistant
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link${
                  currentView === "profile"
                    ? " active fw-bold text-primary"
                    : ""
                }`}
                onClick={() => onViewChange("profile")}
              >
                Profile
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
