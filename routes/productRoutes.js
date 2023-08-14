const productController = require("../controllers/admin/productController");

const {
    getAllproducts,
    getSingleProduct,
    deleteAproduct,
    addUpdateReview,
    getAllReviews,
    getRelatedProducts,
    categoryWiseProduct,
    getSoftDrinksandDesserts,
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
productRoutes.get("/products/complementry", getSoftDrinksandDesserts);

// admin
productRoutes.post("/product/add", [auth, admin], productController.create);
productRoutes.put(
    "/admin/product/update/:id",
    [auth, admin],
    productController.update
);
productRoutes.get(
    "/admin/products",
    [auth, admin],
    productController.getAllProductsAdmin
);
productRoutes.delete(
    "/admin/product/delete",
    [auth, admin],
    productController.deleteProduct
);

module.exports = productRoutes;
