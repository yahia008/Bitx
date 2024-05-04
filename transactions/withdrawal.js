const Authmodel = require('../modals/auth')
const tx_model = require('../modals/trxmodel')




const withdrawal = async(req, res) => {
  
    const {email, amount, bank_name, account_number} = req.body

    try{
        const user = await Authmodel.findOne({email})

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        if (amount > user.balance){
            return res.status(400).json({message:'insufficient funds'})
        }
        user.balance -= amount

        await user.save();
      user_tx = new  tx_model({email, amount, bank_name, account_name, type: 'withdrawal'})
      await usert_tx.save()


    return res.status(200).json({ message: 'Withdrawal successful' });
        // 
    }catch(error){
        console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }

}