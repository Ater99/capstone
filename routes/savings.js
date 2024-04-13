const express = require('express');
const router = express.Router();
const SavingsService = require('../services/savingService');
const authMiddleware = require('../middleware/auth'); // Adjust the path to your middleware file

// Get all savings for a user
router.get('/:userId', authMiddleware, async (req, res) => {
 try {
    const savings = await SavingsService.getSavingsByUserId(req.params.userId);
    res.json(savings);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

// Create a new saving record
router.post('/', authMiddleware, async (req, res) => {
 try {
    const saving = await SavingsService.createSaving(req.body);
    res.status(201).json(saving);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

// Update a saving record
router.put('/:id', authMiddleware, async (req, res) => {
 try {
    const updatedSaving = await SavingsService.updateSaving(req.params.id, req.body);
    res.json(updatedSaving);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

// Delete a saving record
router.delete('/:id', authMiddleware, async (req, res) => {
 try {
    await SavingsService.deleteSaving(req.params.id);
    res.json({ message: 'Saving record successfully deleted' });
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

module.exports = router;
