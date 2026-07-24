// This file defines all the order related API endpoints

const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, buyNowOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
router.post("/", protect, createOrder);
router.post("/buy-now", protect, buyNowOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
