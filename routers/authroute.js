const express = require('express')
const { signup } = require('../controllers/authController')



const authroute = express.Router()
authroute.route('/signup').post(signup)

module.exports =authroute