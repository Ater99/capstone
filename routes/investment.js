const express = require('express');
const router = express.Router();
const InvestmentService = require('../services/investmentService');
const authMiddleware = require('../middleware/auth');

// Get all investments
router.get('/', async (req, res) => {
 try {
    const investments = await InvestmentService.getAllInvestments();
    res.json(investments);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

// Get a specific investment by ID
router.get('/:id', async (req, res) => {
 try {
    const investment = await InvestmentService.getInvestmentById(req.params.id);
    if (investment) {
      res.json(investment);
    } else {
      res.status(404).json({ message: 'Investment not found' });
    }
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

// Create a new investment
router.post('/invest', async (req, res) => {
    try {
        const newInvestment = await InvestmentService.createInvestment(req.body);
        res.status(201).json(newInvestment);
    } catch (error) {
        console.error("Error creating investment:", error);
        res.status(400).json({ message: error.message });
    }
});

// Withdrawal operation
router.post('/withdraw', authMiddleware, async (req, res) => {
 try {
    const withdrawalData = {
      ...req.body,
      user_id: req.session.userId, // Retrieve user ID from the session
    };
    const withdrawalResult = await InvestmentService.processWithdrawal(withdrawalData);
    res.status(200).json(withdrawalResult);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

// Cancellation operation
router.post('/cancel', authMiddleware, async (req, res) => {
 try {
    const cancellationData = {
      investmentId: req.body.investmentId,
      user_id: req.session.userId, // Retrieve user ID from the session
    };
    const cancellationResult = await InvestmentService.cancelInvestment(cancellationData);
    res.status(200).json(cancellationResult);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

// Update an investment
router.put('/:id', authMiddleware, async (req, res) => {
 try {
    const updatedInvestment = await InvestmentService.updateInvestment(req.params.id, {
      ...req.body,
      user_id: req.session.userId, // Retrieve user ID from the session
    });
    res.json(updatedInvestment);
 } catch (error) {
    res.status(400).json({ message: error.message });
 }
});

// Delete an investment
router.delete('/:id', async (req, res) => {
 try {
    const message = await InvestmentService.deleteInvestment(req.params.id);
    res.json({ message });
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

module.exports = router;
