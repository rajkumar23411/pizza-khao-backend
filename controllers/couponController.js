const Coupon = require("../models/coupon");
const Order = require("../models/order");
const Cart = require("../models/cart");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const couponController = {
    // 1. Check coupon code is available or not
    // 2. Check coupon code is already used or not
    // 3. If coupon code is welcome40 then check user's order history
    // 4. If user's order history is empty then apply coupon code
    // 5. If user's order history is not empty then return error message
    // 6. If coupon code is not welcome40 then check further steps
    async validateCoupon(req, res, next) {
        try {
            const { code } = req.body;
            const user = req.user._id;

            if (!code) {
                return next(
                    CustomErrorHandler.badRequest(
                        "Please provide a coupon code"
                    )
                );
            }
            const coupon = await Coupon.findOne({ code: code }).lean();
            if (!coupon) {
                return next(
                    CustomErrorHandler.badRequest("Invalid coupon code")
                );
            }
            if (code === "welcome50") {
                const userOrder = await Order.find({ userId: user });
                if (userOrder) {
                    return next(
                        CustomErrorHandler.badRequest(
                            "You are not eligible for this coupon code"
                        )
                    );
                }
            }
            if (!coupon.activeTo > Date.now()) {
                return next(
                    CustomErrorHandler.wrongCredentials(
                        "Coupon code is expired"
                    )
                );
            }
            // find the cart for this user
            const cart = await Cart.findOne({ userId: user });
            if (cart.totalPrice < coupon.minOrderAmount) {
                return next(
                    CustomErrorHandler.badRequest(
                        "Please add more items to apply this coupon code"
                    )
                );
            }
            cart.coupon = coupon._id;
            const discountAmount = (cart.totalPrice * coupon.discount) / 100;
            const discount = coupon.discount;
            await cart.save();
            return res.status(200).json({
                success: true,
                discount,
                discountAmount,
            });
        } catch (error) {
            console.log(error);
            return next(CustomErrorHandler.serverError());
        }
    },
    async removeCoupon(req, res, next) {
        try {
            const user = req.user._id;

            const cart = await Cart.findOne({ userId: user });

            if (!cart) {
                return next(CustomErrorHandler.notFound("Cart not found"));
            }

            if (!cart.coupon) {
                return next(
                    CustomErrorHandler.badRequest("No coupons are applied")
                );
            }

            const coupon = await Coupon.findById(cart.coupon);

            cart.coupon = undefined;
            cart.totalPrice += (cart.totalPrice * coupon.discount) / 100;

            await cart.save();

            res.status(200).json({
                success: true,
                msg: "Coupon removed successfully",
            });
        } catch (error) {
            console.log(error);
        }
    },
};
module.exports = couponController;
