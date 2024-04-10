const Product = require("../../models/product");
const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const Features = require("../../utils/Features");
const upload = require("../../middlewares/multer.middleware");
const cloudinaryServices = require("../../utils/cloudinary.services");
const productController = {
    async create(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return next(err);
                }
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
                    } = req.body;
                    const filePath = req.file.path;
                    if (
                        !name ||
                        !regularPrice ||
                        !mediumPrice ||
                        !largePrice ||
                        !extraLargePrice ||
                        !category ||
                        !description
                    ) {
                        return next(
                            CustomErrorHandler.required(
                                "All fields are required"
                            )
                        );
                    }

                    if (!filePath) {
                        return next(
                            CustomErrorHandler.required(
                                "Product image is required"
                            )
                        );
                    }
                    const product = await Product.find();
                    const isProductExists = product.find(
                        (prod) => prod.name === name
                    );
                    if (isProductExists) {
                        return next(
                            CustomErrorHandler.AlreadyExists(
                                "A product with this name already exists"
                            )
                        );
                    }
                    const imageUrl = await cloudinaryServices.upload(filePath);
                    const productToCreate = {
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
                        image: imageUrl,
                        user: req.user._id,
                    };
                    await Product.create(productToCreate);
                    res.status(200).json({
                        success: true,
                        message: "Product created",
                    });
                } catch (error) {
                    return next(error);
                }
            });
        } catch (error) {
            console.log("Error while creating product", error.message);
            return next(CustomErrorHandler.serverError());
        }
    },
    async update(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return next(err);
                }
                const {
                    name,
                    regularPrice,
                    mediumPrice,
                    largePrice,
                    extraLargePrice,
                    discount,
                    category,
                    description,
                } = req.body;
                const product = await Product.findById(req.params.id);

                if (!product) {
                    return next(
                        CustomErrorHandler.notFound("Product not found")
                    );
                }
                // if along with the request the file does not comes
                product.name = name;
                product.prices = {
                    regular: regularPrice,
                    medium: mediumPrice,
                    large: largePrice,
                    extralarge: extraLargePrice,
                };
                product.discount = discount;
                product.description = description;
                product.category = category;
                // if along with the request file comes
                if (req.file) {
                    const filePath = req.file.path;
                    const imageUrl = await cloudinaryServices.upload(filePath);
                    product.image = imageUrl;
                }
                const updatedProduct = await product.save();
                res.status(200).json({
                    success: true,
                    message: "Product updated",
                    updatedProduct,
                });
            });
        } catch (error) {
            console.log("error while updating product", error);
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
            next(CustomErrorHandler.serverError());
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
