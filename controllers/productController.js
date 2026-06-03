
//Imports
const { createProductSchema } = require("../validation/product.validation");
const {Product}= require("../models/Products");






//create Product
async function createProduct(request,response){
try{
  //userData
  const userId = request.user.userId;
  //validation
  const {value,error}= createProductSchema.validate(request.body,{abortEarly:false,});
  if(error){
    return response.status(400).json({messages:error.details.map((e)=>e.message)});
  }
 
  //create Product
  const product = await Product.create({...value,createdBy:userId})
response.status(201).json({message:"Product Created Successfully",product})
}
catch(error){
console.log(error);
return response.status(500).json({message:"Internal Server Error"})
}
}

//get all Products
async function getAllProducts(request,response){}


//get single Product
async function getProduct(request,response){}

//update Product
async function updateProduct(request,response){}

//delete Prouct
async function deleteProduct(request,response){}

module.exports={
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}