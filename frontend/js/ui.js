// ===========================================================
// UI HELPER FUNCTIONS
// Shared utility functions used across every page:
// toasts, confirm dialogs, navbar rendering, loading spinners
// ===========================================================

function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container-custom";
    document.body.appendChild(container);
  }

  const toastId = "toast-" + Date.now();

  const icons = {
    success: "bi-check-circle-fill",
    danger: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
  };

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0 rounded-3 mb-2" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi ${icons[type] || icons.info} me-2"></i>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", toastHTML);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function showConfirm(message, onConfirm) {
  const existing = document.getElementById("confirmModal");
  if (existing) existing.remove();

  const modalHTML = `
    <div class="modal fade" id="confirmModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-xl">
          <div class="modal-body text-center p-4">
            <i class="bi bi-exclamation-circle text-warning" style="font-size: 3rem;"></i>
            <p class="mt-3 mb-4">${message}</p>
            <div class="d-flex justify-content-center gap-3">
              <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
              <button type="button" id="confirmActionBtn" class="btn btn-danger rounded-pill px-4">Yes, Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modalEl = document.getElementById("confirmModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  document.getElementById("confirmActionBtn").addEventListener("click", () => {
    modal.hide();
    onConfirm();
  });

  modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
}

// Get the number of items currently in the cart from localStorage cache
function getCachedCartCount() {
  return parseInt(localStorage.getItem("cartCount") || "0", 10);
}

function renderNavbar() {
  const placeholder = document.getElementById("navbarPlaceholder");
  if (!placeholder) return;

  const token = localStorage.getItem("token");
  const cartCount = getCachedCartCount();

  const loggedOutLinks = `
    <a class="nav-link" href="index.html">Home</a>
    <a class="nav-link" href="login.html">Login</a>
    <a class="btn btn-gradient ms-2" href="signup.html">Sign Up</a>
  `;

  const loggedInLinks = `
    <a class="nav-link" href="index.html">Home</a>
    <a class="nav-link position-relative" href="cart.html">
      Cart
      ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ""}
    </a>
    <a class="nav-link" href="orders.html">Orders</a>
    <a class="nav-link" href="dashboard.html">Dashboard</a>
    <button class="btn btn-outline-gradient ms-2" id="logoutBtn">Logout</button>
  `;

  placeholder.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
      <div class="container">
        <a class="navbar-brand" href="index.html"><i class="bi bi-bag-heart-fill me-2"></i>Shopnest</a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <i class="bi bi-list fs-2"></i>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navMenu">
          ${token ? loggedInLinks : loggedOutLinks}
        </div>
      </div>
    </nav>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("cartCount");
      showToast("You have been logged out", "info");
      setTimeout(() => (window.location.href = "index.html"), 800);
    });
  }
}

function renderFooter() {
  const placeholder = document.getElementById("footerPlaceholder");
  if (!placeholder) return;

  placeholder.innerHTML = `
    <footer class="footer-custom">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <h5><i class="bi bi-bag-heart-fill me-2"></i>Shopnest</h5>
            <p class="mt-3">Your one-stop shop for electronics, fashion, home goods, and more — all at honest prices.</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled mt-3">
              <li class="mb-2"><a href="index.html">Home</a></li>
              <li class="mb-2"><a href="login.html">Login</a></li>
              <li class="mb-2"><a href="signup.html">Sign Up</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Connect</h5>
            <div class="mt-3 fs-4">
              <a href="#" class="me-3"><i class="bi bi-twitter"></i></a>
              <a href="#" class="me-3"><i class="bi bi-instagram"></i></a>
              <a href="#" class="me-3"><i class="bi bi-facebook"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} Shopnest. Built for learning Full Stack Development.
        </div>
      </div>
    </footer>
  `;
}

function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatPrice(num) {
  return "$" + Number(num).toFixed(2);
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= fullStars ? `<i class="bi bi-star-fill"></i>` : `<i class="bi bi-star"></i>`;
  }
  return stars;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
});
