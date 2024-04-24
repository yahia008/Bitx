const mongoose = require("mongoose");
const validator = require("validator");

const authschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, "email must b valide"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: true,
  },
  confirmPassword: {
    type: String,
    required: [true, "name is required"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "confirm password must match password",
    },
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  userCreatedAt: {
    type: Date,
    default: new Date(),
  },
  forgotingpassword:String,
  expireforgotingpassword:String
});




const auth = mongoose.model('Auth', authschema)


module.exports=auth