const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'Auth' },
  type:{type:String, enum : ['deposit', 'withdrawal']} 
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;