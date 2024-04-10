const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

const wishlistController = {
    async addItemToWishlist(req, res, next) {
        try {
            const productId = req.params.id;
            let wishlist = await Wishlist.findOne({ userId: req.user._id });

            if (!wishlist) {
                wishlist = new Wishlist({
                    userId: req.user._id,
                    items: [],
                });
            }

            wishlist.items.push({
                product: productId,
            });

            await wishlist.save();

            res.status(200).json({
                success: true,
                message: "Product added to wishlist",
            });
        } catch (error) {
            console.log(error);
            return next(CustomErrorHandler.serverError("Something went wrong"));
        }
    },
    async removeItemFromWishlist(req, res, next) {
        try {
            const productId = req.params.id;
            let wishlist = await Wishlist.findOne({ userId: req.user._id });
            if (wishlist) {
                wishlist.items = wishlist.items.filter(
                    (item) => item.product.toString() !== productId.toString()
                );
                await wishlist.save();
            }
            res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
            });
        } catch (error) {
            console.log(error);
            return next(CustomErrorHandler.serverError("Something went wrong"));
        }
    },
    async getWishlist(req, res, next) {
        const user = req.user._id;
        try {
            let wishlist = await Wishlist.findOne({ userId: user }).populate(
                "items.product"
            );
            res.status(200).json({ wishlist });
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = wishlistController;
