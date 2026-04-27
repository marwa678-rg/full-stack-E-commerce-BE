//imports
const jwt = require("jsonwebtoken");
const dotenv= require("dotenv")

//config
dotenv.config();

//Auth Middleware Validate userLogin in
function authMiddleware(reqest,response,next){
try {
   //validate Headers
  const auth = request.headers["authorization"];
  if(!auth){
    return response.status(401).json({message:"Unauthorized"})
  }
  //validate Token
  const token =auth.split(" ")[1];
  if(!token){
    return response.status(401).json({message:"Unauthorized"})
  }
  //verify token
  const payload=jwt.verify(token,process.env.JWT_SECRET);

  request.user=payload;
} catch (error) {
  console.log(eror);
  response.status(401).json({message:"Unauthorized"})
}
 
}


module.exports={authMiddleware};