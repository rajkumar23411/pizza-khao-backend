const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const Order = require("../models/order");
const Cart = require("../models/cart");
const orderController = {
  async newOrder(req, res, next) {
    try {
      const {
        addressId,
        items,
        itemsPrice,
        tax,
        deliveryCharge,
        totalAmount,
        paymentMode,
        paymentInfo,
      } = req.body;

      const userId = req.user._id;

      const order = await Order.create({
        userId,
        addressId,
        items,
        itemsPrice,
        tax,
        deliveryCharge,
        totalAmount,
        paymentMode,
        paymentInfo,
      });

      const cart = await Cart.findOne({ userId });
      cart.items = [];
      await cart.save();

      res.status(201).json({ order, success: true });
    } catch (error) {
      console.log(error);
    }
  },

  async getSingleOrder(req, res, next) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("addressId")
        .populate("userId", "firstname lastname contact email");

      res.status(200).json({ order });
    } catch (Error) {
      console.log(Error);
    }
  },

  async getMyOrders(req, res, next) {
    const userId = req.user._id;
    const order = await Order.find({ userId })
      .populate(
        "items.productId",
        "-__v -createdAt -updatedAt -numOfReviews -category -description -ratings -reviews -user"
      )
      .populate("addressId", "-_id -__v -createdAt -updatedAt -userId");

    if (!order) {
      return next(CustomErrorHandler.notFound("No order found"));
    }

    res.status(200).json({ order });
  },
};

module.exports = orderController;
