const crypto = require('crypto');
const Authmodel = require('../modals/auth')
const tx_model = require('../modals/trxmodel')


const generateTxRef = () => {
    const bytes = crypto.randomBytes(7);
    return bytes.toString('hex').substring(0, 6);
    }

const charges = (amount) => {
    return 2.4/100 * amount
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
            if (newBalance < 0) {
                throw new Error('Insufficient balance');
              }
          

            user.balance += update_balance
            await user.save()
            
        }
     
        
        //console.log('User balances updated successfully.')

    }catch(error){
        console.error('Error updating user balances:', error);
    }
}

const checkWithdraw = async (email) => {
    const user = await Authmodel.findOne({email})

    if (!user) {
    throw new Error('User not found');
  }
const lastTrx = await  tx_model.find({ user: user._id, type: 'withdrawal' }).sort({ date: -1 }).limit(1).exec();
    
  if(lastTrx.length === 0){
      return true
    }

    const lastTrxTime = new Date(lastTrx[0].date).getTime();
    const lastTrxType = lastTrx[0].type;
    const oneday = 24 * 60 * 60 * 1000
    const now = Date.now()

  if (lastTrxType === 'withdrawal' && (now - lastTrxTime) < oneday) {
      //console.log('Withdrawal not allowed, last transaction was within the last 24 hours');
      return false;
  }

  //console.log(true)
    
    return true
}


   
 module.exports ={
    generateTxRef,
    charges,
    updateBalance,
    checkWithdraw,

 }