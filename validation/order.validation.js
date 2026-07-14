//Imports
const Joi = require("joi");

//__________create Order Validation_____________
const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().min(2).max(30).required(),
    phoneNumber: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required()
      .messages({ "string.pattern.base": "Invalid phone number" }),
    address: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    notes: Joi.string().max(300).allow("").optional(),
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
