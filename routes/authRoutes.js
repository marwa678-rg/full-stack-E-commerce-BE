//Imports
const express = require("express");


//Internal Imports
const {authMiddleware}=require("../middlewares/auth.middleware")
const{register,login,verifyOtp,resendOtp,myInfo,forgotPassword,resetPassword}=require("../controllers/authControllers")


const router = express.Router();

//Register
router.post("/register",register)

//verify-otp
router.post("/verify-otp",verifyOtp)

//Resend Otp
router.post("/resendOtp",resendOtp)

//get My info
router.get("/myInfo",authMiddleware,myInfo)

//Forgot Password
router.post("/forgotPassword",forgotPassword)
//resetPassword
router.post("/resetPassword",resetPassword)


module.exports=router;