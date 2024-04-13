const express = require('express');
const router = express.Router();
const LoanService = require('../services/loanService');

// Helper function to validate loan data
const validateLoanData = (loanData) => {
 if (!loanData.provider || !loanData.amount || !loanData.due_date  || !loanData.phone_number || !loanData.email || !loanData.full_names || !loanData.location || !loanData.current_employment_status) {
    throw new Error('Missing required fields');
 }

 if (loanData.amount <= 0.01) {
    throw new Error('Loan amount must be a positive number greater than 0.01');
 }

 if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(loanData.email)) {
    throw new Error('Invalid email format');
 }

 // Additional validation can be added here as needed
};

// Middleware to log request details for debugging
const requestLogger = (req, res, next) => {
 console.log(`${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
 next();
};

// Get all loans
router.get('/', async (req, res) => {
 try {
    const loans = await LoanService.getAllLoans();
    res.json(loans);
 } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'An error occurred while fetching loans' });
 }
});

// Get a specific loan by ID
router.get('/:id', async (req, res) => {
 try {
    const loan = await LoanService.getLoanById(req.params.id);
    if (loan) {
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
 } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'An error occurred while fetching the loan' });
 }
});

// Create a new loan
router.post('/', requestLogger, async (req, res) => {
 try {
    validateLoanData(req.body);
    const newLoan = await LoanService.createLoan(req.body);
    res.status(201).json({
      message: 'Loan application successfully submitted.',
      loan: newLoan
    });
 } catch (error) {
    console.error('Error in POST /loans:', error); // Log any errors
    res.status(400).json({ message: error.message });
 }
});

// Update a loan
router.put('/:id', requestLogger, async (req, res) => {
 try {
    validateLoanData(req.body);
    const updatedLoan = await LoanService.updateLoan(req.params.id, req.body);
    if (updatedLoan) {
      res.json({
        message: 'Loan successfully updated.',
        loan: updatedLoan
      });
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
 } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ message: error.message });
 }
});

// Delete a loan
router.delete('/:id', async (req, res) => {
 try {
    await LoanService.deleteLoan(req.params.id);
    res.status(204).send(); // 204 No Content is often used for successful deletes
 } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'An error occurred while deleting the loan' });
 }
});

// Process a loan payment
router.post('/:id/payments', requestLogger, async (req, res) => {
  try {
    const { amount } = req.body;
    const { id: loanId } = req.params;

    validatePaymentData({ loanId, amount });

    // Assuming your LoanService has a method to handle payments
    const updatedLoan = await LoanService.applyPayment(loanId, parseFloat(amount));
    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found or could not apply payment' });
    }

    res.json({
      message: 'Payment applied successfully',
      loan: updatedLoan,
    });
  } catch (error) {
    console.error('Error in POST /:id/payments:', error); // Log any errors
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
