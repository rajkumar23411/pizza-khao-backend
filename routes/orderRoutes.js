const {
  newOrder,
  getSingleOrder,
  getMyOrders,
} = require("../controllers/orderController");

const {
  getAllOrder,
  getSingleOrderAdmin,
  deleteOrder,
  updateOrderStatus,
} = require("../controllers/admin/orderController");

const { auth, admin } = require("../middlewares/auth");

const orderRoutes = require("express").Router();

orderRoutes.post("/order/create", [auth], newOrder);
orderRoutes.get("/order/:id", [auth], getSingleOrder);
orderRoutes.get("/my/orders", [auth], getMyOrders);

// admin
orderRoutes.get("/admin/orders", [auth, admin], getAllOrder);
orderRoutes.get("/admin/order/:id", [auth, admin], getSingleOrderAdmin);
orderRoutes.post("/admin/order/delete", [auth, admin], deleteOrder);
orderRoutes.post("/order/update/:id", [auth, admin], updateOrderStatus);

module.exports = orderRoutes;
