// ===========================================================
// DASHBOARD.JS - handles account stats and profile updates
// ===========================================================

requireAuth();

const profileForm = document.getElementById("profileForm");

document.getElementById("welcomeName").textContent = localStorage.getItem("userName") || "Shopper";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// Load profile info
async function fetchProfile() {
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, { headers: authHeaders() });
    const user = await response.json();

    if (!response.ok) throw new Error(user.message || "Failed to load profile");

    document.getElementById("profileName").value = user.name;
    document.getElementById("profileEmail").value = user.email;
    document.getElementById("profilePhone").value = user.phone || "";
    document.getElementById("profileAddress").value = user.address || "";

    // Display the wallet balance formatted as Indian Rupees
    document.getElementById("walletBalance").textContent = formatWallet(user.walletBalance);
    localStorage.setItem("walletBalance", user.walletBalance);
  } catch (error) {
    showToast(error.message, "danger");
  }
}

// Formats a number as an Indian Rupee amount, e.g. 70000 -> ₹70,000
function formatWallet(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Load order stats
async function fetchOrderStats() {
  try {
    const response = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
    const orders = await response.json();

    if (!response.ok) throw new Error(orders.message || "Failed to load orders");

    document.getElementById("totalOrdersCount").textContent = orders.length;

    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    document.getElementById("totalSpent").textContent = formatPrice(totalSpent);
  } catch (error) {
    console.error(error.message);
  }
}

// Load cart stats
async function fetchCartStats() {
  try {
    const response = await fetch(`${API_BASE}/cart`, { headers: authHeaders() });
    const cart = await response.json();

    if (!response.ok) throw new Error(cart.message || "Failed to load cart");

    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    document.getElementById("cartItemsCount").textContent = totalItems;
    localStorage.setItem("cartCount", totalItems);
    renderNavbar();
  } catch (error) {
    console.error(error.message);
  }
}

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("profileName").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();
  const address = document.getElementById("profileAddress").value.trim();

  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ name, phone, address }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to update profile");

    localStorage.setItem("userName", data.name);
    showToast("Profile updated successfully", "success");
    document.getElementById("welcomeName").textContent = data.name;
  } catch (error) {
    showToast(error.message, "danger");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchProfile();
  fetchOrderStats();
  fetchCartStats();
});
