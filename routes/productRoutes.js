const {
  getAllProductsAdmin,
} = require("../controllers/admin/productController");
const {
  create,
  update,
  getAllproducts,
  getSingleProduct,
  deleteAproduct,
  addUpdateReview,
  getAllReviews,
  getRelatedProducts,
  categoryWiseProduct,
} = require("../controllers/productController");
const { auth, admin } = require("../middlewares/auth");
const productRoutes = require("express").Router();

productRoutes.get("/products", getAllproducts);
productRoutes.get("/pizza/:id", getSingleProduct);
productRoutes.delete("/product/:id", [auth, admin], deleteAproduct);
productRoutes.post("/product/add/review", [auth], addUpdateReview);
productRoutes.get("/reviews", getAllReviews);
productRoutes.get("/products/related/:id", getRelatedProducts);
productRoutes.get("/products/category/:category", categoryWiseProduct);

// admin
productRoutes.post("/product/add", [auth, admin], create);
productRoutes.put("/product/update/:id", [auth, admin], update);
productRoutes.get("/admin/products", [auth, admin], getAllProductsAdmin);

module.exports = productRoutes;
