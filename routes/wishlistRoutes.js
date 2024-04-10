const {
    addItemToWishlist,
    removeItemFromWishlist,
    getWishlist,
} = require("../controllers/wishlistController");
const { auth } = require("../middlewares/auth");

const wishlistRoutes = require("express").Router();

wishlistRoutes.post("/wishlist/add/:id", [auth], addItemToWishlist);
wishlistRoutes.post("/wishlist/remove/:id", [auth], removeItemFromWishlist);
wishlistRoutes.get("/my-wishlist", [auth], getWishlist);

module.exports = wishlistRoutes;
