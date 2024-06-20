// const Flutterwave = require('flutterwave-node-v3');
// const {generateTxRef} = require('./utils');
// const Authmodel = require('../modals/auth')
// const tx_model = require('../modals/trxmodel')



// const flw = new Flutterwave('FLWPUBK_TEST-5907fd36a224f71106cda5667a587223-X', 'FLWSECK_TEST-ef622e80fd8b4d3b5faa236d56294a77-X');



// const bank_trf = async (req, res) => {
//     const {email, amount, phone_number} = req.body
//     const tx_ref = generateTxRef()
//  try
//  {
//     const user_balance = await Authmodel.findOne({email})
//     if(!user_balance)
//         {
//             return res.status(404).json({ message: 'User not found' }); 
//         }


//     const payload = {
//         "tx_ref": tx_ref, // tx_ref it a random number
//         "amount": amount,
//         "email": email,
//         "phone_number": phone_number,
//         "currency": "NGN",

//       }

//  const data = await flw.Charge.bank_transfer(payload);  //making the api request 
//         if (data.status == 'success')
//             {
               
//                     user_balance.balance += amount
//                     await user_balance.save({validateBeforeSave:false})
//                     const user_tx = new  tx_model({user:user_balance._id, email, amount,  phone_number, type: 'deposit'})
//                     await user_tx.save({validateBeforeSave: false})
//                     console.log(user_tx)

//             }
//          // then update the ballance

//       res.status(200).json(data)
      

//     }catch(error){
//         if (error.name === 'validationError') {
//             res.status(400).json({ error: error.message });
//         } else {
//             // Handle other errors
//             console.error('Error initiating bank transfer:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }

     
// }
// };

// const ussd_trf = async (req, res) => {
//   const { email, amount, phone_number } = req.body;

//   const tx_ref = generateTxRef();
//   try {
//     user_balance = await Authmodel.findOne({ email });
//     if (!user_balance) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const payload = {
//       tx_ref: tx_ref, // tx_ref it a random number
//       amount: amount,
//       email: email,
//       phone_number: phone_number,
//       currency: "NGN",
//     };

//     const data = await flw.Charge.ussd(payload);

//     if (data.status == "success") {
//       user_balance.balance += amount;
//       await user_balance.save();
//       user_tx = new tx_model({ email, amount, phone_number, type: "deposit" });
//       await user_tx.save();
//     }
//     res.status(200).json(data);
//   } catch (error) {
//     if (error.name === "validationError") {
//       res.status(400).json({ error: error.message });
//     } else {
//       // Handle other errors
//       console.error("Error initiating bank transfer:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// };

// const trx = async(req, res)=> {
//   const {email} = req.body
//  const user = await Authmodel.findOne({email});
//   const tr = await tx_model.find({user:user._id})
//   if (!tr) {
//     console.log('No transaction found for user:');
//   } 
//   console.log("them")
//   console.log(tr)
//   return res.status(200).json(tr)
  
//   } 

// module.exports = {
//   bank_trf,
//   ussd_trf,
//   trx
// };


