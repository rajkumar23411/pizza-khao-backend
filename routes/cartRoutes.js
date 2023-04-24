const {
  addToCart,
  deleteFromCart,
  getCartItems,
  updateCart,
} = require("../controllers/cartController");
const { auth } = require("../middlewares/auth");

const cartRoutes = require("express").Router();

cartRoutes.post("/add_to_cart", [auth], addToCart);
cartRoutes.get("/my/cart", [auth], getCartItems);
cartRoutes.put("/cart/update", [auth], updateCart);
cartRoutes.delete("/cart/delete/:id", [auth], deleteFromCart);

module.exports = cartRoutes;
