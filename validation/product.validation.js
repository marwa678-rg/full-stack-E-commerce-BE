
//Importa
const Joi = require("joi");

//Create Product Validation
const createProductSchema = Joi.object({
name:Joi.string().min(2).max(100).required(),

description:Joi.string().min(10).required(),

price:Joi.number().positive().required(),

stock:Joi.number().min(0).required(),

category:Joi.string().required(),

imageCover:Joi.string().required(),

images:Joi.array().items(Joi.string()).default([]),

brand:Joi.string().min(2).max(50).required(),
});

//Update PRODUCT
const updateProductSchema =Joi.object({
 name: Joi.string().min(2).max(100),

  description: Joi.string().min(20),

  price: Joi.number().positive(),

  brand: Joi.string().min(2).max(50),

  category: Joi.string(),

  stock: Joi.number().min(0),

  imageCover: Joi.string(),

  images: Joi.array().items(Joi.string()),
});

module.exports={
  createProductSchema,
  updateProductSchema,
}