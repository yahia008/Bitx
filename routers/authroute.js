const express = require('express')



const authroute = express.Router()
authroute.route('/signup').post()

module.exports =authroute