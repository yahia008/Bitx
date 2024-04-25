const express = require('express')
const { signup, login } = require('../controllers/authController')



const authroute = express.Router()
authroute.route('/signup').post(signup)
authroute.route('/login').post(login)

module.exports =authroute