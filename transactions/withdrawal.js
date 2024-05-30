const Authmodel = require('../modals/auth')
const tx_model = require('../modals/trxmodel')
const {checkWithdraw, charges} = require('./utils')




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
        if (amount > 30000)
            {
                return res.status(400).json({message:'you have reach your withdraw limit'})
            }

            

            const canWithdraw = await checkWithdraw(user.email)

            if (canWithdraw){

                
                const charge = charges(amount) 
                user.balance -= amount + charge 
                await user.save();
                
           const user_tx = new  tx_model({user:user._id, email, amount, bank_name,  account_number, type: 'withdrawal'})
            await user_tx.save()


            return res.status(200).json({ message: 'Withdrawal successful', newbalance: user.balance});
        // 

            }else{
                res.status(400).json({message:'Withdrawal not allowed, last transaction was within the last 24 hours'})
            }

            
        
    }catch(error){
        console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = {
    withdrawal
}