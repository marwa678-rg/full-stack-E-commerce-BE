//Imports
const express = require("express");
const dotenv = require("dotenv");
const {default:rateLimit} =require("express-rate-limit")
const cors = require("cors")
const path = require("path")
//Internal Imports
const { connectToDatabase } = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productsRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
//Global CONFIG
dotenv.config();

//APP
 const app = express();
//Global Middleware
app.use(express.json());


//Multer Middleware
app.use("/uploads",express.static(path.join(__dirname,"public","uploads")));

//CORS
app.use(cors({
  origin:JSON.parse(process.env.PRODUCTION_ENV)?
  process.env.CLIENT_ORIGIN :"*"
}));


//RateLimit
const limiter = rateLimit({
  windowMs:15*60*1000,
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
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/cart",cartRoutes);
app.use("/api/v1/order",orderRoutes);
//Connect To Cloud
connectToDatabase();

//Run Server
app.listen(PORT,function(){
  
  console.log(`SERVER RUNNING @ PORT : ${PORT}`)
});