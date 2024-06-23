const express = require("express");
const {
  bank_payment,
  verifyPaymentAndUpdateBalance,
} = require("../transactions/bank_payment");
const {updateBalance} = require('../transactions/utils')
//const { bank_trf, ussd_trf, trx } = require("../transactions/bank_transfer");
const { withdrawal } = require("../transactions/withdrawal");
const { getalltx, gettx, novex } = require("../transactions/all_tx");
const { authorize } = require("../controllers/authController");

const tx_route = express.Router();
tx_route.route("/bank_payment").post(bank_payment);
tx_route.route("/verify").post(verifyPaymentAndUpdateBalance);

tx_route.route("/gettx/:id").get(gettx);
tx_route.route("/novex").get(authorize,novex);
tx_route.route("/update_balance").get(updateBalance);

//tx_route.route("/bank_transfer").post(bank_trf);
//tx_route.route("/ussd_transfer").post(ussd_trf);
//tx_route.route("/trx").post(trx);
tx_route.route("/withdrawal").post(withdrawal);

module.exports = tx_route;
