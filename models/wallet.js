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
        enum: ['Money Added', 'Money Deducted'],
      },
      amount: {
        type: Number,
      },
    },
  ],
});

walletSchema.methods.returnAmountToWallet = function (amount) {

  if (amount <= 0) {
    throw new Error('Invalid amount for returning to wallet');
  }


  this.balance += amount;


  this.transactionHistory.push({
    transaction: 'Money Added',
    amount: amount,
  });


  return this.save();
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
