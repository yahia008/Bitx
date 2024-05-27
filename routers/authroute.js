const express = require("express");
const {
  signup,
  login,
  forgotingpassword,
  resetpassword,
  authorize,
  changepassword,
  role,
  getalluser,
  getalluserbyid,
  getuserbyemail,
} = require("../controllers/authController");

const authroute = express.Router();
authroute.route("/signup").post(signup);
authroute.route("/login").post(login);
authroute.route("/forgotingpassword").post(forgotingpassword);
authroute.route("/resetpassword/:token").patch(resetpassword);
<<<<<<< HEAD
authroute.route("/changepassword").patch(authorize,changepassword);
authroute.route("/getall").get(authorize,role('admin'),getalluser);
authroute.route("/getalluser/:id").get(authorize,role('admin'),getalluserbyid);
=======
authroute.route("/changepassword").patch(authorize, changepassword);
authroute.route("/getalluser").get(authorize, role("admin"), getalluser);
authroute
  .route("/findbyemail")
  .get(authorize, role("admin"), getuserbyemail);
authroute.route("/getuser/:id").get(authorize, role("admin"), getalluserbyid);
>>>>>>> e6170d844332b394c74421f5d92cfc204fe5edcc

module.exports = authroute;
