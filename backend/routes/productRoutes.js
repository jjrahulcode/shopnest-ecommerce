// This file defines all the product related API endpoints

const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, getCategories, getBrands, addProductReview } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/products - Get all products
// Supports: ?search= ?category= ?brand= ?minPrice= ?maxPrice= ?minRating= ?sort=
router.get("/", getAllProducts);

// GET /api/products/meta/categories - Get list of distinct categories
router.get("/meta/categories", getCategories);

// GET /api/products/meta/brands - Get list of distinct brands
router.get("/meta/brands", getBrands);

// GET /api/products/:id - Get a single product
router.get("/:id", getProductById);

// POST /api/products/:id/reviews - Add a review to a product (protected)
router.post("/:id/reviews", protect, addProductReview);

module.exports = router;
