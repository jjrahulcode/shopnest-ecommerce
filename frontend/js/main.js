// ===========================================================
// MAIN.JS - handles the homepage product listing, search, and
// category filtering
// ===========================================================

const productsContainer = document.getElementById("productsContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryPills = document.getElementById("categoryPills");

let searchTimeout;
let activeCategory = "All";

// Fetch and render the list of available categories as pills
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/products/meta/categories`);
    const categories = await response.json();

    const allCategories = ["All", ...categories];

    categoryPills.innerHTML = allCategories
      .map(
        (cat) => `
        <span class="category-pill ${cat === activeCategory ? "active" : ""}" data-category="${cat}">
          ${cat}
        </span>
      `
      )
      .join("");

    document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        activeCategory = pill.dataset.category;
        document.querySelectorAll(".category-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        fetchProducts();
      });
    });
  } catch (error) {
    console.error("Failed to load categories:", error.message);
  }
}

// Fetch products from the API, filtered by search/category
async function fetchProducts() {
  loadingSpinner.classList.remove("d-none");
  productsContainer.innerHTML = "";
  emptyState.classList.add("d-none");

  try {
    const search = searchInput.value.trim();

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (activeCategory) params.append("category", activeCategory);

    const response = await fetch(`${API_BASE}/products?${params.toString()}`);
    const products = await response.json();

    if (!response.ok) {
      throw new Error(products.message || "Failed to load products");
    }

    renderProducts(products);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    loadingSpinner.classList.add("d-none");
  }
}

function renderProducts(products) {
  if (!products.length) {
    emptyState.classList.remove("d-none");
    return;
  }

  productsContainer.innerHTML = products
    .map(
      (product) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <a href="product.html?id=${product._id}">
            <img src="${product.image}" class="card-img-top" alt="${product.name}" />
          </a>
          <div class="card-body">
            <span class="badge-category">${product.category}</span>
            <a href="product.html?id=${product._id}" class="text-decoration-none">
              <h6 class="card-title">${product.name}</h6>
            </a>
            <div class="rating-stars mb-2">${renderStars(product.rating)}</div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="price-tag">${formatPrice(product.price)}</span>
              <button class="icon-btn btn btn-gradient btn-sm rounded-circle" style="width:36px;height:36px;" onclick="quickAddToCart('${product._id}', this)">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// Quickly add a product to the cart directly from the listing grid
async function quickAddToCart(productId, btn) {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please login to add items to your cart", "warning");
    setTimeout(() => (window.location.href = "login.html"), 1000);
    return;
  }

  const originalHTML = btn.innerHTML;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
  btn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to add to cart");

    localStorage.setItem("cartCount", cart.items.reduce((sum, i) => sum + i.quantity, 0));
    renderNavbar();
    showToast("Added to cart!", "success");
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(fetchProducts, 400);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});
