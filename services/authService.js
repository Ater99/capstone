const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path based on your project structure

const authService = {
  // Authenticate a user and return a token
  authenticate: async (email, password) => {
    try {
      // Find the user by username
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Authentication failed. User not found.');
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Authentication failed. Wrong password.');
      }

      // User is authenticated, generate a token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });

      return token;
    } catch (error) {
      throw error;
    }
  },

  // Verify a token and return user data
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw error;
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create a new user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Change a user's password
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found.');
      }

      // Check if the old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Old password is incorrect.');
      }

      // Hash the new password and update it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password changed successfully.' };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;
