// ===========================================================
// CHECKOUT.JS - handles displaying the cart summary and placing
// a dummy order
// ===========================================================

requireAuth();

const checkoutLoadingSpinner = document.getElementById("loadingSpinner");
const checkoutWrapper = document.getElementById("checkoutWrapper");
const checkoutEmptyState = document.getElementById("emptyState");
const checkoutForm = document.getElementById("checkoutForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function fetchCartForCheckout() {
  checkoutLoadingSpinner.classList.remove("d-none");

  try {
    const response = await fetch(`${API_BASE}/cart`, { headers: authHeaders() });
    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to load cart");

    if (!cart.items.length) {
      checkoutEmptyState.classList.remove("d-none");
      return;
    }

    renderCheckoutSummary(cart);
    checkoutWrapper.classList.remove("d-none");
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    checkoutLoadingSpinner.classList.add("d-none");
  }
}

function renderCheckoutSummary(cart) {
  const checkoutItemsList = document.getElementById("checkoutItemsList");

  checkoutItemsList.innerHTML = cart.items
    .map(
      (item) => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>${item.name} <span class="text-muted">x${item.quantity}</span></span>
        <span class="fw-semibold">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `
    )
    .join("");

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkoutTotal").textContent = formatPrice(total);
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const shippingAddress = document.getElementById("shippingAddress").value.trim();

  const originalHTML = placeOrderBtn.innerHTML;
  placeOrderBtn.disabled = true;
  placeOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Placing order...`;

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ shippingAddress }),
    });

    const order = await response.json();

    if (!response.ok) throw new Error(order.message || "Failed to place order");

    localStorage.setItem("cartCount", "0");
    showToast("Order placed successfully!", "success");
    setTimeout(() => (window.location.href = "orders.html"), 1200);
  } catch (error) {
    showToast(error.message, "danger");
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = originalHTML;
  }
});

document.addEventListener("DOMContentLoaded", fetchCartForCheckout);
