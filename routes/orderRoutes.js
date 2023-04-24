const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { auth, admin } = require("../middlewares/auth");

const orderRoutes = require("express").Router();

orderRoutes.post("/order/create", [auth], newOrder);
orderRoutes.get("/order/:id", [auth], getSingleOrder);
orderRoutes.get("/my/orders", [auth], getMyOrders);
orderRoutes.put("/order/update/:id", [auth, admin], updateOrderStatus);

module.exports = orderRoutes;
