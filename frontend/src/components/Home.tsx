import React from "react";
import {
  Calendar,
  MessageCircle,
  Users,
  Shield,
  Clock,
  Award,
} from "lucide-react";

interface HomeProps {
  onViewChange: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description:
        "Book appointments with licensed therapists at your convenience",
      color: "text-blue-500",
    },
    {
      icon: MessageCircle,
      title: "AI Wellness Assistant",
      description:
        "24/7 support with our intelligent chatbot for immediate guidance",
      color: "text-emerald-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your mental health journey is protected with enterprise-grade security",
      color: "text-purple-500",
    },
    {
      icon: Users,
      title: "Expert Therapists",
      description: "Connect with certified mental health professionals",
      color: "text-cyan-500",
    },
  ];

  const stats = [
    { number: "10k+", label: "Happy Clients", icon: Users },
    { number: "500+", label: "Licensed Therapists", icon: Award },
    { number: "24/7", label: "AI Support", icon: Clock },
    { number: "95%", label: "Satisfaction Rate", icon: Shield },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Your Mental Wellness
            </span>
            <br />
            <span className="text-gray-700">Journey Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with licensed therapists, get instant AI support, and take
            control of your mental health with our comprehensive wellness
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onViewChange("appointments")}
              className="wellness-button text-lg px-8 py-4"
            >
              Book Appointment
            </button>
            <button
              onClick={() => onViewChange("chat")}
              className="wellness-button-secondary text-lg px-8 py-4"
            >
              Try AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="wellness-card p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Everything You Need for Mental Wellness
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="wellness-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="wellness-card p-12 text-center bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Join thousands of people who have improved their mental health with
          MindWell
        </p>
        <button
          onClick={() => onViewChange("appointments")}
          className="wellness-button text-lg px-8 py-4"
        >
          Get Started Today
        </button>
      </section>
    </div>
  );
};

export default Home;
