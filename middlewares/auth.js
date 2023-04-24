const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("./CustomErrorHandler");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(CustomErrorHandler.unAuthorized("You are not authorized"));
  }

  const { _id, role } = await jwt.verify(token, process.env.JWT_SECRET);

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
