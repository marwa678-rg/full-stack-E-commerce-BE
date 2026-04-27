//Imports
const express = require("express");
const dotenv = require("dotenv");
//Internal Imports
const { connectToDatabase } = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes")
//Global CONFIG
dotenv.config();

//APP
 const app = express();


 const PORT = process.env.PORT || 3000;

//Main Route
app.get("/",(req,res)=>{
  res.send("Welcome To Our BackEnd")
});

//API Routes
app.use("/api/v1/auth",authRoutes)

//Connect To Cloud
connectToDatabase();

//Run Server
app.listen(PORT,function(){
  
  console.log(`SERVER RUNNING @ PORT : ${PORT}`)
});