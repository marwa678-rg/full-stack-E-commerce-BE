
const nodemailer= require("nodemailer")
const dotenv=require("dotenv")

//Global Config
dotenv.config();

//TransporterSeder
const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST_PROVIDER,
    port:process.env.SMTP_PORT,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
});

async function sendMail(to,subject,html){
  try {
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports={sendMail}