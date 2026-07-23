# Shopnest — Full Stack E-Commerce Store

A beginner-friendly online shopping application built with the JavaScript stack (HTML5, CSS3, Bootstrap 5, Vanilla JS, Node.js, Express, MongoDB Atlas). Users can browse products, search and filter by category, manage a shopping cart, complete a dummy checkout, and view their order history.

---

## 1. Folder Structure

```
project2-ecommerce/
├── frontend/
│   ├── index.html          Homepage: hero + product listing (search/category)
│   ├── login.html          Login page
│   ├── signup.html         Signup page
│   ├── product.html        Product details page
│   ├── cart.html           Shopping cart page
│   ├── checkout.html       Dummy checkout page
│   ├── orders.html         Order history page
│   ├── dashboard.html      User dashboard (profile + stats)
│   ├── css/style.css       All custom styling
│   ├── js/
│   │   ├── config.js       API_URL configuration (edit after deployment)
│   │   ├── ui.js           Navbar, footer, toasts, confirm dialogs
│   │   ├── auth.js         Signup/login logic
│   │   ├── main.js         Homepage listing, search, category filter
│   │   ├── product.js      Product details + add to cart
│   │   ├── cart.js         Cart view, quantity update, remove item
│   │   ├── checkout.js     Dummy checkout logic
│   │   ├── orders.js       Order history display
│   │   └── dashboard.js    Profile + account stats
│   ├── images/             (empty, for your own assets)
│   └── assets/             (empty, for your own assets)
│
├── backend/
│   ├── server.js            App entry point
│   ├── package.json
│   ├── .env                 Environment variables (edit before running)
│   ├── .gitignore
│   ├── config/db.js         MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   └── utils/
│       ├── generateToken.js
│       └── seedProducts.js   Populates the DB with 12 sample products
│
└── README.md
```

---

## 2. Running Locally in VS Code

### Backend

```bash
cd backend
npm install
```

Open `.env` and fill in:

```
PORT=5000
MONGO_URI=PASTE_YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE
JWT_SECRET=PASTE_YOUR_JWT_SECRET_HERE
CLIENT_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
```

Populate the database with sample products (recommended so the store isn't empty):

```bash
npm run seed
```

Then start the server:

```bash
npm start
```

The API will run at `http://localhost:5000`.

### Frontend

Open the `frontend` folder in VS Code and run `index.html` with the **Live Server** extension. No build step required.

While developing locally, set `frontend/js/config.js` to:

```js
const API_URL = "http://localhost:5000";
```

(Change this back to your Render URL before deploying.)

---

## 3. Required NPM Packages (backend)

| Package | Purpose |
|---|---|
| express | Web server / REST API framework |
| mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| cors | Cross-origin requests from frontend |
| dotenv | Environment variable loading |
| nodemon (dev) | Auto-restart during development |

Install everything with `npm install` inside `/backend`.

---

## 4. MongoDB Collections

- **users** — name, email, hashed password, address, phone, timestamps
- **products** — name, description, price, category, image, stock, rating, timestamps
- **carts** — one document per user, containing an array of cart items (product ref, name, price, image, quantity)
- **orders** — user ref, items[] (snapshot of cart at checkout), totalAmount, shippingAddress, status, timestamps

---

## 5. API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/profile` | Private | Get logged-in user's profile |
| PUT | `/api/auth/profile` | Private | Update name/phone/address |

### Product Routes (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Get all products (`?search=`, `?category=`) |
| GET | `/api/products/meta/categories` | Public | Get distinct list of categories |
| GET | `/api/products/:id` | Public | Get a single product |

### Cart Routes (`/api/cart`) — all private

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get the logged-in user's cart |
| POST | `/api/cart` | Add a product to the cart `{ productId, quantity }` |
| PUT | `/api/cart/:itemId` | Update quantity of a cart item `{ quantity }` |
| DELETE | `/api/cart/:itemId` | Remove one item from the cart |
| DELETE | `/api/cart` | Clear the entire cart |

### Order Routes (`/api/orders`) — all private

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create an order from the current cart `{ shippingAddress }` |
| GET | `/api/orders` | Get the logged-in user's order history |
| GET | `/api/orders/:id` | Get a single order |

For protected routes, send the JWT in the header:

```
Authorization: Bearer <token>
```

---

## 6. Testing with Thunder Client

1. Install the **Thunder Client** extension in VS Code.
2. `POST http://localhost:5000/api/auth/signup` with JSON body:
   ```json
   { "name": "Jane Doe", "email": "jane@example.com", "password": "123456" }
   ```
3. Copy the `token` from the response.
4. For protected routes, go to the **Auth** tab in Thunder Client → **Bearer Token** → paste the token.
5. Try `GET /api/products` to see your seeded products, then `POST /api/cart` with `{ "productId": "<id from step 5>", "quantity": 2 }`.
6. Test the remaining endpoints listed above.

---

## 7. Deployment

### Step 1 — MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from anywhere (`0.0.0.0/0`).
3. Copy your connection string into `backend/.env` as `MONGO_URI`.
4. Run `npm run seed` once (locally, pointed at your Atlas cluster) to populate sample products.

### Step 2 — Backend on Render
1. Push the `backend` folder to a GitHub repository.
2. Go to [Render](https://render.com) → New → Web Service → connect your repo.
3. Set **Root Directory** to `backend` (if the repo contains both folders).
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables in Render's dashboard: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`.
7. Deploy. Copy the generated URL (e.g. `https://shopnest-backend.onrender.com`).

### Step 3 — Frontend on Netlify
1. Open `frontend/js/config.js` and replace:
   ```js
   const API_URL = "PASTE_YOUR_RENDER_BACKEND_URL_HERE";
   ```
   with your real Render URL.
2. Push the `frontend` folder to GitHub (or drag-and-drop it into Netlify).
3. Go to [Netlify](https://app.netlify.com) → Add new site → deploy the `frontend` folder.
4. Copy your Netlify URL and add it to `CLIENT_ORIGIN` in your Render backend's environment variables, then redeploy the backend.

### Step 4 — Final Check
- Visit your Netlify URL, sign up, browse products, add to cart, checkout, and confirm your order shows up in "My Orders".

---

## 8. Notes for Beginners

- Cart and Order are separate collections: the cart is temporary/editable, while an order is a permanent snapshot of what was purchased and its price at that time.
- Checkout here is a **dummy checkout** — no real payment gateway is integrated. This keeps the project focused on learning full-stack CRUD and API design.
- Each user's cart and orders are private — always fetched using the logged-in user's id from the verified JWT, never trusting an id sent from the frontend.
- The `npm run seed` script is optional but recommended so you have real products to test with immediately.
