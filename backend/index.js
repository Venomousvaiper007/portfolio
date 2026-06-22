const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Ensure messages.json exists
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}

// Health Check Route
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running smoothly', timestamp: new Date() });
});

// Contact Route
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const newMessage = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      email,
      subject: subject || 'No Subject',
      message,
      timestamp: new Date().toISOString()
    };

    // Read existing messages
    const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(fileData);

    // Append new message
    messages.push(newMessage);

    // Save back to file
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ error: 'An error occurred while saving your message.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
