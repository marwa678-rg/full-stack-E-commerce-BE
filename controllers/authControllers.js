const { registerSchema, forgotPasswordSchema, verifySchema, resendOtpSchema, loginSchema, resetPasswordSchema } = require("../validation/user.validation")
const{User}=require("../models/User")
const{generateOtp}=require("../utils/otpGenerator")
const {sendMail}= require("../utils/sendMail")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");


//TODo:Register
async function register(request,response){
  try {
    //validate data
    const {error,value}= registerSchema.validate(request.body,{abortEarly:false,})
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)})
    }
    //extract data
    const {email,password,name}=value;
    //check user
    const userExisting= await User.findOne({email});
    if(userExisting){
      return response.status(400).json({message:"Email Already Exist"})
    }
    //Hash Password
    const hashPassword = await bcrypt.hash(password,12)
    //generate OTP + OTPexpires
    const {otp,otpExpires}= generateOtp();
    //create user
    const user = await User.create({
      name,
      password:hashPassword,
      email,
      otp,
      otpExpires,

    });


    //send mail
    await sendMail(
      email,
      "otpCode",
      `Your Otp is : ${otp}`
    );

    response.status(201).json({message:"OTP send to you Email"})

  } catch (error) {
    console.log(error)
    response.status(500).json({message:"Internal Server Error"})
  }
}

//TODO:verify otp
async function verifyOtp(request,response){
  try {
    //validate
    const {error,value}= verifySchema.validate(request.body,{abortEarly:false,});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)});

    }
    //Extraact data
    const{email,otp}=value;
    //validate user
    const user = await User.findOne({email});
    if(!user){
      return response.status(400).json({message:"Invalid Email"});

    }
    if(user.otp !== otp || user.otpExpires < Date.now()){
      return response.status(400).json({message:"Invalid Otp or Expired Otp"})
    }
    //verify
    user.isVerified = true;
    //clear
    user.otp = undefined;
    user.otpExpires = undefined;
    //save
    await user.save();
    response.status(200).json({message:"Account Verified Successfully"});
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}
//TODO:resend Otp
async function resendOtp(request,response){
  try {
    //validate
    const{error,value}= resendOtpSchema.validate(request.body,{abortEarly:false,});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)});
    }
    //Extract data
    const{email}=value;
    //validate user
    const user = await User.findOne({email});
    if(!user){
      return response.status(400).json({message:"This Email is Not Related to user"})
    }
    //check verification
    if(user.isVerified){
      return response.status(400).json({message:"User is Already verified"})
    }
    // limit resend otp
    if(user.otpRequestCount >=2){
      return response.status(400).json({message:"OTP Limit reached , Try Again Later..."})
    }
    //generate otp + otp expires
    const{otp,otpExpires}= generateOtp();
    // update user
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpRequestCount += 1;
    await user.save();
    //send mail
    await sendMail(email,"New Otp Code",`Your New Otp Code is : ${otp}`); 
    response.status(200).json({message:"New otp send Successfully ",count:user.otpRequestCount})
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal server error"})
  }
}

//TODO:login
async function login(request,response){
  try {
    //validate
    const {error,value}=loginSchema.validate(request.body,{abortEarly:false,});
    if(error){
      return response.status(400).json({messages:error.details.map((e)=>e.message)})
    }
    //Extract Data 
    const {email,password}=value;
    const user = await User.findOne({email});
    //validate user
    if(!user){
      return response.status(400).json({message:"Invalid Email or Password"})
    }
    //compare password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return response.status(400).json({message:"Invalid Email or Password"})
    }
    //check verification
    if(!user.isVerified){
      return response.status(403).json({message:"Account not verified yet",
        isVerified:false,
        email:user.email,
      });
      

    }
//generate Token
const token = jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});

response.json({message:"loggedin Sucessfully",token,user:{
  userId:user._id,
  name:user.name,
  email:user.email,
  role:user.role,
}})
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}
//TODO:Get my info\
async function myInfo(request,response){
  try {
    //extract from request
    const userId = request.user.userId;
    //avoid return pass & otp
    const user = await User.findById(userId).select("-password -otp -otpExpires -otpRequestCount");
    //check user
    if(!user){
      return response.status(404).json({message:"User Not Found"})
    }
    response.status(200).json(user);
  } catch (error) {
     console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}
//Forgot password
async function forgotPassword(request,response){
  try {
    //validate data
    const{error,value}=forgotPasswordSchema.validate(request.body,{abortEarly:false,});
    if(error){
      return response.status(400).json({message:error.message});
    }
    //Extract Data
    const{email}= value;
    const user = await User.findOne({email});
    if(!user){
      return response.status(400).json({message:"This Email Not Related to User"})
    }
    //generate token
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 10*60*1000;

    //update user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    //origin front  + reset password url
    const resetUrl = `${process.env.CLIENT_ORIGIN}/resetPassword/${resetPasswordToken}`;
    //send mail
    await sendMail(email, "reset password ", `<p>Click the button below to reset your password :</p>
      <a href="${resetPassword}"  style="display:inline-block;
      padding:10px 16px;
      background:#7c3aed;
      color:#fff;
      text-decoration:none;
      border-radius:6px;
      font-weight:bold
      ">Reset Password </a>`);
      response.json({message:"Reset password link to your Mail"})
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
  }
}
//resetPassword
async function resetPassword(request,response){
try {
  const{error,value}= resetPasswordSchema.validate(request.body,{abortEarly:false,});
  if(error){
    return response.status(400).json({messages:error.details.map((e)=>e.message)})
  }
  //extract Data
  const {token,newPassword}= value;
  console.log("NOW:", new Date());
  //validate token
  const user = await User.findOne({
    resetPasswordToken:token,
    resetPasswordExpires:{$gt:Date.now()}
  });
  console.log("TOKEN FROM BODY:", token);
  console.log("USER:", user);
  if(!user){
    return response.status(400).json({message:"Invalid Token or Expired"})
  }
  //hash new passsword
  const password = await bcrypt.hash(newPassword,12);
  //update user
  user.password=password;
  user.resetPasswordToken= undefined;
  user.resetPasswordExpires=undefined;
  await user.save();
  response.json({message:"password changed successfully"})
} catch (error) {
   console.log(error);
    response.status(500).json({message:"Internal Server Error"});
}
}


module.exports={
  register,
  verifyOtp,
  resendOtp,
  login,
  myInfo,
  forgotPassword,
  resetPassword,
}