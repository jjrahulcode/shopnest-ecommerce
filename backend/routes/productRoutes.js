// This file defines all the product related API endpoints

const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, getCategories } = require("../controllers/productController");

// GET /api/products - Get all products (supports ?search= and ?category=)
router.get("/", getAllProducts);

// GET /api/products/meta/categories - Get list of distinct categories
router.get("/meta/categories", getCategories);

// GET /api/products/:id - Get a single product
router.get("/:id", getProductById);

module.exports = router;
