const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const { Chat, User } = require('./models');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

router.post('/chat', async (req, res) => {
  const { message, user } = req.body;
  try {
    // Validate user
    if (!user) {
      return res.status(400).json({ reply: 'User ID is required.' });
    }
    // Ensure user exists
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return res.status(404).json({ reply: 'User not found.' });
    }
    // Call Groq API
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
    // Find or create chat history for this user
    let chat = await Chat.findOne({ user });
    if (!chat) {
      chat = new Chat({ user, messages: [] });
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