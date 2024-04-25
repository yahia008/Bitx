const errorclass = require("./errorclass");

const dev = (error, res) => {
  res.status(error.status || 300).json({
    status: error.status,
    error, 
    stacktarce: error.stack,
  });
};
const prod = (error, res) => {
  if (error.isoperational) {
    res.status(error.status || 300).json({
        status: error.status,
        error: error.message,
      });
    } else {
      res.status(error.status || 300).json({
        status: error.status,
        error: "something went wrong",
      });
    } 
}; 
const code = () => {
    const msg = `${error.name || error.email} already exits`
  return new errorclass(msg, 404);
}
const duplicate = (error) => {
  const greg=Object.values(error.errors).map(err=>err.message).join(',')
  const msg = `missing vaildations : ${greg}`;
  return new errorclass(msg, 404)
};

module.exports = (error, req, res, next) => {
  if (process.env.JSON_env === "development") {
    dev(error, res);
  }

    if (process.env.JSON_env === "production") {
      if (error.code===11000) error=code(error)
      if (error.name === "ValidationError") error = duplicate(error);
    prod(error, res);
  }
};
