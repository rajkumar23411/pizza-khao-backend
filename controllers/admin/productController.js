const Product = require("../../models/product");
const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const productController = {
  //   async getAllProducts(req, res, next) {
  //     try {
  //       const products = await Product.find();
  //       const totalProducts = await Product.countDocuments();
  //       res.status(200).json({ products, totalProducts });
  //     } catch (error) {
  //       console.log(error);
  //       return CustomErrorHandler.serverError("Something went wrong");
  //     }
  //   },
};
module.exports = productController;
