const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    select: false,
    minlength: 4,
  },
  //confirmPassword: {
  //type: String,
  //required: [true, "confirmPassword is required"],
  //validate: {
  //validator: function (value) {
  //return value === this.password;
  //},
  //message: "confirm password must match password",
  //},
  //},
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  userCreatedAt: {
    type: Date,
    default: new Date(),
  },
  forgotingpassword: Number,
  expireforgotingpassword: String,
  passwordchangeAt: Date,
});

authschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

authschema.methods.comperepassword = async function (password, dbpassword) {
  return await bcrypt.compare(password, dbpassword);
};
authschema.methods.forpassword = async function () {
  const reset = Math.floor(Math.random() * 10111);
  const time = Date.now();
  this.forgotingpassword = reset;
  this.expireforgotingpassword = time+3600000;
  console.log(this.expireforgotingpassword);
  console.log(time < this.expireforgotingpassword);
  return reset;
};
authschema.methods.mifi = function (iat) {
  if (this.password) {
    const change = parseInt(this.passwordchangeAt / 1000, 10);
    return iat < change;
  }
  return false;
};

const auth = mongoose.model("Auth", authschema);

module.exports = auth;
