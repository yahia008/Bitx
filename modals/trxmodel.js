const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  user: { type: String, ref: 'Auth', required: true, index: true },
  type:{type:String, enum : ['deposit', 'withdrawal']},
  bank_name:{type:String},
  account_number:{type:String},
  phone_number:{type:String},
  status: { type: String, default: 'pending' },
  verified: { type: Boolean, default: false },
  account_name:{type:String}
  
  
  
  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;