const asynchandle = require("../errors/asynchandler");
const Transaction = require("../modals/trxmodel");

exports.getalltx = asynchandle(async (req, res, next) => {
    let emm = req.user.id 
    const user = await Transaction.find({ user: emm });
  res.status(200).json({
    success: "success",
    user,
  });
});
