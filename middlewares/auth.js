const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("./CustomErrorHandler");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(CustomErrorHandler.unAuthorized("You are not authorized."));
    }

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(_id);

        if (!user) {
            return next(CustomErrorHandler.unAuthorized("User not found."));
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return next(
            CustomErrorHandler.unAuthorized("Invalid or expired token")
        );
    }
};

exports.admin = async (req, res, next) => {
    if (req.user.role.toString() !== "admin") {
        return next(
            CustomErrorHandler.unAuthorized("You are not authorized to do this")
        );
    }

    next();
};
