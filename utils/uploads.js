
//Imports
const multer= require("multer");

const storage = multer.diskStorage({
  destination:(request,file,cb)=>{
    cb(null,"public/uploads")
  },
  filename:(request,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)
  }
});


module.exports=multer({storage})