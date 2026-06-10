//IMPORTS
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, min: 1, default: 1 },

        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
