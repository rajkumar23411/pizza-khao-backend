const Order = require("../../models/order");
const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const orderController = {
  async getAllOrder(req, res, next) {
    try {
      const order = await Order.find()
        .populate("addressId")
        .populate("userId", "firstname lastname email")
        .populate("items.productId", "name");
      const totalOrders = await Order.countDocuments();
      const totalAmount = order.reduce((acc, order) => {
        return acc + order.totalAmount;
      }, 0);
      const totalItemSold = order.reduce((acc, order) => {
        return (
          acc +
          order.items.reduce((acc, item) => {
            return acc + item.quantity;
          }, 0)
        );
      }, 0);
      res.status(200).json({
        order,
        totalOrders,
        totalAmount,
        totalItemSold,
      });
    } catch (Error) {
      console.log(Error);
    }
  },
  async getSingleOrderAdmin(req, res, next) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("addressId")
        .populate("userId", "firstname lastname email")
        .populate("items.productId", "name prices");
      if (!order) {
        return CustomErrorHandler.notFound("Order not found");
      }
      res.status(200).json({ order });
    } catch (Error) {
      console.log(Error);
      return CustomErrorHandler.serverError();
    }
  },
  async updateOrderStatus(req, res, next) {
    try {
      const order = await Order.findById(req.params.id).populate(
        "userId",
        "firstname lastname email"
      );

      if (!order) {
        return next(CustomErrorHandler.notFound("No order found"));
      }

      if (order.orderStatus === "Delivered") {
        return next(
          CustomErrorHandler.badRequest("You have already delivered this order")
        );
      }

      if (req.body.status === "Shipped") {
        order.shippedAt = Date.now();
      }

      order.orderStatus = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
      }

      await order.save();

      res.status(200).json({ success: true, message: "Order status updated" });
    } catch (err) {
      console.log(err);
    }
  },
  async deleteOrder(req, res, next) {
    try {
      const { id } = req.body;
      const order = await Order.findById(id);

      if (!order) {
        return next(CustomErrorHandler.notFound("No order found"));
      }
      await order.deleteOne();
      res.status(200).json({ success: true, message: "Order deleted" });
    } catch (err) {
      console.log(err);
      CustomErrorHandler.serverError("Something went wrong");
    }
  },
};

module.exports = orderController;
