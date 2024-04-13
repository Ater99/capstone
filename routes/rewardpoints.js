const express = require('express');
const router = express.Router();
const RewardPointsService = require('../services/rewardPointsService');
const authMiddleware = require('../middleware/auth'); // Adjust the path to your middleware file

// Get reward points for a user
router.get('/:userId', authMiddleware, async (req, res) => {
 try {
    const rewardPoints = await RewardPointsService.getRewardPointsByUserId(req.params.userId);
    res.json(rewardPoints);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

// Update reward points for a user
router.put('/:userId', authMiddleware, async (req, res) => {
 try {
    const updatedRewardPoints = await RewardPointsService.updateRewardPoints(req.params.userId, req.body);
    res.json(updatedRewardPoints);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

module.exports = router;
