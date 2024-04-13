const Loan = require('../models/loans');
const { Sequelize } = require('sequelize');

class LoanService {
    // Get all loans
    static async getAllLoans() {
        try {
            return await Loan.findAll();
        } catch (error) {
            throw new Error('Unable to retrieve loans: ' + error.message);
        }
    }

    // Get a loan by ID
    static async getLoanById(id) {
        try {
            const loan = await Loan.findByPk(id);
            if (!loan) {
                throw new Error('Loan not found');
            }
            return loan;
        } catch (error) {
            throw new Error('Unable to retrieve loan: ' + error.message);
        }
    }

// Create an investment
    static async createInvestment({ amount, period, bankPin }) {
        // Normally, you might validate investment data here
        // validateInvestmentData({ amount, period, bankPin });

        try {
            // Create a new investment with the provided data
            const newInvestment = await Investment.create({
                amount,
                period,
                bankPin // Assuming you handle bankPin in your model or elsewhere
            });
            return newInvestment;
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                // Handle validation errors specifically
                throw new Error('Validation error: ' + error.message);
            } else {
                // Handle other types of database errors
                throw new Error('Database error: ' + error.message);
            }
        }
    }

    // Update a loan
    static async updateLoan(id, updatedData) {
        try {
            const loan = await Loan.findByPk(id);
            if (!loan) {
                throw new Error('Loan not found');
            }
            return await loan.update(updatedData);
        } catch (error) {
            throw new Error('Unable to update loan: ' + error.message);
        }
    }

    // Delete a loan
    static async deleteLoan(id) {
        try {
            const loan = await Loan.findByPk(id);
            if (!loan) {
                throw new Error('Loan not found');
            }
            await loan.destroy();
            return 'Loan successfully deleted';
        } catch (error) {
            throw new Error('Unable to delete loan: ' + error.message);
        }
    }
}

module.exports = LoanService;
