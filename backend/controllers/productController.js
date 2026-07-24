// This file contains the logic for browsing products

const Product = require("../models/Product");

// @desc    Get all products (supports search & category filter)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, brand, minPrice, maxPrice, minRating, sort } = req.query;

    let filter = {};

    // Search across name, brand, AND category (Requirement 6)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Brand filter (supports a single brand or a comma-separated list)
    if (brand && brand !== "All") {
      const brandList = brand.split(",").map((b) => b.trim());
      filter.brand = { $in: brandList };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Build the sort object (Requirement 8)
    let sortOption = { createdAt: -1 }; // default: latest first

    if (sort === "priceLowHigh") sortOption = { price: 1 };
    else if (sort === "priceHighLow") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "latest") sortOption = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOption);
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
// @desc    Get distinct list of brands
// @route   GET /api/products/meta/brands
// @access  Public
const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand");
    res.status(200).json(brands.sort());
  } catch (error) {
    next(error);
  }
};
// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400);
      throw new Error("Please provide a rating and comment");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Prevent the same user from reviewing the same product twice
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Recalculate the average rating from all reviews
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, getProductById, getCategories, getBrands, addProductReview };