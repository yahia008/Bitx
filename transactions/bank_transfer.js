const Flutterwave = require('flutterwave-node-v3');
const generateTxRef = require('./utils');
const auth = require('../modals/auth');

const flw = new Flutterwave('FLWPUBK_TEST-5907fd36a224f71106cda5667a587223-X', 'FLWSECK_TEST-ef622e80fd8b4d3b5faa236d56294a77-X');



const bank_trf = async (req, res) => {
    const {email, amount, phone_number} = req.body
    const tx_ref = generateTxRef()
 try
 {


    const payload = {
        "tx_ref": tx_ref, // tx_ref it a random number
        "amount": amount,
        "email": email,
        "phone_number": phone_number,
        "currency": "NGN",

      }

   let data = await flw.Charge.bank_transfer(payload);  //making the api request 
     if (data) {
         const bal = await auth.findOne({ email: payload.email })
         bal.balance = bal.balance + payload.amount 
         bal.save({validateBeforeSave:false})
         
}
        
      res.status(200).json(data)
      

    }catch(error){
        if (error.name === 'validationError') {
            res.status(400).json({ error: error.message });
        } else {
            // Handle other errors
            console.error('Error initiating bank transfer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    
}

const ussd_trf = async (req, res) => {
    const {email, amount, phone_number} = req.body

    const tx_ref = generateTxRef()
    try
    {
   
   
       const payload = {
           "tx_ref": tx_ref, // tx_ref it a random number
           "amount": amount,
           "email": email,
           "phone_number": phone_number,
           "currency": "NGN",
   
         }

         const data = await flw.Charge.ussd(payload)
         if (data) {
           const bal = await auth.findOne({ email: payload.email });
           bal.balance = bal.balance + payload.amount;
           bal.save({ validateBeforeSave: false });
         } 
        res.status(200).json(data)

        }catch(error){
            if (error.name === 'validationError') {
                res.status(400).json({ error: error.message });
            } else {
                // Handle other errors
                console.error('Error initiating bank transfer:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }   


}
module.exports = bank_trf