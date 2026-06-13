//Imports
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, min: 1, default: 1, required: true },

        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    shippingAddress: {
      fullName: { type: String, required: true, minLength: 2, maxLength: 30 },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
