//Imports
const Joi = require("joi");

//__________create Order Validation_____________
const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().min(2).max(30).required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().min(5).max(200).required(),
  }).required(),

  paymentMethod: Joi.string().valid("cash", "card").default("cash"),
});

//______________update orderStatus________________
const updateOrderSchema = Joi.object({
  orderStatus: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
