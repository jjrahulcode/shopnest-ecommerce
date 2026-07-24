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
const buyNowBtnRef = document.getElementById("buyNowBtn");
const reviewForm = document.getElementById("reviewForm");
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
  document.getElementById("productBrand").innerHTML = `<i class="bi bi-tags me-1"></i>Brand: <strong>${product.brand}</strong>`;
  document.getElementById("productRating").innerHTML =
    renderStars(product.rating) + ` <span class="text-muted small ms-1">(${product.rating}) · ${product.numReviews || 0} reviews</span>`;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("stockInfo").textContent = product.stock > 0 ? `${product.stock} in stock` : "Out of stock";

  // Discount badge + final price calculation
  const finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
  document.getElementById("productPrice").textContent = formatPrice(finalPrice);

  const discountBadge = document.getElementById("discountBadge");
  const originalPriceEl = document.getElementById("productOriginalPrice");

  if (product.discount > 0) {
    discountBadge.textContent = `${product.discount}% OFF`;
    discountBadge.classList.remove("d-none");
    originalPriceEl.textContent = formatPrice(product.price);
    originalPriceEl.classList.remove("d-none");
  }

  // Render the specifications table from the Map field
  const specsTableBody = document.querySelector("#specsTable tbody");
  const specEntries = Object.entries(product.specifications || {});

  if (specEntries.length) {
    specsTableBody.innerHTML = specEntries
      .map(
        ([key, value]) => `
        <tr>
          <td class="text-muted" style="width: 40%;">${key}</td>
          <td class="fw-semibold">${value}</td>
        </tr>
      `
      )
      .join("");
  } else {
    specsTableBody.innerHTML = `<tr><td class="text-muted">No specifications listed.</td></tr>`;
  }

  if (product.stock === 0) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = `<i class="bi bi-x-circle me-2"></i> Out of Stock`;
    if (buyNowBtnRef) {
      buyNowBtnRef.disabled = true;
      buyNowBtnRef.innerHTML = `<i class="bi bi-x-circle me-2"></i> Out of Stock`;
    }
  }

  renderReviews(product.reviews || []);
  productDetail.classList.remove("d-none");
  document.getElementById("reviewsSection").classList.remove("d-none");
}

// Render the list of reviews and show/hide the review form based on login state
function renderReviews(reviews) {
  document.getElementById("reviewCount").textContent = reviews.length;
  const reviewsList = document.getElementById("reviewsList");

  if (!reviews.length) {
    reviewsList.innerHTML = `<p class="text-muted">No reviews yet. Be the first to review this product!</p>`;
  } else {
    reviewsList.innerHTML = reviews
      .slice()
      .reverse()
      .map(
        (r) => `
        <div class="d-flex gap-3 mb-4">
          <div class="avatar-circle" style="width:42px;height:42px;border-radius:50%;background:var(--gradient-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">
            ${r.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 class="fw-bold mb-1">${r.name}</h6>
            <div class="rating-stars mb-1" style="font-size:0.85rem;">${renderStars(r.rating)}</div>
            <p class="mb-1">${r.comment}</p>
            <small class="text-muted">${formatDate(r.createdAt)}</small>
          </div>
        </div>
      `
      )
      .join("");
  }

  const reviewFormWrapper = document.getElementById("reviewFormWrapper");
  const loginToReviewMsg = document.getElementById("loginToReviewMsg");

  if (localStorage.getItem("token")) {
    reviewFormWrapper.classList.remove("d-none");
    loginToReviewMsg.classList.add("d-none");
  } else {
    reviewFormWrapper.classList.add("d-none");
    loginToReviewMsg.classList.remove("d-none");
  }
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
// Handle the "Buy Now" button - instant purchase using wallet balance
const buyNowBtn = document.getElementById("buyNowBtn");

if (buyNowBtn) {
  buyNowBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to buy this product", "warning");
      setTimeout(() => (window.location.href = "login.html"), 1000);
      return;
    }

    const shippingAddress = prompt("Enter your shipping address to confirm this order:");

    // If the user cancels the prompt or leaves it blank, stop here
    if (!shippingAddress || !shippingAddress.trim()) {
      showToast("Shipping address is required to place an order", "warning");
      return;
    }

    const originalHTML = buyNowBtn.innerHTML;
    buyNowBtn.disabled = true;
    buyNowBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Processing...`;

    try {
      const response = await fetch(`${API_BASE}/orders/buy-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: currentQty,
          shippingAddress: shippingAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Purchase failed");

      // Update the cached wallet balance so the dashboard shows the new amount
      localStorage.setItem("walletBalance", data.walletBalance);

      showToast("Order placed successfully!", "success");
      setTimeout(() => (window.location.href = "orders.html"), 1200);
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      buyNowBtn.disabled = false;
      buyNowBtn.innerHTML = originalHTML;
    }
  });
}

// Handle review form submission
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rating = document.getElementById("reviewRating").value;
    const comment = document.getElementById("reviewComment").value.trim();

    const submitBtn = reviewForm.querySelector("button[type='submit']");
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Submitting...`;

    try {
      const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const updatedProduct = await response.json();

      if (!response.ok) throw new Error(updatedProduct.message || "Failed to submit review");

      showToast("Review submitted successfully!", "success");
      reviewForm.reset();
      renderReviews(updatedProduct.reviews);
      document.getElementById("productRating").innerHTML =
        renderStars(updatedProduct.rating) + ` <span class="text-muted small ms-1">(${updatedProduct.rating.toFixed(1)}) · ${updatedProduct.numReviews} reviews</span>`;
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}

document.addEventListener("DOMContentLoaded", fetchProduct);
