const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true, index: true },
  type:{type:String, enum : ['deposit', 'withdrawal']},
  bank_name:{type:String},
  account_number:{type:String},
  phone_number:{type:String},
  
  
  
  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;