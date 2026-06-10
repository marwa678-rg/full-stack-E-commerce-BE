//Imports
const { Cart } = require("../models/Cart");
const { Product } = require("../models/Products");
const {
  addToCartSchema,
  updateItemSchema,
} = require("../validation/cart.validation");

//__________________Add to Cart_______________
async function addToCart(request, response) {
  try {
    const userId = request.user.userId;

    // Validate data
    const { value, error } = addToCartSchema.validate(request.body, {
      abortEarly: false,
    });

    if (error) {
      return response.status(400).json({
        messages: error.details.map((e) => e.message),
      });
    }

    // Extract Data
    const { productId, quantity } = value;

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
      return response.status(404).json({
        message: "Product Not Found",
      });
    }

    // Check Stock
    if (quantity > product.stock) {
      return response.status(400).json({
        message: "Not enough stock available",
      });
    }

    // Find User Cart
    let cart = await Cart.findOne({
      user: userId,
    });

    // Final Price
    const finalPrice =
      product.discountPrice > 0 ? product.discountPrice : product.price;

    // Create Cart if not exists
    if (!cart) {
      const totalPrice = finalPrice * quantity;

      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            priceAtPurchase: finalPrice,
          },
        ],
        totalPrice,
      });

      return response.status(201).json({
        message: "Product Added To Cart",
        cart,
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return response.status(400).json({
          message: "Not enough stock available",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtPurchase: finalPrice,
      });
    }

    // Recalculate Total Price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.priceAtPurchase * item.quantity,
      0,
    );

    // Save Cart
    await cart.save();

    return response.status(200).json({
      message: "Cart Updated Successfully",
      cart,
    });
  } catch (error) {
    console.log(error);

    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
}

//__________________get My Cart_________________
async function getMyCart(request, response) {
  try {
    //check user
    const userId = request.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price discountPrice imageCover stock",
    );
    if (!cart) {
      return response.status(404).json({ message: "No Cart Found" });
    }
    return response.status(200).json({ cart });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//_________________update Cart Item Quantity____________
async function updateItemQuantity(request, response) {
  try {
    const userId = request.user.userId;
    const { itemId } = request.params;

    //validation
    const { error, value } = updateItemSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return response
        .status(400)
        .json({ messages: error.details.map((e) => e.message) });
    }
    //Extract Data
    const { quantity } = value;

    //check user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return response.status(404).json({ message: "Cart not found" });
    }

    //check product exiting
    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      return response.status(404).json({ message: "Cart Item Not Found" });
    }

    //get product stock
    const product = await Product.findById(item.product);
    if (!product) {
      return response.status(404).json({ message: "Product Not Found" });
    }

    //check stock and quantity
    if (product.stock < quantity) {
      return response
        .status(400)
        .json({ message: "Not enough stock available" });
    }

    //update quantity
    item.quantity = quantity;

    //update total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.priceAtPurchase * item.quantity,
      0,
    );

    //Save
    await cart.save();
    return response
      .status(200)
      .json({ message: "Item  Quantity Updated Sucessfully", cart });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//_________________Remove Item From Cart___________
async function removeFromCart(request, response) {
  try {
    const userId = request.user.userId;
    const { itemId } = request.params;
    //check user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return response.status(404).json({ message: "Cart not found" });
    }

    //check product exiting
    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      return response.status(404).json({ message: "Cart Item Not Found" });
    }

    //remove Item
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    //Update totalPrice
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.priceAtPurchase * item.quantity,
      0,
    );
    //Save
    await cart.save();
    return response
      .status(200)
      .json({ message: "Item Removed Successfully", cart });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Server Internal Error" });
  }
}

//_________________Clear Cart___________
async function clearCart(request, response) {
  try {
    const userId = request.user.userId;
    //check user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return response.status(404).json({ message: "Cart not found" });
    }

    //clear Items in Cart
    cart.items = [];
    cart.totalPrice = 0;

    //save
    await cart.save();

    return response
      .status(200)
      .json({ message: "Cart Cleared Successfully", cart });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addToCart,
  getMyCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
};
