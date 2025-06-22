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
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

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
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        user: user.id,
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: response.data.reply },
      ]);
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

  // Fetch chat history
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/chat/history/${user.id}`)
        .then((res) => {
          if (res.data.messages) {
            setMessages(res.data.messages);
          }
        })
        .catch((err) => {
          console.error("Error fetching chat history:", err);
        });
    }
  }, [user]);

  const handleNewChat = () => {
    // Implement the logic to start a new chat
  };

  const loadChatSession = (sessionId: string) => {
    // Implement the logic to load a specific chat session
  };

  return (
    <div
      className="nature-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="container py-4"
        style={{ maxWidth: 700, zIndex: 1, position: "relative" }}
      >
        <div
          className="card shadow-sm mb-3"
          style={{ background: "rgba(255,255,255,0.85)" }}
        >
          <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
            <span>AI Wellness Chatbot</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleNewChat}
            >
              New Chat
            </button>
          </div>
          <div className="d-flex">
            {/* Sidebar for previous chats */}
            <div
              style={{
                width: 180,
                borderRight: "1px solid #e0e0e0",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <div className="p-2 fw-bold text-secondary">Previous Chats</div>
              <ul
                className="list-unstyled px-2"
                style={{ maxHeight: 400, overflowY: "auto" }}
              >
                {chatSessions.map((session, idx) => (
                  <li key={session.id}>
                    <button
                      className={`btn btn-link w-100 text-start px-0 ${
                        currentSessionId === session.id
                          ? "fw-bold text-primary"
                          : ""
                      }`}
                      onClick={() => loadChatSession(session.id)}
                    >
                      Chat {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Main chat area */}
            <div style={{ flex: 1 }}>
              <div
                className="card-body"
                style={{
                  height: 400,
                  overflowY: "auto",
                  background: "#f8f9fa",
                }}
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
        </div>
      </div>
    </div>
  );
};

export default Chat;
