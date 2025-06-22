import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI wellness assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        user: user?.id, // send MongoDB _id
      });
      setMessages((msgs) => [...msgs, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble answering right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/history/${user.id}`
        );
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch {
        // ignore
      }
    };
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-primary text-white fw-bold">
          AI Wellness Chatbot
        </div>
        <div
          className="card-body"
          style={{ height: 400, overflowY: "auto", background: "#f8f9fa" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-2 ${
                msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-light border"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex mb-2 justify-content-start">
              <div
                className="p-2 rounded bg-light border text-muted"
                style={{ maxWidth: "75%" }}
              >
                Bot is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={sendMessage}
          className="card-footer d-flex gap-2 bg-white"
        >
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
