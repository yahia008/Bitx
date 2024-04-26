const express = require('express')
const { signup, login, forgotingpassword, resetpassword } = require('../controllers/authController')



const authroute = express.Router()
authroute.route('/signup').post(signup)
authroute.route('/login').post(login)
authroute.route("/forgotingpassword").post(forgotingpassword);
authroute.route("/resetpassword/:token").patch(resetpassword);

module.exports =authroute