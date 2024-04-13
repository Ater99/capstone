// services/BankAccountService.js
const BankAccount = require('../models/BankAccount'); // Correct Sequelize model path

class BankAccountService {
    static async getAccount(user_id, accountNumber) {
        const account = await BankAccount.findOne({
            where: { userId: user_id, accountNumber }
        });
        if (!account) {
            throw new Error('Account not found');
        }
        return account;
    }

    static async createBankAccount({accountName, dateOfBirth, phone_number, email, occupation, accountType, pin }) {
        // Create a new account
        const newAccount = await BankAccount.create({
            accountName,
            phone_number,
            email,
            occupation,
            accountType,
            pin,
            dateOfBirth
        });
        return newAccount;
    }

    static async linkBankAccount({ accountNumber, accountName, phone_number, bankName, pin, dateOfBirth, occupation, email }) {
    // Check if the account already exists
    const existingAccount = await BankAccount.findOne({ where: { accountNumber } });

    // If the account exists, inform the user
    if (existingAccount) {
        return { message: "This bank account is already linked to a user.", account: existingAccount };
    } else {
        // If the account does not exist, create a new one and link it
        const newAccount = await BankAccount.create({
            accountNumber,
            accountName,
            phone_number,
            bankName,
            pin, // Ensure this is securely handled, perhaps hashed
            dateOfBirth,
            occupation,
            email
        });

        return { message: "New bank account created and linked successfully", account: newAccount };
    }
}

    static async verifyAndWithdraw({ userId, accountNumber, amount }) {
        const account = await BankAccount.findOne({
            where: { userId, accountNumber }
        });
        if (!account || account.balance < amount) {
            throw new Error('Insufficient funds or account not found');
        }
        account.balance -= amount; // Deduct the amount from the account
        await account.save();
        return account;
    }
}

module.exports = BankAccountService;
