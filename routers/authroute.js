const express = require('express')
const { signup, login, forgotingpassword, resetpassword, authorize, changepassword, role, getalluser, getalluserbyid } = require('../controllers/authController')



const authroute = express.Router()
authroute.route('/signup').post(signup)
authroute.route("/login").post(login);
authroute.route("/forgotingpassword").post(forgotingpassword);
authroute.route("/resetpassword/:token").patch(resetpassword);
authroute.route("/changepassword").patch(authorize,changepassword);
authroute.route("/getalluser").get(authorize,role('admin'),getalluser);
authroute.route("/getalluser/:id").get(authorize,role('admin'),getalluserbyid);


module.exports =authroute