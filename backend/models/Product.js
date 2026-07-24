// This file defines the structure of a Product document in MongoDB

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: 0,
    },
    discount: {
      // Percentage off, e.g. 10 means 10% off
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    // Main image shown on the product card
    image: {
      type: String,
      default: "",
    },
    // Extra gallery images shown on the product details page (optional)
    images: {
      type: [String],
      default: [],
    },
    // Flexible key-value specs, e.g. { "RAM": "8GB", "Storage": "256GB" }
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    stock: {
      type: Number,
      default: 20,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual field: automatically calculates the discounted price
// Does not get stored in the DB, only appears when converted to JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.virtual("finalPrice").get(function () {
  return Math.round(this.price - (this.price * this.discount) / 100);
});

module.exports = mongoose.model("Product", productSchema);