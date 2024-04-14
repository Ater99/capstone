// Import necessary dependencies
const paypal = require('@paypal/checkout-server-sdk');
const { paypalClient } = require('../config/paypalClient'); // Adjust this path as per your project structure
const transaction = require('../models/transactions'); // Ensure this path matches your project
const BankAccount = require('../models/BankAccount'); // Adjust path as necessary
const sequelize = require('../db');
const momo=require('../models/momo')
const User=require('../models/Userdetails')

class transactionService {
    // Process a deposit transaction
    static async processDeposit(user_id, accountNumber, amount) {
        const transaction = await sequelize.transaction(async (t) => {
            const account = await BankAccount.findOne({ where: { user_id, accountNumber } }, { transaction: t });
            if (!account) throw new Error("Account not found.");

            account.balance += parseFloat(amount);
            await account.save({ transaction: t });

            return await transaction.create({
                user_id,
                accountNumber,
                type: 'deposit',
                amount,
                status: 'completed'
            }, { transaction: t });
        });

        return transaction;
    }

    // Process a withdrawal transaction
static async processWithdrawal(user_id, accountNumber, amount) {
    var momobalance;
    const transaction = await sequelize.transaction(async (t) => {
        // Fetch the bank account
        const account = await BankAccount.findOne({ where: { user_id, accountNumber } }, { transaction: t });
        if (!account) throw new Error("Account not found.");
        if (account.balance < amount) throw new Error("Insufficient funds.");

        // Deduct amount from bank account
        account.balance -= parseFloat(amount);
        await account.save({ transaction: t });
        const thisUser=await User.findOne({where: { user_id } })
        // Try to fetch Momo account, or create a new one if it doesn't exist
        let momoaccount = await momo.findOne({ where: { user_id: user_id } }, { transaction: t });
        if (!momoaccount) {
            // If Momo account does not exist, create it with initial amount as 0
            momoaccount = await momo.create({
                user_id: user_id,
                amount: 0,
                phone_number:thisUser.phone_number? thisUser.phone_number:"25078976545"
            }, { transaction: t });
        }

        // Update Momo account balance
        momoaccount.amount += parseFloat(amount);
        await momoaccount.save({ transaction: t });
        momobalance = momoaccount.amount;

        // Create a transaction record
        return await transaction.create({
            user_id,
            accountNumber,
            type: 'withdrawal',
            amount,
            status: 'completed'
        }, { transaction: t });
    });

    return { transaction, momoaccount };
}


    // Process a transfer transaction
    static async processTransfer(user_id, accountNumber, amount, recipientAccountNumber) {
        const transaction = await sequelize.transaction(async (t) => {
            const senderBankAccount = await Account.findOne({ where: { user_id, accountNumber } }, { transaction: t });
            if (!senderBankAccount) throw new Error("Sender account not found.");
            if (senderBankAccount.balance < amount) throw new Error("Insufficient funds in sender account.");

            const recipientBankAccount = await BankAccount.findOne({ where: { accountNumber: recipientAccountNumber } }, { transaction: t });
            if (!recipientBankAccount) throw new Error("Recipient account not found.");

            senderBankAccount.balance -= parseFloat(amount);
            await senderBankAccount.save({ transaction: t });

            recipientBankAccount.balance += parseFloat(amount);
            await recipientBankAccount.save({ transaction: t });

            return await transaction.create({
                user_id,
                accountNumber,
                type: 'transfer',
                amount,
                status: 'completed',
                recipientAccountNumber
            }, { transaction: t });
        });

        return transaction;
    }

    // Process a paybill transaction
    static async processPaybill(user_id, accountNumber, amount, billId, paymentMethod, paymentDetails) {
        const transaction = await sequelize.transaction(async (t) => {
            const account = await BankAccount.findOne({ where: { user_id, accountNumber } }, { transaction: t });
            if (!account) throw new Error("Account not found.");
            if (account.balance < amount) throw new Error("Insufficient funds.");

            account.balance -= parseFloat(amount);
            await account.save({ transaction: t });

            return await transaction.create({
                user_id,
                accountNumber,
                type: 'paybill',
                amount,
                status: 'completed',
                paymentMethod,
                paymentDetails: JSON.stringify(paymentDetails),
                billId
            }, { transaction: t });
        });

        return transaction;
    }

    // Create a PayPal payment
    static async createPayPalPayment(user_id, accountNumber, amount, returnUrl, cancelUrl) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toString(),
                },
            }],
            application_context: {
                return_url: returnUrl,
                cancel_url: cancelUrl,
            }
        });

        const response = await paypalClient().execute(request);
        const order = response.result;

        // Create a transaction with a status "pending" in your database
        const transaction = await transaction.create({
            user_id,
            accountNumber,
            type: 'paypal',
            amount,
            status: 'pending',
            paymentDetails: { transactionId: order.id }, // Use transactionId for consistency
        });

        return order;
    }

    // Capture a PayPal payment
    static async capturePayPalPayment(transactionId) {
        const request = new paypal.orders.OrdersCaptureRequest(transactionId);
        request.requestBody({});

        const capture = await paypalClient().execute(request);
        const captureDetails = capture.result;

        // Find the corresponding transaction record and update its status to "completed"
        const transaction = await transaction.findOne({
            where: { 'paymentDetails.transactionId': transactionId, status: 'pending' }
        });

        if (transaction) {
            transaction.status = 'completed';
            await transaction.save();
        }

        return captureDetails;
    }
    static async cancelTransaction(transactionId) {
    // Example logic to find the transaction and mark it as canceled
    const transaction = await transaction.findByPk(transactionId);
    if (!transaction) throw new Error("Transaction not found.");
    transaction.status = 'canceled'; // Assuming 'status' is a field in your transaction model
    await transaction.save();
    return transaction;
}
static async refundTransaction(transactionId) {
    const transaction = await transaction.findByPk(transactionId);
    if (!transaction) throw new Error("Transaction not found.");

    // Check if it's a PayPal transaction and proceed with PayPal refund API call
    if (transaction.type === 'paypal') {
        const saleId = transaction.paymentDetails.saleId; // Adjust based on your data structure
        const request = new paypal.payments.SaleRefundRequest(saleId);
        request.requestBody({}); // You can specify refund amount and other details here

        const refund = await paypalClient().execute(request);
        return refund.result; // The refund details from PayPal
    } else {
        // Handle refunds for other transaction types as needed
        throw new Error("Refund method for this transaction type is not implemented.");
    }
}

}

module.exports = transactionService;
