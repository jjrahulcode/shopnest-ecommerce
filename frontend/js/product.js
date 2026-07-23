// ===========================================================
// PRODUCT.JS - handles the single product details page
// ===========================================================

const productParams = new URLSearchParams(window.location.search);
const productId = productParams.get("id");

const productLoadingSpinner = document.getElementById("loadingSpinner");
const productDetail = document.getElementById("productDetail");
const decreaseQtyBtn = document.getElementById("decreaseQty");
const increaseQtyBtn = document.getElementById("increaseQty");
const qtyValueEl = document.getElementById("qtyValue");
const addToCartBtn = document.getElementById("addToCartBtn");

let currentQty = 1;
let currentProduct = null;

async function fetchProduct() {
  if (!productId) {
    showToast("No product specified", "danger");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const product = await response.json();

    if (!response.ok) throw new Error(product.message || "Product not found");

    currentProduct = product;
    renderProduct(product);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    productLoadingSpinner.classList.add("d-none");
  }
}

function renderProduct(product) {
  document.getElementById("productImage").src = product.image;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productRating").innerHTML = renderStars(product.rating) + ` <span class="text-muted small ms-1">(${product.rating})</span>`;
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("stockInfo").textContent = product.stock > 0 ? `${product.stock} in stock` : "Out of stock";

  if (product.stock === 0) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = `<i class="bi bi-x-circle me-2"></i> Out of Stock`;
  }

  productDetail.classList.remove("d-none");
}

decreaseQtyBtn.addEventListener("click", () => {
  if (currentQty > 1) {
    currentQty--;
    qtyValueEl.textContent = currentQty;
  }
});

increaseQtyBtn.addEventListener("click", () => {
  if (currentProduct && currentQty < currentProduct.stock) {
    currentQty++;
    qtyValueEl.textContent = currentQty;
  } else {
    showToast("Reached maximum available stock", "warning");
  }
});

addToCartBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please login to add items to your cart", "warning");
    setTimeout(() => (window.location.href = "login.html"), 1000);
    return;
  }

  const originalHTML = addToCartBtn.innerHTML;
  addToCartBtn.disabled = true;
  addToCartBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Adding...`;

  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: currentQty }),
    });

    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to add to cart");

    localStorage.setItem("cartCount", cart.items.reduce((sum, i) => sum + i.quantity, 0));
    renderNavbar();
    showToast("Added to cart successfully!", "success");
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    addToCartBtn.disabled = false;
    addToCartBtn.innerHTML = originalHTML;
  }
});

document.addEventListener("DOMContentLoaded", fetchProduct);
