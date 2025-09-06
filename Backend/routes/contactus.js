const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // 465 ke liye true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Contact form endpoint
router.post('/contactus', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,   // Gmail sender
    to: process.env.EMAIL_USER,     // Your inbox
    replyTo: email,                 // User email (reply button kaam karega)
    subject: '📩 New Contact Form Submission',
    text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '✅ Email sent successfully!' });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: '❌ Failed to send email', error: error.message });
  }
});

module.exports = router;
