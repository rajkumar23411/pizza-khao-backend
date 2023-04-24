const {
  getWishlist,
  addRemoveWishlist,
} = require("../controllers/wishlistController");
const { auth } = require("../middlewares/auth");

const wishlistRoutes = require("express").Router();

wishlistRoutes.post("/wishlist/:id", [auth], addRemoveWishlist);
wishlistRoutes.get("/my-wishlist", [auth], getWishlist);

module.exports = wishlistRoutes;
