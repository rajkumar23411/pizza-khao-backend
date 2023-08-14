const couponController = require("../controllers/admin/couponController");
const { auth, admin } = require("../middlewares/auth");
const couponRoutes = require("express").Router();
const {
    validateCoupon,
    removeCoupon,
} = require("../controllers/couponController");
couponRoutes.post("/coupon/create", [auth, admin], couponController.create);
couponRoutes.post("/coupon/update/:id", [auth, admin], couponController.update);
couponRoutes.delete(
    "/coupon/delete/:id",
    [auth, admin],
    couponController.delete
);
couponRoutes.post(
    "/coupon/status/:id",
    [auth, admin],
    couponController.chnageCouponStatus
);
couponRoutes.get("/coupon/all", couponController.getAllCoupons);
couponRoutes.post("/coupon/validate", auth, validateCoupon);
couponRoutes.post("/coupon/remove", auth, removeCoupon);
module.exports = couponRoutes;
