//Imports
const Joi = require("joi");


//_______________Add to Cart Validation______________
const addToCartSchema = Joi.object({
  productId :Joi.string().required(),
  quantity:Joi.number().integer().min(1).default(1),

});




module.exports={
  addToCartSchema,
}