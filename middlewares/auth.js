const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("./CustomErrorHandler");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
    const { _pizza_k } = req.cookies;

    if (!_pizza_k) {
        return next(CustomErrorHandler.unAuthorized("You are not authorized"));
    }

    const { _id } = await jwt.verify(_pizza_k, process.env.JWT_SECRET);

    req.user = await User.findById(_id);

    next();
};

exports.admin = async (req, res, next) => {
    if (req.user.role.toString() !== "admin") {
        return next(
            CustomErrorHandler.unAuthorized("You are not authorized to do this")
        );
    }

    next();
};
