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
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/contactus', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({ message: 'Failed to send email' });
    } else {
      res.status(200).send({ message: 'Email sent successfully' });
    }
  });
});

module.exports = router;