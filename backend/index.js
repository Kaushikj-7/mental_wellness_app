require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRouter = require('./chat');
const { User, Chat, Appointment } = require('./models');


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all therapists (with specialization and availability)
app.get('/api/therapists', async (req, res) => {
  try {
    const therapists = await User.find({ role: 'therapist' }, '-password');
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch therapists.' });
  }
});

// Get a single therapist profile
app.get('/api/therapists/:id', async (req, res) => {
  try {
    const therapist = await User.findOne({ _id: req.params.id, role: 'therapist' }, '-password');
    if (!therapist) return res.status(404).json({ error: 'Therapist not found.' });
    res.json(therapist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch therapist profile.' });
  }
});

// Book an appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { user, therapist, date, type } = req.body;
    if (!user || !therapist || !date) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // Validate user and therapist exist
    const userDoc = await User.findById(user);
    const therapistDoc = await User.findById(therapist);
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (!therapistDoc || therapistDoc.role !== 'therapist') {
      return res.status(404).json({ error: 'Therapist not found.' });
    }
    // Validate date
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }
    const appointment = new Appointment({ user, therapist, date, type });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked.', appointment });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ error: 'Failed to book appointment.', details: err.message });
  }
});

// Get all appointments for a therapist
app.get('/api/appointments/therapist/:therapistId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ therapist: req.params.therapistId })
      .populate('user', 'name email phone')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// Get all patients for a therapist (unique users with appointments)
app.get('/api/patients/therapist/:therapistId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ therapist: req.params.therapistId }).populate('user', 'name email phone address');
    const patientsMap = {};
    appointments.forEach(a => {
      if (a.user && a.user._id) patientsMap[a.user._id] = a.user;
    });
    res.json(Object.values(patientsMap));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients.' });
  }
});

// Add/update notes and medication for an appointment
app.put('/api/appointments/:id/notes', async (req, res) => {
  try {
    const { notes, medication } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { notes, medication } },
      { new: true, runValidators: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment notes.' });
  }
});

// Get a user's appointments
app.get('/api/appointments/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate('therapist', 'name email phone')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'address'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

// Accept/reject appointment (therapist)
app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment status.' });
  }
});

// Admin: Add therapist
app.post('/api/admin/therapists', async (req, res) => {
  try {
    const { name, email, password, specialization, phone, address, availability } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const therapist = new User({
      name,
      email,
      password: hashedPassword,
      role: 'therapist',
      specialization,
      phone,
      address,
      availability
    });
    await therapist.save();
    res.status(201).json({ message: 'Therapist added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add therapist.' });
  }
});

// Admin: Delete therapist
app.delete('/api/admin/therapists/:id', async (req, res) => {
  try {
    const therapist = await User.findOneAndDelete({ _id: req.params.id, role: 'therapist' });
    if (!therapist) return res.status(404).json({ error: 'Therapist not found.' });
    res.json({ message: 'Therapist deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete therapist.' });
  }
});

// Admin: List all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: { $ne: 'therapist' } });
    if (!user) return res.status(404).json({ error: 'User not found or is a therapist.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// Admin: List all appointments
app.get('/api/admin/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('therapist', 'name email')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// Utility: Create default admin user if not exists
app.get('/api/setup-admin', async (req, res) => {
  try {
    const email = 'admin@wellness.com';
    const password = 'admin123';
    let admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new User({
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
      });
      await admin.save();
      return res.json({ message: 'Admin user created.', email, password });
    }
    res.json({ message: 'Admin user already exists.', email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin.' });
  }
});

app.use('/api', chatRouter);

module.exports = { app, User, Chat };

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 