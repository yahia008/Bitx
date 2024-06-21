const express = require("express");
const { admin_reg } = require("../controllers/admin");
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
const { getalltx } = require("../transactions/all_tx");

const authroute = express.Router();
authroute.route("/admin").post(admin_reg);
authroute.route("/signup").post(signup);
authroute.route("/login").post(login);
authroute.route("/forgotingpassword").post(forgotingpassword);
authroute.route("/resetpassword/").post(resetpassword);
authroute.route("/changepassword").post(authorize, changepassword);
authroute.route("/getall").get(authorize, role("admin"), getalluser);

authroute
  .route("/getalluser/:id")
  .get(authorize, role("admin"), getalluserbyid);
authroute.route("/changepassword").patch(authorize, changepassword);
authroute.route("/getalluser").get(authorize, role("admin"), getalluser);
authroute.route("/findbyemail").get(authorize, role("admin"), getuserbyemail);
authroute.route("/getuser/:id").get(authorize, role("admin"), getalluserbyid);

module.exports = authroute;
