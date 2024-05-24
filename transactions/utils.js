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
      for (user of users )
        {
            if (user.balance < 5000)
                return;
        }
      const  update_balance = 0.03 * user.balance

        user.balance += update_balance
        await user.save()
        console.log('User balances updated successfully.')

    }catch(error){
        console.error('Error updating user balances:', error);
    }
}
   
 module.exports ={
    generateTxRef,
    charges,
    updateBalance

 }