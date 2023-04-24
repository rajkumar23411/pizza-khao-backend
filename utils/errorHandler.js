const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",
    ...(process.env.DEBUG_MODE === "true" && { originalMessage: err.message }),
  };

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  // wrong mongodb id error
  if (err.name === "CastError") {
    statusCode = 400;
    data = {
      message: "Resource not found. Invalid: " + err.path,
    };
  }

  // validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    data = {
      message: err.message,
    };
  }

  // duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    data = {
      message: "Duplicate " + Object.keys(err.keyValue) + " entered",
    };
  }

  // jwt error
  if (err.name === "JsonWebTokenError") {
    statusCode = 400;
    data = {
      message: "Invalid Token",
    };
  }

  // jwt expired error
  if (err.name === "TokenExpiredError") {
    statusCode = 400;
    data = {
      message: "Token Expired",
    };
  }

  // mongodb server timeout error
  if (err.name === "MongoNetworkError") {
    statusCode = 500;
    data = {
      message: "Request Timeout",
    };

    if ((err.name = "MongoServerSelectionError")) {
      statusCode = 500;
      data = {
        message: "Request timeout. Please check your internet connectivity.",
      };
    }
  }

  return res.status(statusCode).json(data);
};

module.exports = errorHandler;
