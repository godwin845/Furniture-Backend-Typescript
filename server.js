import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session'; // Import express-session for session management

// Load environment variables
dotenv.config();

// MongoDB User Model
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model('User', userSchema);

// Email transporter for sending reset emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'j97387695@gmail.com',
    pass: 'xgzb nszi qavr wnip',
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Express Setup
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Session Middleware Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'ghshqd', // Secret key for signing the session ID cookie
  resave: false,  // Don't save session if it's not modified
  saveUninitialized: true,  // Save uninitialized session (e.g., for new visitors)
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS in production
    httpOnly: true,  // Prevent JavaScript from accessing the session cookie
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Routes

// Get all users (only for authenticated users)
app.get('/api/auth/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching users' });
  }
});

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store user info in session
    req.session.user = { userId: newUser._id, email: newUser.email };

    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password.');

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store user info in session
    req.session.user = { userId: user._id, email: user.email };

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout (destroy session)
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout.' });
    }
    res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// Send a password reset email
app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: 'j97387695@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `To reset your password, click the following link: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent.', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password with the reset token
app.post('/api/auth/reset-password/:resetToken', async (req, res) => {
  const { newPassword } = req.body;
  const { resetToken } = req.params;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});