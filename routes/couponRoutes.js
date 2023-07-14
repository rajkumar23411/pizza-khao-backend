const couponController = require("../controllers/couponController");
const { auth, admin } = require("../middlewares/auth");

const couponRoutes = require("express").Router();

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

module.exports = couponRoutes;
