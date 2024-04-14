const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Ensure this path points to your User model
const BankAccount = require('../models/BankAccount'); // Ensure this points to your BankAccount model
require('dotenv').config();
//const nodemailer = require('nodemailer');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: 'Account created successfully', user: { email, name: user.name } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a session for the user
        req.session.user_id = user.id;  // Corrected to ensure consistency with authMiddleware
        console.log("Logged in user", req.session.user_id);
        // Explicitly save the session before sending the response
        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: 'Failed to establish session' });
            }
            // Only send the response back after the session has been saved
            res.status(200).json({
                message: 'Login successful',
                sessionId: req.sessionID, // Corrected to use req.sessionID which is the proper way to access the session ID
                user: { email, name: user.name }
            });
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during login' });
    }
});


// logout route
router.post('/logout', (req, res) => {
 req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.status(200).send('Logged out');
 });
});

// Create transporter with SMTP settings

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
 }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const axios = require('axios');

  console.log(`username:${process.env.EMAIL_USER},password:${process.env.EMAIL_PASS}`);
 const { email } = req.body;
 try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
    });
    console.log("we reached here");
    // Define mail options for password reset email
    const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `To reset your password, please click on the following link or paste it into your browser:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send the password reset email
   /*  transporter.sendMail(mailOptions, error => {
      if (error) {
        console.error("our error",error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Email sent with password reset instructions.' });
    }); */
    const url = 'https://api.emailjs.com/api/v1.0/email/send';

    const headers = {
        'Content-Type': 'application/json'
    };

    const emailData = {
        service_id: 'service_rcoysvl',
        template_id: 'template_bvcr72i',
        user_id: '7ulbe1H-6ABlGW3h1',
        template_params: {
            to_name:"jere",
            from_name:"sam",
            message:"work"
        }
    };

    try {
        console.log("lets debug")
        const response = await axios.post(url, emailData, { headers: headers });
        console.log('Email sent successfully:', response?.data);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
 } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during password reset request' });
 }
});

// Password Reset
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token, 
        resetPasswordExpires: { [Op.gt]: Date.now() } 
      } 
    });
    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Add Bank Account Details
router.post('/user/:userId/link-bank-account', async (req, res) => {
  const { userId } = req.params;
  const { accountNumber, accountName, phoneNumber } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bankAccount = await BankAccount.create({
      userId,
      accountNumber,
      accountName,
      phoneNumber,
      bankName,
      pin,
    });

    res.status(201).json({ message: 'Bank account added successfully', bankAccount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update Bank Account Details
router.put('/bank-account/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const { accountNumber, accountName, phoneNumber } = req.body;
  try {
    const bankAccount = await BankAccount.findByPk(accountId);
    if (!bankAccount) return res.status(404).json({ message: 'Bank account not found' });

    await bankAccount.update({ accountNumber, accountName, phoneNumber });
    res.status(200).json({ message: 'Bank account updated successfully', bankAccount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete Bank Account
router.delete('/bank-account/:accountId', async (req, res) => {
  const { accountId } = req.params;
  try {
    const bankAccount = await BankAccount.findByPk(accountId);
    if (!bankAccount) return res.status(404).json({ message: 'Bank account not found' });

    await bankAccount.destroy();
    res.status(200).json({ message: 'Bank account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
