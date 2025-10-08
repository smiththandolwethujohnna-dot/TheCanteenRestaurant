// ===================== CART FUNCTIONS =====================
function addToCart(item, price) {
  const cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
  cart.push({ item, price });
  localStorage.setItem("canteenCart", JSON.stringify(cart));
  alert(`${item} added to cart!`);
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
  let total = 0;
  const cartList = document.getElementById("cart-items");
  if (cartList) {
    cartList.innerHTML = "";
    cart.forEach((entry, index) => {
      total += entry.price;
      const li = document.createElement("li");
      li.innerHTML = `${entry.item} - R${entry.price} <button onclick="removeFromCart(${index})">Remove</button>`;
      cartList.appendChild(li);
    });
  }

  const totalDisplay = document.getElementById("total");
  if (totalDisplay) totalDisplay.textContent = total;

  const payfastAmount = document.getElementById("payfast-amount");
  if (payfastAmount) payfastAmount.value = total.toFixed(2);
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("canteenCart", JSON.stringify(cart));
  updateCart();
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Redirecting to order type...");
  setTimeout(() => {
    window.location.href = "order-type.html";
  }, 1000);
}

// ===================== ORDER TYPE =====================
function selectOrderType(type) {
  localStorage.setItem("orderType", type);
  alert(`You selected: ${type}. Redirecting to payment...`);
  setTimeout(() => {
    window.location.href = "payment.html";
  }, 1000);
}

// ===================== CUSTOMER SIGN-UP =====================
function signup() {
  const username = document.getElementById("new-username")?.value.trim();
  const password = document.getElementById("new-password")?.value.trim();
  const email = document.getElementById("new-email")?.value.trim();
  const phone = document.getElementById("new-phone")?.value.trim();
  const signupMsg = document.getElementById("signup-message");

  if (!username || !password || !email || !phone) {
    signupMsg.textContent = "Please fill in all fields.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("canteenUsers")) || {};

  if (users[username]) {
    signupMsg.textContent = "Username already exists.";
  } else {
    users[username] = { password, email, phone };
    localStorage.setItem("canteenUsers", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
    signupMsg.textContent = "Account created. Redirecting to menu...";
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 1500);
  }
}

// ===================== CUSTOMER LOGIN =====================
function login() {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const message = document.getElementById("login-message");

  const users = JSON.parse(localStorage.getItem("canteenUsers")) || {};

  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    message.textContent = "Login successful! Redirecting to menu...";
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 1500);
  } else {
    message.textContent = "Invalid username or password.";
  }
}

// ===================== PAYMENT CONFIRMATION =====================
function confirmOrder() {
  const cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
  const orderType = localStorage.getItem("orderType") || "Take-away";
  const orders = JSON.parse(localStorage.getItem("canteenOrders")) || [];

  const newOrder = {
    orderNumber: "ORD" + String(orders.length + 1).padStart(3, "0"),
    items: cart.map(item => item.item),
    total: cart.reduce((sum, item) => sum + item.price, 0),
    type: orderType,
    date: new Date().toLocaleDateString(),
    status: "Pending"
  };

  orders.push(newOrder);
  localStorage.setItem("canteenOrders", JSON.stringify(orders));
  localStorage.setItem("latestOrderNumber", newOrder.orderNumber);
  localStorage.removeItem("canteenCart");

  alert(`Your order number is ${newOrder.orderNumber}. Please use it as your payment reference.`);
  setTimeout(() => {
    window.location.href = "confirmation.html";
  }, 1000);
}

// ===================== STAFF SIGN-UP =====================
function staffSignup() {
  const username = document.getElementById("staff-username")?.value.trim();
  const password = document.getElementById("staff-password")?.value.trim();
  const message = document.getElementById("staff-signup-message");

  if (!username || !password) {
    message.textContent = "Please fill in both fields.";
    return;
  }

  if (password !== "blueburger") {
    message.textContent = "Incorrect staff password. Use: blueburger";
    return;
  }

  const staff = JSON.parse(localStorage.getItem("canteenStaff")) || {};

  if (staff[username]) {
    message.textContent = "Username already exists.";
  } else {
    staff[username] = true;
    localStorage.setItem("canteenStaff", JSON.stringify(staff));
    message.textContent = "Account created. Redirecting to dashboard...";
    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 1500);
  }
}

// ===================== STAFF LOGIN =====================
function adminLogin() {
  const username = document.getElementById("admin-username")?.value.trim();
  const password = document.getElementById("admin-password")?.value.trim();
  const message = document.getElementById("admin-login-message");

  const staff = JSON.parse(localStorage.getItem("canteenStaff")) || {};

  if (staff[username] && password === "blueburger") {
    message.textContent = "Login successful. Redirecting...";
    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 1500);
  } else {
    message.textContent = "Invalid credentials.";
  }
}

// ===================== STAFF LOGOUT =====================
function logoutAdmin() {
  alert("Logging out...");
  setTimeout(() => {
    window.location.href = "admin-login.html";
  }, 1000);
}

// ===================== ADMIN DASHBOARD =====================
function displayOrders() {
  const container = document.getElementById("order-list");
  const filter = document.getElementById("status-filter")?.value || "All";
  const orders = JSON.parse(localStorage.getItem("canteenOrders")) || [];

  container.innerHTML = "<h2>Recent Orders</h2>";

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  if (filtered.length === 0) {
    container.innerHTML += "<p>No orders found.</p>";
    return;
  }

  filtered.forEach((order, index) => {
    const div = document.createElement("div");
    div.className = "order-entry";
    div.innerHTML = `
      <strong>Order #${order.orderNumber}</strong><br>
      Type: ${order.type}<br>
      Date: ${order.date}<br>
      Status: <span id="status-${index}">${order.status}</span><br>
      Items: ${order.items.join(", ")}<br>
      Total: R${order.total.toFixed(2)}<br>
      <button onclick="updateOrderStatus(${index}, 'Completed')">Mark Completed</button>
      <button onclick="updateOrderStatus(${index}, 'Pending')">Mark Pending</button>
    `;
    container.appendChild(div);
  });
}

function updateOrderStatus(index, newStatus) {
  const orders = JSON.parse(localStorage.getItem("canteenOrders")) || [];
  orders[index].status = newStatus;
  localStorage.setItem("canteenOrders", JSON.stringify(orders));
  document.getElementById(`status-${index}`).textContent = newStatus;
}