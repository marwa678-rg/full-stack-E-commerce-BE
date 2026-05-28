
const{generate} = require("otp-generator")


function generateOtp (){
  
  //Generate otp + otp expires
const otp = generate(6,{spcialChars:false,digit:true})
const otpExpires= Date.now() + 10*60*1000

return{otp,otpExpires}
}

module.exports={generateOtp}

