const express = require('express');
const router = express.Router();
const TransactionService = require('../services/TransactionService');
const authMiddleware = require('../middleware/auth'); 
const BankAccountService = require('../services/BankAccountService');
const BankAccount = require('../models/BankAccount');

// Route to handle deposit transactions
router.post('/deposit', authMiddleware, async (req, res) => {
    try {
        const { user_id, accountNumber, amount } = req.body;
        const transaction = await TransactionService.processDeposit(user_id, accountNumber, parseFloat(amount));
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/withdrawal', async (req, res) => {
    console.log("checking user", req.session.user_id)
    if (!req.session.user_id) {
        return res.status(403).json({ message: 'Authentication required.' });
    }

    const user_id = req.session.user_id;
    const { accountNumber, amount, phone_number } = req.body;

    try {
        /* // Verify the user's account ownership and check funds
        const account = await BankAccountService.getAccount({ userId, accountNumber });
        if (!account) {
            return res.status(404).json({ message: "Account not found or does not belong to the user" });
        }
         */
        if (BankAccount.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Process the withdrawal
        const transaction = await TransactionService.processWithdrawal({
            user_id,
            accountNumber,
            amount: parseFloat(amount),
            phone_number
        });

        // Respond with the transaction details
        res.status(201).json({
            message: 'Withdrawal successful',
            transaction
        });
    } catch (error) {
        console.error("Error processing withdrawal: ", error);
        res.status(500).json({ message: error.message || "An error occurred during the withdrawal process" });
    }
});

// Route to handle transfer transactions
router.post('/transfer', async (req, res) => {
    // Authentication check
    if (!req.user) {
        return res.status(403).json({ message: 'Authentication required.' });
    }

    try {
        const user_id = req.session.user_id; // Using the globally attached user object
        const { accountNumber, amount, recipientAccountNumber } = req.body;

        // Verification if the accountNumber belongs to the user
        const account = await BankAccount.findOne({ where: { accountNumber, user_id } });
        if (!account) {
            return res.status(403).json({ message: "Account does not belong to the user" });
        }

        // Ensure all required fields are present
        if (!accountNumber || !amount || !recipientAccountNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Proceed with the logic for processing the transfer...
        const transaction = await TransactionService.processTransfer(user_id, accountNumber, parseFloat(amount), recipientAccountNumber);
        // Rest of your logic remains the same
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});

// Route to cancel a transaction
router.post('/cancel', authMiddleware, async (req, res) => {
    try {
        const { transactionId } = req.body; // Assume you pass the ID of the transaction to cancel
        const transaction = await TransactionService.cancelTransaction(transactionId);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Route to refund a transaction
router.post('/refund', authMiddleware, async (req, res) => {
    try {
        const { transactionId } = req.body; // ID of the transaction to refund
        const refundDetails = await TransactionService.refundTransaction(transactionId);
        res.status(200).json(refundDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to handle paybill transactions
router.post('/paybill', authMiddleware, async (req, res) => {
    try {
        const { user_id, accountNumber, amount, billId, paymentMethod, paymentDetails } = req.body;
        const transaction = await TransactionService.processPaybill(user_id, accountNumber, parseFloat(amount), billId, paymentMethod, paymentDetails);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to create a PayPal payment
router.post('/paypal/create', authMiddleware, async (req, res) => {
    try {
        const { user_id, accountNumber, amount, returnUrl, cancelUrl } = req.body;
        const order = await TransactionService.createPayPalPayment(user_id, accountNumber, parseFloat(amount), returnUrl, cancelUrl);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to capture a PayPal payment
router.post('/paypal/capture', authMiddleware, async (req, res) => {
    try {
        const { transactionId } = req.body;
        const captureDetails = await TransactionService.capturePayPalPayment(transactionId);
        res.status(201).json(captureDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
