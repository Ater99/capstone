const express = require('express'); // Configure multer to store files in an 'uploads' directory
const bcrypt = require('bcrypt');
const router = express.Router();
const multer = require('multer');
const BankAccountService = require('../services/BankAccountService');

// Endpoint to open a new bank account without handling photo uploads
// Multer setup (if you are considering to include file uploads later)
const upload = multer(); // Multer with no storage options, just parsing.

router.post('/open', upload.none(), async (req, res) => {
    console.log("Received fields:", req.body);
    const { accountName, phone_number, email, occupation, accountType, pin, dateOfBirth } = req.body;

    console.log("Debug Data:", {
        accountName,
        phone_number,
        email,
        occupation,
        accountType,
        pin,
        dateOfBirth // Check the actual value being passed to Sequelize
    });
    console.log("testing")
    if (!pin) {
        console.log("Pin not provided in the request.");
        return res.status(400).json({ message: "Pin is required" });
    }

    try {
        const hashedPin = await bcrypt.hash(pin, 10);
        console.log("Hashed PIN:", hashedPin);
        console.log("debugging",accountName, phone_number,email,occupation,accountType,pin,dateOfBirth)
        const bankAccount = await BankAccountService.createBankAccount({
            accountName,
            phone_number,
            email,
            occupation,
            accountType,
            pin: hashedPin,
            dateOfBirth
        });

        res.status(201).json({
            message: 'Bank Account Created Successfully',
            bankAccount
        });
    } catch (error) {
        console.error("Error creating bank account:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Endpoint to link an existing bank account
router.post('/link', async (req, res) => {
    try {
        const { accountNumber, accountName, phone_number, bankName, pin, dateOfBirth, occupation, email } = req.body;
        const hashedPin = await bcrypt.hash(pin, 10);  // Hash the pin before sending to the service

        // Send all linking data including hashed pin directly to the service
        const linkedAccount = await BankAccountService.linkBankAccount({
            accountNumber,
            accountName,
            phone_number,
            bankName,
            pin: hashedPin,
            dateOfBirth,
            occupation,
            email
        });

        res.status(201).json(linkedAccount);
    } catch (error) {
        console.error("Error linking bank account:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
