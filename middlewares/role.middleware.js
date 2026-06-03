
//check user role
function roleMiddleware(...roles){
  return(request,response,next)=>{
    const userRole = request.user.role;
    if(!userRole || !roles.includes(userRole)){
      return response.status(401).json({message:"UnAuthorized"})
    }
    next();
  }
}

module.exports={roleMiddleware}