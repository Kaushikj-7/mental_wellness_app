const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const { Chat, User } = require('./models');
const { v4: uuidv4 } = require('uuid');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Create a new chat session
router.post('/chat/session', async (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ error: 'User ID is required.' });
  const sessionId = uuidv4();
  const chat = new Chat({ user, sessionId, messages: [] });
  await chat.save();
  res.json({ sessionId });
});

// List all chat sessions for a user
router.get('/chat/sessions/:userId', async (req, res) => {
  try {
    const sessions = await Chat.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ sessions: sessions.map(s => ({ id: s.sessionId, createdAt: s.createdAt })) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get messages for a specific session
router.get('/chat/history/:userId/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.params.userId, sessionId: req.params.sessionId });
    if (!chat) return res.json({ messages: [] });
    res.json({ messages: chat.messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update /chat to require sessionId and store messages per session
router.post('/chat', async (req, res) => {
  const { message, user, sessionId } = req.body;
  try {
    if (!user || !sessionId) {
      return res.status(400).json({ reply: 'User ID and sessionId are required.' });
    }
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return res.status(404).json({ reply: 'User not found.' });
    }
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful mental wellness assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 256,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );
    const botReply = response.data.choices[0].message.content;
    let chat = await Chat.findOne({ user, sessionId });
    if (!chat) {
      chat = new Chat({ user, sessionId, messages: [] });
    }
    chat.messages.push({ sender: 'user', text: message });
    chat.messages.push({ sender: 'bot', text: botReply });
    await chat.save();
    res.json({ reply: botReply });
  } catch (err) {
    if (err.response) {
      console.error("Groq API error:", err.response.status, err.response.data);
    } else {
      console.error("Groq API error:", err.message || err);
    }
    res.status(500).json({ reply: "Sorry, I'm having trouble answering right now." });
  }
});

// Endpoint to get chat history for a user
router.get('/chat/history/:userId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.params.userId }).populate('user', 'name email');
    if (!chat) return res.json({ messages: [] });
    res.json({ messages: chat.messages, user: chat.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
});

module.exports = router; 