const {
  create,
  update,
  getAllproducts,
  getSingleProduct,
  deleteAproduct,
  addUpdateReview,
  getAllReviews,
  getRelatedProducts,
} = require("../controllers/productController");
const { auth, admin } = require("../middlewares/auth");
const productRoutes = require("express").Router();

productRoutes.post("/product/add", [auth, admin], create);
productRoutes.put("/product/update/:id", [auth, admin], update);
productRoutes.get("/products", getAllproducts);
productRoutes.get("/pizza/:id", getSingleProduct);
productRoutes.delete("/product/:id", [auth, admin], deleteAproduct);
productRoutes.post("/product/add/review", [auth], addUpdateReview);
productRoutes.get("/reviews", getAllReviews);
productRoutes.get("/products/related/:id", getRelatedProducts);
module.exports = productRoutes;
