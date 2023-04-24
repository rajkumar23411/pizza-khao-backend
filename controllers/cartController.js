const Cart = require("../models/cart");
const Product = require("../models/product");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");

const cartController = {
  async addToCart(req, res, next) {
    const { productId, quantity, size } = req.body;
    try {
      if (!productId || !quantity || !size) {
        return next(CustomErrorHandler.required("Please provide all fields"));
      }

      let cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        cart = new Cart({
          userId: req.user._id,
          items: [],
          totalPrice: 0,
        });
      }

      // check the item already exists or not
      const isItemExists = cart.items.find(
        (item) => item.product.toString() === productId.toString()
      );

      if (isItemExists) {
        return next(
          CustomErrorHandler.AlreadyExists(
            "Product already exists in your cart"
          )
        );
      } else {
        cart.items.push({ product: productId, quantity, size });
      }

      await cart.save();

      res.status(200).json({ cart, success: true });
    } catch (error) {
      console.log(error);
    }
  },
  async updateCart(req, res, next) {
    const { id, quantity, size } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        return next(CustomErrorHandler.notFound("Cart not found"));
      }

      const cartItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === id.toString()
      );

      if (cartItemIndex === -1) {
        console.log("Hello");
        return next(
          CustomErrorHandler.notFound("Product not found in the cart")
        );
      } else {
        cart.items[cartItemIndex].quantity = quantity;
        cart.items[cartItemIndex].size = size;
        await cart.save();
        res.status(200).json({ cart, success: true });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async deleteFromCart(req, res, next) {
    try {
      const product = req.params.id;
      if (!product) {
        return next(CustomErrorHandler.required("Please provide product id"));
      }

      const cart = await Cart.findOne({ userId: req.user._id });

      const cartItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product.toString()
      );

      if (cartItemIndex === -1) {
        return next(
          CustomErrorHandler.notFound("Product not found in the cart")
        );
      }

      cart.items.splice(cartItemIndex, 1);

      await cart.save();

      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      console.log(error);
    }
  },
  async getCartItems(req, res, next) {
    const userId = req.user._id;
    if (!userId) {
      return next(CustomErrorHandler.unAuthorized("Please login to access"));
    }
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.product"
    );
    res.status(200).json({ cart });
  },
};

module.exports = cartController;
