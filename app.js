process.on('uncaughtException', (error) => {
  console.log(error.name, error.message);
  
    process.exit(1);
  
});

const express = require("express");
const mongoose = require("mongoose");
const cp = require("cookie-parser");
const dotenv = require('dotenv');
const errorhandlerfunc = require("./errors/errorhandlerfunc");
const errorclass = require("./errors/errorclass");
const authroute = require("./routers/authroute");
const tx_route = require("./routers/tx_route")
const {updateBalance} = require("./transactions/utils")

dotenv.config({path:'./BitX.env'})
const app = express();
app.use(express.json()) 
app.use(cp()) 
app.use('/auth',authroute)
app.use('/transaction', tx_route)


app.all("*", (req,res,next) => {
    return next (new errorclass('wrong route'))
})
app.use(errorhandlerfunc) 
mongoose
  .connect(process.env.connect)
  .then((err) => console.log("good👍"))
  .catch((err) => console.log("bad👎")); 

setInterval(updateBalance, 24 * 60 * 60 * 1000)
  
const port = process.env.PORT || 3000

let applis = app.listen(port, () => {});
//console.log(new Date);
process.on("unhandledRejection", (error) => { 
  console.log(error.name, error.message);
  applis.close(() => {
    process.exit(1);
  });
}); 
