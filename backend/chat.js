const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const { Chat } = require('./index');

const HF_API_TOKEN = process.env.HF_API_TOKEN;

router.post('/chat', async (req, res) => {
  const { message, user } = req.body;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: { text: message } },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}` } }
    );
    // The response may be an array or object depending on the model
    let botReply = "Sorry, I didn't understand that.";
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      botReply = response.data[0].generated_text;
    } else if (response.data.generated_text) {
      botReply = response.data.generated_text;
    }
    // Save chat to MongoDB
    await Chat.create({
      user: user || 'anonymous',
      messages: [
        { sender: 'user', text: message },
        { sender: 'bot', text: botReply }
      ]
    });
    res.json({ reply: botReply });
  } catch (err) {
    res.status(500).json({ reply: "Sorry, I'm having trouble answering right now." });
  }
});

module.exports = router; 