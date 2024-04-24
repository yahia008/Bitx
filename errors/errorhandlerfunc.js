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
    }
    else {
        res.status(error.status || 300).json({
            status: error.status,
            error:'something went wrong',
          
        })
    } 
}; 
const code = () => {
    const msg = `${error.name || error.email} already exits`
    next(new errorclass(msg,404))
}

module.exports = (error, req, res, next) => {
  if (process.env.JSON_env === "development") {
    dev(error, res);
  }
    if (process.env.JSON_env === "production") {
      if (error.code===11000) error=code(error)
    prod(error, res);
  }
};
