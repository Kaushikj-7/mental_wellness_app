const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'therapist', 'admin'], default: 'user' },
  phone: { type: String },
  address: { type: String },
  specialization: { type: String },
  availability: [
    {
      day: String, // e.g. 'Monday'
      start: String, // e.g. '09:00'
      end: String,   // e.g. '17:00'
    }
  ]
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, index: true },
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'] },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Video Call', 'In-Person', 'Phone Call'], default: 'Video Call' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  notes: { type: String },
  medication: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { User, Chat, Appointment };