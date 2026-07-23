// This file defines all the cart related API endpoints
// All cart routes are protected - a user can only access their own cart

const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
