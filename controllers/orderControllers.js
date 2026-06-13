//Internal Imports

const { Product } = require("../models/Products");
const { Cart } = require("../models/Cart");
const { Order } = require("../models/Order");
const { createOrderSchema } = require("../validation/order.validation");
//_________________User Dashboard_____________________

//Create Order
async function createOrder(request, response) {
  try {
    //validation
    const { error, value } = createOrderSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return response
        .status(400)
        .json({ messages: error.details.map((e) => e.message) });
    }
    //Extract DATA
    const { shippingAddress, paymentMethod } = value;

    //get userId
    const userId = request.user.userId;

    //Get UserCart
    const cart = await Cart.findOne({ user: userId });
    //Check Cart EXist
    if (!cart) {
      return response.status(404).json({ message: "Cart Not Found" });
    }
    //Check Cart Not Empty
    if (cart.items.length === 0) {
      return response.status(400).json({ message: "Cart Is Empty" });
    }

    //________________check stock___________

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      //check product existence
      if (!product) {
        return response.status(404).json({ message: "Product Not Found" });
      }
      //check stock && quantity
      if (item.quantity > product.stock) {
        return response.status(400).json({
          message: "Not enough stock available",
        });
      }
    }

    //create orser && save
    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
    });

    // Decrease stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      product.stock -= item.quantity;

      await product.save();
    }

    //Empty the cart &&  Save
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return response
      .status(201)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//Get My Orders
async function getMyOrders(request, response) {
  try {
    //Get UserId
    const userId = request.user.userId;

    const orders = await Order.find({ user: userId }).populate("items.product");

    if (!orders.length === 0) {
      return response.status(404).json({ message: "No Orders Found" });
    }

    return response
      .status(200)
      .json({ message: "Orders Sent Successfully", orders });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//Get Order By Id
async function getMyOrderById(request, response) {
  try {
    //get userId
    const userId = request.user.userId;
    const { orderId } = request.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return response.status(404).json({ message: "Order Not Found" });
    }

    return response
      .status(200)
      .json({ message: "You Order Sent Successfully", order });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}



//__________________Admin Dashboard___________________

//get All Orders
async function getAllOrders(request, response) {}
//get One Order
async function getOrderById(request, response) {}
//Update Order Status
async function updateOrderStatus(request, response) {}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  

  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
