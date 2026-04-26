//Imports
const express = require("express");
const dotenv = require("dotenv");
const { prototype } = require("nodemailer/lib/dkim");

//CONFIG
dotenv.config();


 const app = express();


 const PORT = process.env.PORT || 3000;

//Main Route
app.get("/",(req,res)=>{
  res.send("Welcome To Our BackEnd")
})

app.listen(PORT,function(){
  console.log(`SERVER RUNNING @ PORT : ${PORT}`)
});