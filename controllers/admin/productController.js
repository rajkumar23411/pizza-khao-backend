const Product = require("../../models/product");
const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const Features = require("../../utils/Features");
const productController = {
    async create(req, res, next) {
        try {
            const {
                name,
                regularPrice,
                mediumPrice,
                largePrice,
                extraLargePrice,
                discount,
                category,
                description,
                image,
            } = req.body;
            if (
                !name ||
                !regularPrice ||
                !mediumPrice ||
                !largePrice ||
                !extraLargePrice ||
                !category ||
                !description ||
                !image
            ) {
                return next(
                    CustomErrorHandler.required("All fields are required")
                );
            }

            const product = await Product.find();
            const isProductExists = await product.find(
                (prod) => prod.name === name
            );

            if (isProductExists) {
                return next(
                    CustomErrorHandler.AlreadyExists(
                        "A product with this name already exists"
                    )
                );
            }

            const createdProduct = await Product.create({
                name,
                prices: {
                    regular: regularPrice,
                    medium: mediumPrice,
                    large: largePrice,
                    extralarge: extraLargePrice,
                },
                discount,
                description,
                category,
                image,
                user: req.user._id,
            });

            res.status(200).json({ createdProduct });
        } catch (Err) {
            console.log("The Error is: " + Err);
        }
    },
    async update(req, res, next) {
        try {
            const {
                name,
                regularPrice,
                mediumPrice,
                largePrice,
                extraLargePrice,
                discount,
                category,
                description,
                image,
            } = req.body;
            const updatedProduct = {
                name,
                prices: {
                    regular: regularPrice,
                    medium: mediumPrice,
                    large: largePrice,
                    extralarge: extraLargePrice,
                },
                discount,
                description,
                category,
                image,
            };

            const product = await Product.findByIdAndUpdate(
                req.params.id,
                updatedProduct,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!product) {
                return next(CustomErrorHandler.notFound("Product not found"));
            }

            res.status(201).json({
                message: "Product updated",
                success: true,
                product,
            });
        } catch (error) {
            console.error(error);
        }
    },
    async deleteProduct(req, res, next) {
        try {
            console.log(req.query);
            const { id } = req.query;

            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                return next(CustomErrorHandler.notFound("Product not found"));
            }
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error(error);
            CustomErrorHandler.serverError();
        }
    },
    async getAllProductsAdmin(req, res, next) {
        try {
            const { limit } = req.query;
            const totalProducts = await Product.countDocuments();
            const apiFeature = new Features(Product.find(), req.query)
                .search(["name", "category"])
                .filter();

            let products = await apiFeature.query;
            let filteredProductsCount = products.length;
            apiFeature.pagination(+limit);
            products = await apiFeature.query.clone();
            const perPageProductCount = products.length;
            res.status(200).json({
                success: true,
                products,
                totalProducts,
                filteredProductsCount,
                perPageProductCount,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
};
module.exports = productController;
