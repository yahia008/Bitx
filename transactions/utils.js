const crypto = require('crypto');
const Authmodel = require('../modals/auth')


const generateTxRef = () => {
    const bytes = crypto.randomBytes(7);
    return bytes.toString('hex').substring(0, 6);
    }

const charges = (amount) => {
    return 10/100 * amount
}

const updateBalance = async () => {
    try{
      const users = await Authmodel.find()
      for (const user of users )
        {
            if (user.balance < 5000){
                continue;
            }
                


            const  update_balance = 0.03 * user.balance

            user.balance += update_balance
            await user.save()
            
        }
     
        
        console.log('User balances updated successfully.')

    }catch(error){
        console.error('Error updating user balances:', error);
    }
}

const checkWithdraw = async (email) => {
    const user = await Authmodel.findOne({email})
    const lastTrx = user.date
    const now = Date.now()

    if(!lastTrx){

        return true
    }
    const oneday = 24 * 60 * 60 * 1000
    return (now - lastTrx) >= oneday 
}
   
 module.exports ={
    generateTxRef,
    charges,
    updateBalance,
    checkWithdraw,

 }