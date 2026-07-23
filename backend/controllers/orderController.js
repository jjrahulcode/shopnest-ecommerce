// This file contains the logic for creating and viewing orders
// Checkout is a "dummy" checkout - no real payment is processed

const Order = require("../models/Order");
const Cart = require("../models/Cart");

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

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      shippingAddress,
    });

    // Clear the cart after a successful order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
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

module.exports = { createOrder, getMyOrders, getOrderById };
