const express = require('express');
const User = express.Router();
const UserService = require('../services/userService');
const { registerValidationRules, validate } = require('../middleware/validation');

// Signup route
User.post('/signup', registerValidationRules(), validate, async (req, res) => {
  try {
    const user = await UserService.createUser(req.body.name, req.body.email, req.body.password);
    res.status(201).json({ user, message: 'User successfully created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
User.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password); // This method needs to be implemented in UserService
    if (user) {
      res.status(200).json({ user, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch user profile information
User.get('/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user information
User.put('/:id', async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
User.delete('/:id', async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = User;
