const Product = require("../models/product");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const Features = require("../utils/Features");
const productController = {
  async getAllproducts(req, res, next) {
    try {
      const totalProducts = await Product.countDocuments();
      const features = new Features(Product.find(), req.query)
        .search(["name", "category", "description"])
        .filter();

      let products = await features.query;

      let filteredProductCount = products.length;

      products = await features.query.clone();

      res.status(200).json({ products, totalProducts, filteredProductCount });
    } catch (error) {
      console.log(error);
    }
  },

  async getSingleProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      res.status(200).json({ product });
    } catch (error) {
      console.log(error);
    }
  },

  async getRelatedProducts(req, res, next) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }
      const relatedProducts = await Product.find({
        _id: { $ne: productId },
        category: { $in: product.category },
      }).limit(5);

      res.status(200).json({ relatedProducts });
    } catch (error) {
      console.log(error);
      return next(new Error("Something went wrong"));
    }
  },
  async deleteAproduct(req, res, next) {
    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      await Product.findByIdAndRemove(req.params.id);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  },

  async addUpdateReview(req, res, next) {
    try {
      const { id, comment, rating } = req.body;

      if (!comment || !rating || !id) {
        return next(
          CustomErrorHandler.badRequest("Please provide comment and rating")
        );
      }

      const name = `${req.user.firstname} ${req.user.lastname}`;
      const review = {
        user: req.user._id,
        name,
        rating: Number(rating),
        comment,
      };

      const product = await Product.findById(id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      const isReviewed = await product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.addedAt = Date.now();
          }
        });
      } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }

      let avg = 0;

      product.ratings = product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ runValidators: false });

      res.status(200).json({ message: "Review added successfully" });
    } catch (error) {
      console.log(error);
    }
  },
  async getAllReviews(req, res, next) {
    try {
      const product = await Product.findById(req.query.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }

      res.status(200).json({ reviews: product.reviews });
    } catch (error) {
      console.log(error);
    }
  },
  async categoryWiseProduct(req, res, next) {
    try {
      const { category } = req.params;
      const categoryName = category.split("-").join(" ");

      const products = await Product.find({
        category: {
          $regex: new RegExp(categoryName, "i"),
        },
      });
      if (!products) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }

      res.status(200).json({ products, success: true });
    } catch (error) {
      console.log(error);
      return next(new Error("Something went wrong"));
    }
  },
  async getSoftDrinksandDesserts(req, res, next) {
    try {
      const products = await Product.find({
        $or: [
          { category: { $regex: "savory", $options: "i" } },
          { category: { $regex: "sweet", $options: "i" } },
        ],
      });
      if (!products) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }
      res.status(200).json({ products, success: true });
    } catch (error) {
      console.log(error);
      return next(new Error("Something went wrong"));
    }
  },
};
module.exports = productController;
