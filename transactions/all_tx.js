const asynchandle = require("../errors/asynchandler");
const Transaction = require("../modals/trxmodel");

exports.getalltx = asynchandle(async (req, res, next) => {
  let emm = req.user.id;
  let user = await Transaction.find({ user: emm });
  //user = user.sort("-date");
  //const data = await user; 
  res.status(200).json({
    message: "success",
    user,
  });
});
exports.gettx = asynchandle(async (req, res, next) => {
  const user = await Transaction.find({ _id: req.params.id });
  res.status(200).json({
    message: "success",
    Transaction: user,
  });
});
