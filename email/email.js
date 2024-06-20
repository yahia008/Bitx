const nodemailer = require("nodemailer");
const sendmails = async (options) => {
  const transport = nodemailer.createTransport({
    // service: "smtp.gmail.com",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.emailadd,
      pass: process.env.password,
    },
  });

  const mailOptions = {
    from: "<BitX trading platform>",
    to: options.email,
    subject: options.subject, 
    text: options.message,
  };
  await transport.sendMail(mailOptions);
};
 
module.exports = sendmails;
  