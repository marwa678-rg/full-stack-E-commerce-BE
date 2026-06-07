//Imports
const { Cart } = require("../models/Cart");
const { Product } = require("../models/Products");
const { addToCartSchema } = require("../validation/cart.validation");

//__________________Add to Cart_______________
async function addToCart(request, response) {
  try {
    const userId = request.user.userId;

    //Validate data
    const { value, error } = addToCartSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return response
        .status(400)
        .json({ messages: error.details.map((e) => e.message) });
    }

    //Extract Data
    const { productId, quantity } = value;

    //Check Product
    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).json({ message: " Product Not Found" });
    }

    //check stock
    if (quantity > product.stock) {
      return response
        .status(400)
        .json({ message: "Not enough stock available" });
    }

    //Find User Card
    let cart = await Cart.findOne({ user: userId });

    // Final price
    const finalPrice =
      product.discountPrice > 0 ?
       product.discountPrice 
      : product.price;



    //create cart if not found
    if (!cart) {
      const totalPrice = finalPrice * quantity ;


      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
        totalPrice,
      });

      return response.status(201).json({
        message: "Product Added To Cart",
        cart,
      });
    }

    //Check if Product already exist in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }
    //update totalPrice
    cart.totalPrice += finalPrice * quantity;

    //save cart DB
    await cart.save();

    return response
      .status(200)
      .json({ message: "Cart updated Successfully", cart });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//__________________get My Cart_________________
async function getMyCart(request, response) {}

//_________________update Cart Item Quantity____________
async function updateItemQuantity(request, response) {}

//_________________Remove Item From Cart___________
async function removeFromCart(request, response) {}

//_________________Clear Cart___________
async function clearCart(request, response) {}

module.exports = {
  addToCart,
  getMyCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
};
