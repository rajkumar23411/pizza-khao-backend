const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const Coupon = require("../../models/coupon");
const Features = require("../../utils/Features");

const couponController = {
  async create(req, res, next) {
    try {
      const {
        name,
        code,
        discount,
        activeFrom,
        activeTo,
        status,
        minOrderAmount,
        description,
      } = req.body;
      if (
        !name ||
        !code ||
        !discount ||
        !activeFrom ||
        !activeTo ||
        !status ||
        !minOrderAmount
      ) {
        return next(CustomErrorHandler.required("All fields are require"));
      }

      const newCoupon = await Coupon.create({
        name,
        code,
        discount,
        activeFrom,
        activeTo,
        status,
        minOrderAmount,
        description,
      });

      res
        .status(201)
        .json({ newCoupon, success: true, msg: "Coupon added successfully" });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },
  async update(req, res, next) {
    try {
      const {
        name,
        code,
        discount,
        activeFrom,
        activeTo,
        status,
        minOrderAmount,
        description,
      } = req.body;

      await Coupon.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name,
          code,
          discount,
          activeFrom,
          activeTo,
          status,
          minOrderAmount,
          description,
        },
        { new: true }
      );
      res
        .status(200)
        .json({ success: true, msg: "Coupon updated successfully" });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return next(CustomErrorHandler.notFound("Coupon not found"));
      }
      await coupon.deleteOne();
      res
        .status(200)
        .json({ success: true, msg: "Coupon deleted successfully" });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },

  async getAllCoupons(req, res, next) {
    try {
      const features = new Features(Coupon.find(), req.query).search([
        "name",
        "code",
      ]);

      const couponCounts = await Coupon.countDocuments();
      const coupons = await features.query;
      const activeCoupons = await Coupon.find({ status: "active" });

      res.status(200).json({ coupons, couponCounts, activeCoupons });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },

  async chnageCouponStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return next(CustomErrorHandler.required("Status is required"));
      }
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) {
        return next(CustomErrorHandler.notFound());
      }
      coupon.status = status;
      await coupon.save();
      res.status(200).json({ success: true, msg: "Coupon status updated" });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },
  async getCouponById(req, res, next) {
    try {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) {
        return next(CustomErrorHandler.notFound());
      }
      res.status(200).json({ coupon });
    } catch (error) {
      console.log(error);
      return next(CustomErrorHandler.serverError());
    }
  },
};

module.exports = couponController;
