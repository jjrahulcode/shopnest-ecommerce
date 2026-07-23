// This file contains the logic for managing the logged-in user's shopping cart

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper function to find or create a cart for the logged-in user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to the cart (or increase quantity if it already exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error("Product id is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update the quantity of a cart item
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error("Quantity must be at least 1");
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(req.params.itemId);

    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
