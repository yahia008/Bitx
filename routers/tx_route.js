const express = require('express')
const bank_trf = require('../transactions/bank_transfer')

 const tx_route = express.Router()

 tx_route.route('/bank_transfer').post(bank_trf)

 module.exports =tx_route