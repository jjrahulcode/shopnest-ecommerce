// ===========================================================
// ORDERS.JS - handles fetching and displaying the user's order
// history
// ===========================================================

requireAuth();

const ordersLoadingSpinner = document.getElementById("loadingSpinner");
const ordersContainer = document.getElementById("ordersContainer");
const ordersEmptyState = document.getElementById("emptyState");

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function fetchOrders() {
  ordersLoadingSpinner.classList.remove("d-none");

  try {
    const response = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
    const orders = await response.json();

    if (!response.ok) throw new Error(orders.message || "Failed to load orders");

    renderOrders(orders);
  } catch (error) {
    showToast(error.message, "danger");
  } finally {
    ordersLoadingSpinner.classList.add("d-none");
  }
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersEmptyState.classList.remove("d-none");
    return;
  }

  ordersContainer.innerHTML = orders
    .map(
      (order) => `
      <div class="order-card">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h6 class="fw-bold mb-1">Order #${order._id.slice(-8).toUpperCase()}</h6>
            <span class="text-muted small">${formatDate(order.createdAt)}</span>
          </div>
          <span class="status-badge status-${order.status}">${order.status}</span>
        </div>

       <div class="mb-3">
          ${order.items
          .map(
            (item) => `
              <div class="d-flex justify-content-between align-items-center py-2">
                <div class="d-flex align-items-center gap-3">
                  <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:10px;" />
                  <div>
                    <div class="fw-semibold">${item.name}</div>
                    <div class="text-muted small">Qty: ${item.quantity}</div>
                  </div>
                </div>
                <span class="fw-semibold">${formatPrice(item.price * item.quantity)}</span>
              </div>
            `
          )
          .join("")}
        </div>

        <hr />

        <div class="d-flex justify-content-between align-items-center">
          <span class="text-muted small"><i class="bi bi-geo-alt me-1"></i>${order.shippingAddress}</span>
          <span class="fw-bold price-tag">${formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", fetchOrders);
