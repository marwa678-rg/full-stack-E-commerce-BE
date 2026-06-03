
//Importa
const Joi = require("joi");

//_______________________Create Product Validation________________________
const createProductSchema = Joi.object({
name:Joi.string().min(2).max(100).required(),

description:Joi.string().min(10).required(),

price:Joi.number().positive().required(),

discountPrice:Joi.number().positive().less(Joi.ref("price")),

stock:Joi.number().min(0).required(),

category:Joi.string().required(),

imageCover:Joi.string().required(),

images:Joi.array().items(Joi.string()).default([]),

brand:Joi.string().min(2).max(50).required(),
});

//________________________Update PRODUCT validation________________________
const updateProductSchema =Joi.object({
 name: Joi.string().min(2).max(100),

  description: Joi.string().min(20),

  price: Joi.number().positive(),

  discountPrice:Joi.number().min(0),

  brand: Joi.string().min(2).max(50),

  category: Joi.string(),

  stock: Joi.number().min(0),

  imageCover: Joi.string(),

  images: Joi.array().items(Joi.string()),
}).min(1);//at least one field should be provided for update

module.exports={
  createProductSchema,
  updateProductSchema,
}