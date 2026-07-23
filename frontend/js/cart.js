// ===========================================================
// CART.JS - handles viewing, updating, and removing cart items
// ===========================================================

requireAuth();

const cartLoadingSpinner = document.getElementById("loadingSpinner");
const cartWrapper = document.getElementById("cartWrapper");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartEmptyState = document.getElementById("emptyState");

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function fetchCart() {
  cartLoadingSpinner.classList.remove("d-none");
  cartWrapper.classList.add("d-none");
  cartEmptyState.classList.add("d-none");

  try {
    const response = await fetch(`${API_BASE}/cart`, { headers: authHeaders() });
    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to load cart");

    localStorage.setItem("cartCount", cart.items.reduce((sum, i) => sum + i.quantity, 0));
    renderNavbar();
    renderCart(cart);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    cartLoadingSpinner.classList.add("d-none");
  }
}

function renderCart(cart) {
  if (!cart.items.length) {
    cartEmptyState.classList.remove("d-none");
    return;
  }

  cartItemsContainer.innerHTML = cart.items
    .map(
      (item) => `
      <div class="cart-item-card d-flex align-items-center gap-3">
        <img src="${item.image}" alt="${item.name}" />
        <div class="flex-grow-1">
          <h6 class="fw-bold mb-1">${item.name}</h6>
          <p class="price-tag mb-2" style="font-size: 1rem;">${formatPrice(item.price)}</p>
          <div class="qty-control">
            <button type="button" onclick="changeQuantity('${item._id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button type="button" onclick="changeQuantity('${item._id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="icon-btn icon-btn-delete" onclick="confirmRemoveItem('${item._id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `
    )
    .join("");

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("subtotalAmount").textContent = formatPrice(subtotal);
  document.getElementById("totalAmount").textContent = formatPrice(subtotal);

  cartWrapper.classList.remove("d-none");
}

async function changeQuantity(itemId, newQty) {
  if (newQty < 1) {
    confirmRemoveItem(itemId);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ quantity: newQty }),
    });

    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to update quantity");

    localStorage.setItem("cartCount", cart.items.reduce((sum, i) => sum + i.quantity, 0));
    renderNavbar();
    renderCart(cart);
  } catch (error) {
    showToast(error.message, "danger");
  }
}

function confirmRemoveItem(itemId) {
  showConfirm("Remove this item from your cart?", () => removeItem(itemId));
}

async function removeItem(itemId) {
  try {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to remove item");

    localStorage.setItem("cartCount", cart.items.reduce((sum, i) => sum + i.quantity, 0));
    renderNavbar();
    showToast("Item removed from cart", "success");
    renderCart(cart);

    if (!cart.items.length) {
      cartWrapper.classList.add("d-none");
      cartEmptyState.classList.remove("d-none");
    }
  } catch (error) {
    showToast(error.message, "danger");
  }
}

document.addEventListener("DOMContentLoaded", fetchCart);
