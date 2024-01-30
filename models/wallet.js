const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactionHistory: [
    {
      transaction: {
        type: String,
        enum: ['Credited', 'Debited'],
      },
      amount: {
        type: Number,
      },
    },
  ],
  orders: [
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orders',
        },
        totalAmount: {
            type: Number,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        // You can add more fields as per your requirement
    },
],
});

walletSchema.methods.returnAmountToWallet = function (amount) {

  if (amount <= 0) {
    throw new Error('Invalid amount for returning to wallet');
  }


  this.balance += amount;


  this.transactionHistory.push({
    transaction: 'Credited',
    amount: amount,
  });


  return this.save();0.
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
