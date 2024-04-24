process.on('uncaughtException', (error) => {
  console.log(error.name, error.message);
  
    process.exit(1);
  
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');


dotenv.config({path:'./BitX.env'})
const app = express();
mongoose
  .connect(process.env.connect)
  .then((err) => console.log("good👍"))
  .catch((err) => console.log("bad👎")); 

let applis = app.listen(3000, () => {});
//console.log(new Date);
process.on("unhandledRejection", (error) => { 
  console.log(error.name, error.message);
  applis.close(() => {
    process.exit(1);
  });
});
