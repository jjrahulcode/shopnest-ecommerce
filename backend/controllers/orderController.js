// This file contains the logic for creating and viewing orders
// Checkout is a "dummy" checkout - no real payment is processed

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Create a new order from the current cart (dummy checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      res.status(400);
      throw new Error("Shipping address is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty");
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Fetch the fresh user document so we can check and update the wallet
    const user = await User.findById(req.user._id);

    if (user.walletBalance < totalAmount) {
      res.status(400);
      throw new Error("Insufficient Wallet Balance");
    }

    // Deduct the total from the wallet
    user.walletBalance -= totalAmount;
    await user.save();

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      shippingAddress,
    });

    // Clear the cart after a successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({ order, walletBalance: user.walletBalance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders belonging to the logged-in user
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single order by id (only if it belongs to the logged-in user)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You are not authorized to view this order");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
// @desc    Instantly buy a single product (no cart involved)
// @route   POST /api/orders/buy-now
// @access  Private
const buyNowOrder = async (req, res, next) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error("Product id is required");
    }

    if (!shippingAddress) {
      res.status(400);
      throw new Error("Shipping address is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const qty = quantity || 1;

    if (product.stock < qty) {
      res.status(400);
      throw new Error("Not enough stock available");
    }

    // Use the discounted price if the product has a discount
    const unitPrice = Math.round(product.price - (product.price * product.discount) / 100);
    const totalAmount = unitPrice * qty;

    const user = await User.findById(req.user._id);

    if (user.walletBalance < totalAmount) {
      res.status(400);
      throw new Error("Insufficient Wallet Balance");
    }

    // Deduct from wallet
    user.walletBalance -= totalAmount;
    await user.save();

    // Reduce stock
    product.stock -= qty;
    await product.save();

    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          name: product.name,
          price: unitPrice,
          image: product.image,
          quantity: qty,
        },
      ],
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({ order, walletBalance: user.walletBalance });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, buyNowOrder };
