const sendmails = require("../email/email");
const asynchandle = require("../errors/asynchandler");
const errorclass = require("../errors/errorclass");
const auth = require("../modals/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const util = require("util");
const { log } = require("console");

const jwttoken = (_id) => {
  return jwt.sign({ _id }, process.env.connect, {
    expiresIn: "3d",
  });
};

const duplicate = (res, status, user) => {
  const token = jwttoken(user._id);
  let obj = {
    maxAge: 600000,
    httpOnly: true,
  };
  if (process.env.JSON_env === "production") {
    obj.secure = true;
  }
  res.cookie("token", token, obj);
  return res.status(status).json({
    success: "success",
    token,
    user,
  });
};

exports.signup = asynchandle(async (req, res, next) => {
  const createNewUser = await auth.create(req.body);

  duplicate(res, 201, createNewUser);
});
exports.getalluser = asynchandle(async (req, res, next) => {
  // req.query.sort = "-userCreatedAt";
  let users = auth.find();
  //const sort = req.query.sort.split(",").join(" ");
  users = users.sort("-userCreatedAt");
  const Allusers = await users;
  res.json({
    Numberofusers: Allusers.length,
    Allusers,
  });
});
exports.getalluserbyid = asynchandle(async (req, res, next) => {
  // req.query.sort = "-userCreatedAt";
  let users = auth.findById(req.params.id);
  //const sort = req.query.sort.split(",").join(" ");
  const user = await users;
  res.json({
    user,
  });
});
exports.changepassword = asynchandle(async (req, res, next) => {
  const user = await auth.findOne({ _id: req.user._id }).select("+password");

  if (!user) {
    return next(new errorclass("u have to b log in to change password", 210));
  }
  if (!req.body.currentPassword) {
    return next(new errorclass("enter current password", 210));
  }
  if (!(await user.comperepassword(req.body.currentPassword, user.password))) {
    return next(new errorclass("wrong password", 210));
  }
  if (!req.body.newpassword || !req.body.confirmNewPassword) {
    return next(new errorclass("newpassword and confirmNewPassword", 210));
  }
  user.password = req.body.newpassword;
  user.confirmPassword = req.body.confirmNewPassword;
  user.passwordchangeAt = Date.now();
  await user.save();
  res.json({
    success: "success",
  });
});

exports.login = asynchandle(async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return next(new errorclass("please enter your email and password", 400));
  }

  const finduser = await auth.findOne({ email }).select("+password");
  if (!finduser) {
    return next(new errorclass("no user with this email found", 400));
  }
  if (!(await finduser.comperepassword(password, finduser.password))) {
    return next(new errorclass("wrong password ", 400));
  }
  duplicate(res, 201, finduser);
});

exports.forgotingpassword = asynchandle(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new errorclass("please insert your email to proceed", 401));
  }
  const finduser = await auth.findOne({ email });
  if (!finduser) {
    return next(new errorclass("no user this email found"));
  }
  const token = await finduser.forpassword();
  await finduser.save({ validateBeforeSave: false });
  let message = `click here to reset  your password \n \n
${req.protocol}://${req.get("host")}/auth/resetpassword/${token} `;

  try {
    await sendmails({
      email: finduser.email,
      subject: "password reset",
      message,
    });
    res.json({
      message: "check yoour email to reset password",
    });
  } catch (error) {
    finduser.forgotingpassword = undefined;
    finduser.expireforgotingpassword = undefined;
    await finduser.save({ validateBeforeSave: false });

    return next(new errorclass("could no be able please try again in a while"));
  }
  //duplicate(res, 201, createNewUser);
});

exports.resetpassword = asynchandle(async (req, res, next) => {
  const hash = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const create = await auth.findOne({
    // forgotingpassword: hash,
    expireforgotingpassword: { $gt: Date.now() },
  });
  console.log(hash);
  if (!create) {
    return next(new errorclass("token has expire"));
  }
  create.forgotingpassword = undefined;
  create.expireforgotingpassword = undefined;
  create.password = req.body.password;
  create.confirmPassword = req.body.confirmPassword;
  create.passwordchangeAt = Date.now();
  await create.save({ validateBeforeSave: false });
  duplicate(res, 201, create);
});
exports.authorize = asynchandle(async (req, res, next) => {
  const authorize = req.cookies.token;
  let head;
  let Authorization = req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    head = Authorization.split(" ")[1];
  }

  if (!authorize && !head) {
    return next(new errorclass("please log in"));
  }
  const verify = await util.promisify(jwt.verify)(
    authorize || head,
    process.env.connect
  );
  const user = await auth.findById(verify._id);
  if (!user) {
    return next(new errorclass("log in again"));
  }
  if (await user.mifi(verify.iat)) {
    return next(new errorclass(" please log in again", 300));
  }
  req.user = user;
  next();
});
exports.getuserbyemail = asynchandle(async (req, res, next) => {
  const { email } = req.body;
  const user = await auth.findOne({ email });
  if (!user) {
    return next(new errorclass("no user found", 404));
  }
  res.json({
    user,
  });
});

exports.role = (role) => {
  return (req, res, next) => {
    if (!req.user.role === "admin") {
      return next(new errorclass("you are not allowed"));
    }
    next();
  };
};
