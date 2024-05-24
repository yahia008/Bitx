const express = require('express')
const {bank_trf, ussd_trf} = require('../transactions/bank_transfer')
const {withdrawal} = require('../transactions/withdrawal')




 const tx_route = express.Router()

 tx_route.route('/bank_transfer').post(bank_trf)
 tx_route.route('/ussd_transfer').post(ussd_trf)
 tx_route.route('/withdrawal').post(withdrawal)

 module.exports =tx_route