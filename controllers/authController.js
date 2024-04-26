const sendmails = require("../email/email");
const asynchandle = require("../errors/asynchandler");
const errorclass = require("../errors/errorclass");
const auth = require("../modals/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const jwttoken = (_id) => {
  return jwt.sign({ _id }, process.env.connect, {
    expiresIn: "3d",
  });
};

const duplicate = (res, status, user) => {
  const token = jwttoken(user._id);
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
    return next(new errorclass("no user with this email found", 400));
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
  console.log(message);
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
  const hash =await crypto
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
  await create.save({ validateBeforeSave: false });
  duplicate(res, 201, create); 
   
});
