//Imports
const express = require("express");
const dotenv = require("dotenv");
const {default:rateLimit} =require("express-rate-limit")
const cors = require("cors")
//Internal Imports
const { connectToDatabase } = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes")
//Global CONFIG
dotenv.config();

//APP
 const app = express();
//Global Middleware
app.use(express.json());

app.use(cors({
  origin:JSON.parse(process.env.PRODUCTION_ENV)?
  process.env.CLIENT_ORIGIN :"*"
}));


//RateLimit
const limiter = rateLimit({
  windowMs:15*1000*60,
  limit:100,
})
app.use(limiter);


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