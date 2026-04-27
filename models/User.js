//Imports
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  //____________________Auth_________________________
  email:{type:String,unique:true, required:true},
  password:{type:String,required:true},
  role:{type:String,required:true,enum:["user","admin","super_admin"],default:"user"},

  //_____________________________Profile_________________
  name:{type:String,required:true,minLength:2,maxLength:30},


//______________Verification_____________________
  otp:{type:String,maxLength:6},
  otpExpires:{type:Date},
  isVerify:{type:Boolean,default:false},
  otpRequestCount:{type:Number,default:0},
//_____Password__________
resetPasswordToken:{type:String},
resetPasswordExpires:{type:Date},

});



const User = mongoose.model("User",userSchema)

module.exports={User}

