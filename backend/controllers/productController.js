// This file contains the logic for browsing products

const Product = require("../models/Product");

// @desc    Get all products (supports search & category filter)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct list of categories
// @route   GET /api/products/meta/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, getProductById, getCategories };
