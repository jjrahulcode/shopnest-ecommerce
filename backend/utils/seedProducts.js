// This script populates the database with a full multi-category product catalog
// Run it with: npm run seed
// WARNING: This deletes all existing products before inserting new ones.
// It does NOT touch your users, carts, or orders.

const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

// ===========================================================
// HELPER FUNCTION
// Converts a compact row [name, brand, price, discount, ...specs]
// into a full product object matching the Product schema.
// ===========================================================
function buildCategoryProducts(rows, category, specKeys, images) {
  return rows.map((row, i) => {
    const [name, brand, price, discount, ...specValues] = row;

    // Zip the spec keys (e.g. "RAM") with their values (e.g. "8GB")
    const specifications = {};
    specKeys.forEach((key, idx) => {
      specifications[key] = specValues[idx];
    });

    return {
      name,
      brand,
      category,
      price,
      discount,
      description: `${name} by ${brand} — a top-rated ${category.toLowerCase()} product with excellent features and reliable performance.`,
      specifications,
      stock: 10 + ((i * 7) % 40),
      rating: Number((4 + ((i * 3) % 10) / 10).toFixed(1)),
      image: images[i % images.length],
      featured: i < 3, // first 3 products in each category are marked featured
    };
  });
}

// ===========================================================
// SMARTPHONES (15 products)
// ===========================================================
const smartphoneImages = [
  "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
  "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=500",
  "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
  "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500",
  "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500",
];

const smartphoneRows = [
  ["iPhone 16 Pro", "Apple", 134900, 5, "8GB", "256GB", "6.3-inch Super Retina XDR", "48MP Triple Camera"],
  ["Samsung Galaxy S25 Ultra", "Samsung", 129999, 8, "12GB", "512GB", "6.8-inch Dynamic AMOLED", "200MP Quad Camera"],
  ["Google Pixel 10", "Google", 79999, 6, "12GB", "256GB", "6.5-inch OLED", "50MP Dual Camera"],
  ["OnePlus 14", "OnePlus", 69999, 10, "16GB", "256GB", "6.7-inch AMOLED 120Hz", "50MP Triple Camera"],
  ["Xiaomi 16", "Xiaomi", 54999, 12, "12GB", "256GB", "6.6-inch AMOLED", "50MP Triple Camera"],
  ["Vivo X300", "Vivo", 62999, 9, "12GB", "256GB", "6.7-inch AMOLED", "50MP ZEISS Camera"],
  ["Oppo Find X9", "Oppo", 64999, 7, "16GB", "512GB", "6.8-inch LTPO AMOLED", "50MP Triple Camera"],
  ["Motorola Edge 60", "Motorola", 34999, 15, "8GB", "128GB", "6.5-inch pOLED", "50MP Dual Camera"],
  ["Realme GT 7", "Realme", 39999, 14, "12GB", "256GB", "6.7-inch AMOLED 144Hz", "50MP Triple Camera"],
  ["Nothing Phone 3", "Nothing", 44999, 11, "12GB", "256GB", "6.7-inch OLED", "50MP Dual Camera"],
  ["Asus ROG Phone 10", "Asus", 74999, 8, "16GB", "512GB", "6.78-inch AMOLED 165Hz", "50MP Triple Camera"],
  ["Sony Xperia 1 VII", "Sony", 109999, 6, "12GB", "256GB", "6.5-inch 4K OLED", "48MP Triple Camera"],
  ["Nokia X30", "Nokia", 24999, 20, "6GB", "128GB", "6.4-inch FHD+", "50MP Dual Camera"],
  ["Honor Magic 7", "Honor", 57999, 10, "12GB", "256GB", "6.6-inch OLED", "50MP Triple Camera"],
  ["Huawei Pura 80", "Huawei", 89999, 7, "12GB", "512GB", "6.8-inch OLED", "50MP Triple Camera"],
];

const smartphones = buildCategoryProducts(
  smartphoneRows,
  "Smartphones",
  ["RAM", "Storage", "Display", "Camera"],
  smartphoneImages
);

// ===========================================================
// LAPTOPS (15 products)
// ===========================================================
const laptopImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500",
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
];

const laptopRows = [
  ["Dell XPS 15", "Dell", 149999, 8, "Intel Core i7", "16GB", "1TB SSD", "15.6-inch OLED"],
  ["HP Spectre x360", "HP", 134999, 10, "Intel Core i7", "16GB", "512GB SSD", "13.5-inch OLED Touch"],
  ["Lenovo ThinkPad X1 Carbon", "Lenovo", 159999, 7, "Intel Core i7", "32GB", "1TB SSD", "14-inch WUXGA"],
  ["Asus Zenbook 14", "Asus", 79999, 12, "Intel Core i5", "16GB", "512GB SSD", "14-inch OLED"],
  ["Acer Predator Helios", "Acer", 124999, 9, "Intel Core i9", "16GB", "1TB SSD", "16-inch QHD 240Hz"],
  ["MSI Stealth 16", "MSI", 189999, 6, "Intel Core i9", "32GB", "2TB SSD", "16-inch QHD+"],
  ["Apple MacBook Pro 16", "Apple", 249999, 4, "Apple M4 Pro", "18GB", "512GB SSD", "16.2-inch Liquid Retina XDR"],
  ["Samsung Galaxy Book5", "Samsung", 99999, 11, "Intel Core i7", "16GB", "512GB SSD", "15.6-inch AMOLED"],
  ["LG Gram 17", "LG", 114999, 8, "Intel Core i7", "16GB", "1TB SSD", "17-inch WQXGA"],
  ["Microsoft Surface Laptop 7", "Microsoft", 129999, 9, "Snapdragon X Elite", "16GB", "512GB SSD", "13.8-inch PixelSense"],
  ["Huawei MateBook X Pro", "Huawei", 139999, 7, "Intel Core i7", "16GB", "1TB SSD", "14.2-inch 3.1K"],
  ["Razer Blade 16", "Razer", 219999, 5, "Intel Core i9", "32GB", "1TB SSD", "16-inch QHD+ 240Hz"],
  ["Gigabyte Aorus 16X", "Gigabyte", 154999, 10, "Intel Core i7", "16GB", "1TB SSD", "16-inch QHD 165Hz"],
  ["Alienware m18", "Alienware", 249999, 6, "Intel Core i9", "32GB", "2TB SSD", "18-inch QHD+ 165Hz"],
  ["Framework Laptop 13", "Framework", 89999, 8, "Intel Core i5", "16GB", "512GB SSD", "13.5-inch 2K"],
];

const laptops = buildCategoryProducts(
  laptopRows,
  "Laptops",
  ["Processor", "RAM", "Storage", "Display"],
  laptopImages
);

// ===========================================================
// TELEVISIONS (15 products)
// ===========================================================
const tvImages = [
  "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
  "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500",
  "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500",
  "https://images.unsplash.com/photo-1601944179066-29b8f7e29c3d?w=500",
  "https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=500",
];

const tvRows = [
  ["Samsung Neo QLED 65", "Samsung", 129999, 12, "65-inch", "4K QLED", "Smart Tizen OS", "120Hz"],
  ["Sony Bravia XR 55", "Sony", 109999, 10, "55-inch", "4K OLED", "Google TV", "120Hz"],
  ["LG OLED C4 65", "LG", 189999, 8, "65-inch", "4K OLED", "webOS Smart", "120Hz"],
  ["TCL C755 55", "TCL", 54999, 15, "55-inch", "4K QLED", "Google TV", "144Hz"],
  ["Hisense U7N 55", "Hisense", 59999, 14, "55-inch", "4K Mini-LED", "VIDAA Smart", "144Hz"],
  ["Xiaomi TV X Pro 55", "Xiaomi", 44999, 18, "55-inch", "4K LED", "Google TV", "60Hz"],
  ["Panasonic MZ1500 55", "Panasonic", 84999, 11, "55-inch", "4K OLED", "Fire TV", "120Hz"],
  ["Philips OLED908 55", "Philips", 149999, 9, "55-inch", "4K OLED", "Google TV", "120Hz"],
  ["Toshiba C350 50", "Toshiba", 39999, 16, "50-inch", "4K LED", "Fire TV", "60Hz"],
  ["Vu Premium 55", "Vu", 42999, 17, "55-inch", "4K LED", "Android TV", "60Hz"],
  ["OnePlus TV Q2 Pro 55", "OnePlus", 64999, 13, "55-inch", "4K QLED", "Android TV", "120Hz"],
  ["Redmi Smart TV X 55", "Redmi", 41999, 16, "55-inch", "4K LED", "Google TV", "60Hz"],
  ["Acer Predator 55", "Acer", 79999, 12, "55-inch", "4K QLED", "Google TV", "144Hz"],
  ["Motorola Revou 50", "Motorola", 34999, 19, "50-inch", "4K LED", "Google TV", "60Hz"],
  ["Blaupunkt Cybersound 43", "Blaupunkt", 27999, 20, "43-inch", "Full HD", "Android TV", "60Hz"],
];

const televisions = buildCategoryProducts(
  tvRows,
  "Televisions",
  ["Screen Size", "Resolution", "Smart Features", "Refresh Rate"],
  tvImages
);

// ===========================================================
// PRINTERS (15 products)
// ===========================================================
const printerImages = [
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?w=500",
  "https://images.unsplash.com/photo-1621965692403-0f43a17d3f75?w=500",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500",
];

const printerRows = [
  ["HP Ink Tank 315", "HP", 12999, 10, "Inkjet All-in-One", "8 ppm", "USB", "Ink Tank"],
  ["HP LaserJet Pro M126", "HP", 15999, 8, "Mono Laser", "20 ppm", "USB, WiFi", "Toner Cartridge"],
  ["Canon PIXMA G3070", "Canon", 13999, 9, "Inkjet All-in-One", "11 ppm", "WiFi", "Ink Tank"],
  ["Canon MegaTank G670", "Canon", 16999, 7, "Inkjet Photo", "12 ppm", "WiFi", "Ink Tank"],
  ["Epson EcoTank L3250", "Epson", 17999, 11, "Inkjet All-in-One", "10 ppm", "WiFi", "Ink Tank"],
  ["Epson WorkForce WF-2870", "Epson", 19999, 10, "Inkjet All-in-One", "13 ppm", "WiFi, USB", "Cartridge"],
  ["Brother HL-L2350DW", "Brother", 14999, 12, "Mono Laser", "32 ppm", "WiFi, USB", "Toner Cartridge"],
  ["Brother MFC-L2731DW", "Brother", 22999, 9, "Mono Laser All-in-One", "32 ppm", "WiFi, Ethernet", "Toner Cartridge"],
  ["Xerox WorkCentre 3025", "Xerox", 18999, 8, "Mono Laser All-in-One", "20 ppm", "USB, WiFi", "Toner Cartridge"],
  ["Ricoh SP 111", "Ricoh", 8999, 14, "Mono Laser", "17 ppm", "USB", "Toner Cartridge"],
  ["Pantum P2500W", "Pantum", 9999, 13, "Mono Laser", "22 ppm", "WiFi", "Toner Cartridge"],
  ["Lexmark MB2236adw", "Lexmark", 24999, 7, "Mono Laser All-in-One", "36 ppm", "WiFi, Ethernet", "Toner Cartridge"],
  ["Kyocera Ecosys M2040dn", "Kyocera", 27999, 6, "Mono Laser All-in-One", "40 ppm", "Ethernet, USB", "Toner Cartridge"],
  ["Fujifilm Apeos C325z", "Fujifilm", 34999, 5, "Color Laser All-in-One", "25 ppm", "WiFi, Ethernet", "Toner Cartridge"],
  ["HP OfficeJet Pro 9010", "HP", 21999, 9, "Inkjet All-in-One", "22 ppm", "WiFi, Ethernet", "Cartridge"],
];

const printers = buildCategoryProducts(
  printerRows,
  "Printers",
  ["Type", "Print Speed", "Connectivity", "Ink System"],
  printerImages
);

// ===========================================================
// FANS (15 products)
// ===========================================================
const fanImages = [
  "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=500",
  "https://images.unsplash.com/photo-1620332372374-8fc4278050fc?w=500",
];

const fanRows = [
  ["Havells Efficiencia Neo Ceiling Fan", "Havells", 2999, 10, "1200mm", "350 RPM", "50W", "5-Star Rated"],
  ["Havells Swing Table Fan", "Havells", 1899, 12, "400mm", "2000 RPM", "55W", "Oscillating"],
  ["Crompton Aura Prime Ceiling Fan", "Crompton", 2499, 14, "1200mm", "380 RPM", "75W", "Anti-Dust"],
  ["Crompton High Speed Pedestal Fan", "Crompton", 2199, 11, "450mm", "1350 RPM", "70W", "3-Speed Control"],
  ["Usha Bloom Ceiling Fan", "Usha", 2799, 9, "1200mm", "360 RPM", "72W", "Decorative Design"],
  ["Usha Maxx Air Wall Fan", "Usha", 1699, 13, "400mm", "1350 RPM", "55W", "Wall Mount"],
  ["Orient Aeroquiet Ceiling Fan", "Orient", 3199, 8, "1200mm", "350 RPM", "52W", "Ultra Silent"],
  ["Bajaj Regal Ceiling Fan", "Bajaj", 2299, 15, "1200mm", "380 RPM", "75W", "Rust Free"],
  ["Bajaj Esteem Table Fan", "Bajaj", 1599, 16, "400mm", "2250 RPM", "55W", "Copper Motor"],
  ["Atomberg Renesa BLDC Ceiling Fan", "Atomberg", 3499, 6, "1200mm", "330 RPM", "28W", "BLDC Energy Saver"],
  ["Luminous Audi Ceiling Fan", "Luminous", 2599, 12, "1200mm", "390 RPM", "75W", "High Air Delivery"],
  ["V-Guard Sonic Ceiling Fan", "V-Guard", 2399, 13, "1200mm", "370 RPM", "70W", "Double Ball Bearing"],
  ["Polar Winspeed Pedestal Fan", "Polar", 2099, 14, "450mm", "1400 RPM", "75W", "Adjustable Height"],
  ["Khaitan Ferio Wall Fan", "Khaitan", 1499, 17, "400mm", "1350 RPM", "50W", "Compact Design"],
  ["Havells Ventil Air Exhaust Fan", "Havells", 1299, 10, "250mm", "2300 RPM", "48W", "Rust Proof Blades"],
];

const fans = buildCategoryProducts(
  fanRows,
  "Fans",
  ["Sweep Size", "Speed", "Power", "Special Feature"],
  fanImages
);

// ===========================================================
// SMART WATCHES (8 products)
// ===========================================================
const watchImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
];

const watchRows = [
  ["Apple Watch Series 10", "Apple", 44900, 5, "1.9-inch LTPO OLED", "18 hours", "50m", "ECG, SpO2, Heart Rate"],
  ["Samsung Galaxy Watch 7", "Samsung", 29999, 8, "1.5-inch AMOLED", "40 hours", "50m", "ECG, SpO2, Heart Rate"],
  ["Noise ColorFit Pro 5", "Noise", 3499, 20, "1.85-inch AMOLED", "7 days", "IP68", "SpO2, Heart Rate"],
  ["boAt Wave Pro", "boAt", 2499, 25, "1.83-inch", "5 days", "IP68", "Heart Rate"],
  ["Fire-Boltt Phoenix", "Fire-Boltt", 1999, 22, "1.39-inch", "7 days", "IP67", "SpO2, Heart Rate"],
  ["Amazfit GTR 5", "Amazfit", 15999, 12, "1.43-inch AMOLED", "14 days", "5ATM", "SpO2, Heart Rate, GPS"],
  ["Garmin Venu 4", "Garmin", 42999, 6, "1.4-inch AMOLED", "10 days", "5ATM", "ECG, SpO2, GPS"],
  ["Fossil Gen 7", "Fossil", 21999, 15, "1.28-inch AMOLED", "24 hours", "3ATM", "Heart Rate, GPS"],
];

const smartWatches = buildCategoryProducts(
  watchRows,
  "Smart Watches",
  ["Display", "Battery Life", "Water Resistance", "Sensors"],
  watchImages
);

// ===========================================================
// HEADPHONES (8 products)
// ===========================================================
const headphoneImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
];

const headphoneRows = [
  ["Sony WH-1000XM6", "Sony", 34990, 10, "Over-Ear Wireless", "30 hours", "Bluetooth 5.3", "Active ANC"],
  ["Bose QuietComfort Ultra", "Bose", 32900, 8, "Over-Ear Wireless", "24 hours", "Bluetooth 5.3", "Active ANC"],
  ["JBL Tune 720BT", "JBL", 3999, 15, "Over-Ear Wireless", "76 hours", "Bluetooth 5.3", "No ANC"],
  ["boAt Rockerz 550", "boAt", 1999, 30, "Over-Ear Wireless", "20 hours", "Bluetooth 5.0", "No ANC"],
  ["Sennheiser Momentum 4", "Sennheiser", 27990, 9, "Over-Ear Wireless", "60 hours", "Bluetooth 5.2", "Active ANC"],
  ["Apple AirPods Max", "Apple", 59900, 5, "Over-Ear Wireless", "20 hours", "Bluetooth 5.3", "Active ANC"],
  ["Skullcandy Crusher ANC 2", "Skullcandy", 14999, 18, "Over-Ear Wireless", "24 hours", "Bluetooth 5.2", "Active ANC"],
  ["OnePlus Buds Pro 3", "OnePlus", 11999, 12, "In-Ear TWS", "40 hours (case)", "Bluetooth 5.4", "Active ANC"],
];

const headphones = buildCategoryProducts(
  headphoneRows,
  "Headphones",
  ["Type", "Battery Life", "Connectivity", "Noise Cancellation"],
  headphoneImages
);

// ===========================================================
// BLUETOOTH SPEAKERS (8 products)
// ===========================================================
const speakerImages = [
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
  "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
];

const speakerRows = [
  ["JBL Flip 7", "JBL", 9999, 10, "20W", "14 hours", "Bluetooth 5.4", "IP68"],
  ["Sony SRS-XB100", "Sony", 2999, 15, "5W", "16 hours", "Bluetooth 5.3", "IP67"],
  ["boAt Stone 1400", "boAt", 2499, 25, "14W", "10 hours", "Bluetooth 5.0", "IPX7"],
  ["Marshall Emberton III", "Marshall", 12999, 8, "20W", "32 hours", "Bluetooth 5.3", "IP67"],
  ["Bose SoundLink Flex", "Bose", 13900, 9, "Full Range", "12 hours", "Bluetooth 5.1", "IP67"],
  ["Zebronics Zeb-County", "Zebronics", 1499, 28, "10W", "8 hours", "Bluetooth 5.0", "Splash Resistant"],
  ["Ultimate Ears Boom 5", "Ultimate Ears", 14999, 7, "Full Range", "15 hours", "Bluetooth 5.1", "IP67"],
  ["Anker Soundcore Motion+", "Anker", 7999, 14, "30W", "12 hours", "Bluetooth 5.0", "IPX7"],
];

const bluetoothSpeakers = buildCategoryProducts(
  speakerRows,
  "Bluetooth Speakers",
  ["Output Power", "Battery Life", "Connectivity", "Water Resistance"],
  speakerImages
);

// ===========================================================
// TABLETS (8 products)
// ===========================================================
const tabletImages = [
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
  "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500",
  "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500",
];

const tabletRows = [
  ["Apple iPad Pro 13", "Apple", 129900, 4, "13-inch Liquid Retina XDR", "8GB", "256GB", "10 hours"],
  ["Samsung Galaxy Tab S11", "Samsung", 74999, 8, "11-inch AMOLED", "12GB", "256GB", "11 hours"],
  ["Xiaomi Pad 8", "Xiaomi", 32999, 12, "11.2-inch LCD 144Hz", "8GB", "256GB", "9 hours"],
  ["Lenovo Tab P12", "Lenovo", 28999, 13, "12.7-inch 2.5K", "8GB", "128GB", "10 hours"],
  ["OnePlus Pad 3", "OnePlus", 39999, 10, "12.1-inch LCD 144Hz", "12GB", "256GB", "10 hours"],
  ["Realme Pad 3", "Realme", 17999, 18, "11-inch LCD", "8GB", "128GB", "9 hours"],
  ["Honor Pad X9", "Honor", 14999, 20, "11-inch LCD", "6GB", "128GB", "8 hours"],
  ["Amazon Fire HD 10", "Amazon", 12999, 22, "10.1-inch FHD", "3GB", "64GB", "12 hours"],
];

const tablets = buildCategoryProducts(
  tabletRows,
  "Tablets",
  ["Display", "RAM", "Storage", "Battery"],
  tabletImages
);

// ===========================================================
// CAMERAS (8 products)
// ===========================================================
const cameraImages = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
  "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=500",
];

const cameraRows = [
  ["Canon EOS R8", "Canon", 149999, 6, "Full Frame CMOS", "24.2MP", "Interchangeable Lens", "4K 60fps"],
  ["Sony Alpha A7 IV", "Sony", 219999, 5, "Full Frame CMOS", "33MP", "Interchangeable Lens", "4K 60fps"],
  ["Nikon Z6 III", "Nikon", 199999, 6, "Full Frame BSI CMOS", "24.5MP", "Interchangeable Lens", "6K RAW"],
  ["Fujifilm X-T5", "Fujifilm", 159999, 7, "APS-C CMOS", "40.2MP", "Interchangeable Lens", "6.2K"],
  ["GoPro Hero 13", "GoPro", 39999, 12, "1/1.9-inch CMOS", "27MP", "Digital", "5.3K 60fps"],
  ["DJI Osmo Pocket 4", "DJI", 44999, 10, "1-inch CMOS", "20MP", "Digital", "4K 120fps"],
  ["Panasonic Lumix S9", "Panasonic", 129999, 8, "Full Frame CMOS", "24.2MP", "Interchangeable Lens", "6K Open Gate"],
  ["Canon PowerShot G7X Mark IV", "Canon", 64999, 9, "1-inch CMOS", "20.1MP", "4.2x Optical", "4K 30fps"],
];

const cameras = buildCategoryProducts(
  cameraRows,
  "Cameras",
  ["Sensor", "Resolution", "Zoom", "Video"],
  cameraImages
);

// ===========================================================
// GAMING CONSOLES (8 products)
// ===========================================================
const consoleImages = [
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
  "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=500",
  "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500",
];

const consoleRows = [
  ["Sony PlayStation 5 Pro", "Sony", 79999, 5, "2TB SSD", "8K Support", "1 DualSense", "Enhanced Ray Tracing"],
  ["Microsoft Xbox Series X", "Microsoft", 52999, 8, "1TB SSD", "4K 120fps", "1 Controller", "Quick Resume"],
  ["Nintendo Switch 2", "Nintendo", 44999, 6, "256GB", "4K Docked", "2 Joy-Con", "Backward Compatible"],
  ["Valve Steam Deck OLED", "Valve", 54999, 9, "1TB SSD", "1280x800 OLED", "Built-in Controls", "PC Gaming Handheld"],
  ["ASUS ROG Ally X", "Asus", 69999, 7, "1TB SSD", "1080p 120Hz", "Built-in Controls", "Windows 11 Handheld"],
  ["Sony PlayStation 5 Digital", "Sony", 44999, 10, "1TB SSD", "4K 120fps", "1 DualSense", "No Disc Drive"],
  ["Microsoft Xbox Series S", "Microsoft", 29999, 12, "512GB SSD", "1440p 120fps", "1 Controller", "Compact Design"],
  ["Nintendo Switch Lite", "Nintendo", 19999, 15, "32GB", "720p Handheld", "Built-in Controls", "Portable Only"],
];

const gamingConsoles = buildCategoryProducts(
  consoleRows,
  "Gaming Consoles",
  ["Storage", "Resolution Support", "Controllers Included", "Special Feature"],
  consoleImages
);

// ===========================================================
// MONITORS (8 products)
// ===========================================================
const monitorImages = [
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
  "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500",
  "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=500",
];

const monitorRows = [
  ["Dell UltraSharp 27", "Dell", 34999, 8, "27-inch", "4K UHD", "60Hz", "IPS Black"],
  ["LG UltraGear 27", "LG", 29999, 10, "27-inch", "QHD", "180Hz", "Nano IPS"],
  ["Samsung Odyssey G9", "Samsung", 89999, 7, "49-inch Curved", "DQHD", "240Hz", "QD-OLED"],
  ["Asus ProArt 32", "Asus", 54999, 6, "32-inch", "4K UHD", "60Hz", "IPS"],
  ["BenQ Mobiuz 27", "BenQ", 24999, 12, "27-inch", "QHD", "165Hz", "IPS"],
  ["Acer Predator XB3 27", "Acer", 39999, 9, "27-inch", "QHD", "280Hz", "IPS"],
  ["ViewSonic ColorPro 27", "ViewSonic", 32999, 11, "27-inch", "4K UHD", "60Hz", "IPS"],
  ["MSI Optix 27", "MSI", 22999, 14, "27-inch", "FHD", "165Hz", "VA"],
];

const monitors = buildCategoryProducts(
  monitorRows,
  "Monitors",
  ["Screen Size", "Resolution", "Refresh Rate", "Panel Type"],
  monitorImages
);

// ===========================================================
// KEYBOARDS (8 products)
// ===========================================================
const keyboardImages = [
  "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
  "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500",
  "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
];

const keyboardRows = [
  ["Logitech MX Keys S", "Logitech", 10999, 8, "Membrane", "Bluetooth, USB Receiver", "White Backlight", "Full Size"],
  ["Keychron K8 Pro", "Keychron", 8999, 10, "Mechanical", "Bluetooth, USB-C", "RGB Backlight", "TKL"],
  ["Razer BlackWidow V4", "Razer", 15999, 9, "Mechanical", "USB Wired", "RGB Chroma", "Full Size"],
  ["Corsair K70 RGB", "Corsair", 13999, 11, "Mechanical", "USB Wired", "RGB Backlight", "Full Size"],
  ["HP Wireless Elite", "HP", 2999, 15, "Membrane", "Wireless 2.4GHz", "No Backlight", "Full Size"],
  ["Dell KM7321W", "Dell", 3499, 13, "Membrane", "Bluetooth, Wireless", "No Backlight", "Full Size"],
  ["ASUS ROG Strix Scope", "Asus", 11999, 10, "Mechanical", "USB Wired", "RGB Aura Sync", "TKL"],
  ["RedGear MK881", "RedGear", 2499, 20, "Mechanical", "USB Wired", "RGB Backlight", "Full Size"],
];

const keyboards = buildCategoryProducts(
  keyboardRows,
  "Keyboards",
  ["Type", "Connectivity", "Backlight", "Layout"],
  keyboardImages
);

// ===========================================================
// MOUSE (8 products)
// ===========================================================
const mouseImages = [
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
  "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=500",
];

const mouseRows = [
  ["Logitech MX Master 3S", "Logitech", 9999, 7, "Darkfield High Precision", "8000 DPI", "Bluetooth, USB Receiver", "7 Buttons"],
  ["Razer DeathAdder V3", "Razer", 6999, 10, "Optical Focus Pro", "30000 DPI", "USB Wired", "5 Buttons"],
  ["HP X1000", "HP", 599, 25, "Optical", "1200 DPI", "USB Wired", "3 Buttons"],
  ["Zebronics Zeb-Alex", "Zebronics", 399, 30, "Optical", "1000 DPI", "USB Wired", "3 Buttons"],
  ["Dell MS3220", "Dell", 1499, 18, "Optical", "3200 DPI", "USB Wired", "5 Buttons"],
  ["ASUS ROG Chakram", "Asus", 12999, 9, "Optical", "36000 DPI", "Wireless, USB", "11 Buttons"],
  ["Corsair Katar Pro", "Corsair", 3499, 14, "Optical", "12400 DPI", "USB Wired", "6 Buttons"],
  ["boAt Mouse BM01", "boAt", 799, 22, "Optical", "1600 DPI", "Wireless 2.4GHz", "4 Buttons"],
];

const mice = buildCategoryProducts(
  mouseRows,
  "Mouse",
  ["Sensor", "DPI", "Connectivity", "Buttons"],
  mouseImages
);

// ===========================================================
// ROUTERS (8 products)
// ===========================================================
const routerImages = [
  "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500",
];

const routerRows = [
  ["TP-Link Archer AXE300", "TP-Link", 34999, 8, "WiFi 6E", "19000 Mbps", "Tri-Band", "4 LAN + 1 WAN"],
  ["Netgear Nighthawk RAX50", "Netgear", 17999, 10, "WiFi 6", "5400 Mbps", "Dual-Band", "4 LAN + 1 WAN"],
  ["Asus RT-AX88U", "Asus", 22999, 9, "WiFi 6", "6000 Mbps", "Dual-Band", "8 LAN + 1 WAN"],
  ["D-Link EXO AX5400", "D-Link", 12999, 14, "WiFi 6", "5400 Mbps", "Dual-Band", "4 LAN + 1 WAN"],
  ["Tenda AX1800", "Tenda", 3999, 20, "WiFi 6", "1800 Mbps", "Dual-Band", "3 LAN + 1 WAN"],
  ["Mercusys AC12", "Mercusys", 1499, 25, "WiFi 5", "1200 Mbps", "Dual-Band", "4 LAN + 1 WAN"],
  ["Xiaomi Router BE7000", "Xiaomi", 15999, 12, "WiFi 7", "7000 Mbps", "Tri-Band", "4 LAN + 1 WAN"],
  ["Linksys Velop Pro 7", "Linksys", 27999, 10, "WiFi 7 Mesh", "9000 Mbps", "Tri-Band", "2 LAN + 1 WAN per node"],
];

const routers = buildCategoryProducts(
  routerRows,
  "Routers",
  ["Wi-Fi Standard", "Speed", "Bands", "Ports"],
  routerImages
);

// ===========================================================
// COMBINE ALL CATEGORIES AND SEED THE DATABASE
// ===========================================================
const allProducts = [
  ...smartphones,
  ...laptops,
  ...televisions,
  ...printers,
  ...fans,
  ...smartWatches,
  ...headphones,
  ...bluetoothSpeakers,
  ...tablets,
  ...cameras,
  ...gamingConsoles,
  ...monitors,
  ...keyboards,
  ...mice,
  ...routers,
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(allProducts);
    console.log(`${allProducts.length} products inserted successfully!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();