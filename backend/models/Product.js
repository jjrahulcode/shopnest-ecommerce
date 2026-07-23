// This file defines the structure of a Product document in MongoDB

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
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
    category: {
      type: String,
      required: true,
      default: "General",
    },
    image: {
      type: String,
      default: "",
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
