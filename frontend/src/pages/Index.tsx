import React, { useState } from "react";
import Header from "../components/Header";
import Home from "../components/Home";
import Appointments from "../components/Appointments";
import Chat from "../components/Chat";
import UserProfile from "../components/UserProfile";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <Home onViewChange={setCurrentView} />;
      case "appointments":
        return <Appointments />;
      case "chat":
        return <Chat />;
      case "profile":
        return <UserProfile />;
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main>{renderCurrentView()}</main>
      </div>
    </div>
  );
};

export default Index;
