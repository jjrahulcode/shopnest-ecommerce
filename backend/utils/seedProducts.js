// This script populates the database with sample products
// Run it with: npm run seed

const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Over-ear wireless headphones with noise cancellation and 30-hour battery life.",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 25,
    rating: 4.6,
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your steps, heart rate, and sleep with this sleek smart watch.",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 18,
    rating: 4.4,
  },
  {
    name: "Men's Classic Sneakers",
    description: "Comfortable everyday sneakers made with breathable mesh fabric.",
    price: 45.0,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 40,
    rating: 4.3,
  },
  {
    name: "Women's Summer Dress",
    description: "Light and flowy floral dress, perfect for warm weather.",
    price: 34.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    stock: 30,
    rating: 4.5,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Keeps drinks cold for 24 hours or hot for 12 hours. 1L capacity.",
    price: 19.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    stock: 60,
    rating: 4.7,
  },
  {
    name: "Ceramic Coffee Mug Set (4-Pack)",
    description: "Set of 4 minimalist ceramic mugs, dishwasher and microwave safe.",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    stock: 35,
    rating: 4.5,
  },
  {
    name: "Yoga Mat with Carry Strap",
    description: "Non-slip, eco-friendly yoga mat, 6mm thick for extra comfort.",
    price: 27.5,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    stock: 22,
    rating: 4.6,
  },
  {
    name: "Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells, 5-25 lbs per hand.",
    price: 129.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
    stock: 12,
    rating: 4.8,
  },
  {
    name: "Bestselling Fiction Novel",
    description: "A gripping story that topped the bestseller charts this year.",
    price: 14.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    stock: 50,
    rating: 4.9,
  },
  {
    name: "Scented Soy Candle Set",
    description: "Set of 3 hand-poured soy candles in lavender, vanilla, and sandalwood.",
    price: 22.0,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602874801007-bd36c37bd2b3?w=500",
    stock: 28,
    rating: 4.4,
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof speaker with rich bass and 12-hour playtime.",
    price: 39.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    stock: 20,
    rating: 4.5,
  },
  {
    name: "Leather Laptop Backpack",
    description: "Water-resistant backpack with padded laptop compartment, fits up to 15.6 inches.",
    price: 54.99,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    stock: 16,
    rating: 4.7,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();
