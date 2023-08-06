const Product = require("../../models/product");
const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const Features = require("../../utils/Features");
const productController = {
  async getAllProductsAdmin(req, res, next) {
    try {
      const limit = 6;
      const features = new Features(Product.find(), req.query)
        .loadMore(limit)
        .search(["name", "category"]);

      const products = await features.query;
      const totalProducts = await Product.countDocuments();
      const filteredProductsCount = products.length;
      res.status(200).json({
        success: true,
        products,
        totalProducts,
        filteredProductsCount,
        success: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
module.exports = productController;
