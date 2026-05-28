
//Imports
const Joi = require("joi");


//RegisterSchema
const registerSchema = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(6).required(),
  name:Joi.string().min(6).max(30).required(),
});

//VerifySchema
const verifySchema=Joi.object({
  email:Joi.string().email().required(),
  otp:Joi.string().length(6).required(),
});
//LOGIN
const loginSchema=Joi.object({
  email:Joi.string().email().required(),
   password:Joi.string().min(6).required(),
});

//Resend OTP
const resendOtpSchema = Joi.object({
  email:Joi.string().email().required(),
});
//Forgot password
const forgotPasswordSchema=Joi.object({
  email:Joi.string().email().required(),
});

//Reset password
const resetPasswordSchema= Joi.object({
  token:Joi.string().required(),
  newPassword:Joi.string().min(6).required(),
});




module.exports={
  registerSchema,
  verifySchema,
  loginSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
}