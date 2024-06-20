const Authmodel = require('../modals/auth')
const tx_model = require('../modals/trxmodel')
const Admin = require("../modals/admin")
const sendmails = require("../email/email");
const {generateTxRef} = require('./utils');

const bank_payment = async (req, res) => {
    const {email, account_name, bank_name, amount, phone_number} = req.body

    if (!email || !account_name || !bank_name || !amount || !phone_number) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
       const user = await Authmodel.findOne({email})
       if(!user)
        {
            return res.status(404).json({ message: 'User not found' }); 
        }
        
        const user_tx = new tx_model({user:user._id, type:'deposit', bank_name, account_name, amount, phone_number})
      await user_tx.save()
            try {
              await sendmails({
                email: "yahyatijjani99@gmail.com",
                subject: "withdrawal",
                message: JSON.stringify({
                  id: user._id,
                  amount,
                  bank_name,
                  transactionId: user_tx._id,
                  account_name,
                }
                ),
              });

                res.status(200).json(user_tx)
              //
            } catch (error) {
              return res.send("something went wrong");
            }
         
    } catch (error) {
      console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }


}


const verifyPaymentAndUpdateBalance = async (req, res) => {
     const { transactionId, email } = req.body;

     try {
       // Validate input
         if (!transactionId || !email) {
             return res.status(400).json({ message: 'Transaction ID and Admin ID are required' });
        }

        // Check if the admin exists and is authorized (implement your own admin check logic)
        const admin = await Admin.findOne({email}); // Assuming you have an AdminModel
        if (!admin || !admin.isAuthorized) {
            return res.status(403).json({ message: 'Admin not authorized' });
       }

        // Find the transaction
       const transaction = await tx_model.findById(transactionId).populate('user');
       if (!transaction) {
           return res.status(404).json({ message: 'Transaction not found' });
      }

       // Check if the transaction is already verified
       if (transaction.verified) {
            return res.status(400).json({ message: 'Transaction already verified' });
       }

        // Mark the transaction as verified and update the user's balance
        transaction.verified = true;
         transaction.status = 'completed';
       await transaction.save();

       const user = transaction.user;
       user.balance += transaction.amount;
         await user.save();

         return res.status(200).json({ message: 'Transaction verified and balance updated', transaction });

     } catch (error) {
       console.error('Error verifying payment:', error);
       return res.status(500).json({ message: 'Internal Server Error' });
    }
 };

module.exports = {
    bank_payment,
    verifyPaymentAndUpdateBalance,
    
}