const products = [
  {
    id: 1,
    name: "Sunrise Espresso Blend",
    desc: "Dark chocolate & caramel notes",
    price: 14.9,
    img: "image/images/images espresso.jpg",
  },
  {
    id: 2,
    name: "Ethiopian Yirgacheffe",
    desc: "Floral, jasmine & bergamot",
    price: 18.5,
    img: "image/images/ethiopian.jpg",
  },
  {
    id: 3,
    name: "Maple Cinnamon Latte",
    desc: "Homemade syrup + oat milk",
    price: 5.9,
    img: "image/images/images maple late.jpg",
  },
  {
    id: 4,
    name: "Cold Brew Kit",
    desc: "Nitro style, 6 servings",
    price: 24.9,
    img: "image/images/images cold brew.jpg",
  },
];

let cart = [];

function saveCart() {
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateCartUI();
  updateCartCount();
}

function loadCart() {
  const saved = localStorage.getItem("coffeeCart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  } else cart = [];
  updateCartUI();
  updateCartCount();
}

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").innerText = totalQty;
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  animateCartIcon();
}

function animateCartIcon() {
  const icon = document.querySelector(".cart-icon i");
  icon.style.transform = "scale(1.2)";
  setTimeout(() => {
    icon.style.transform = "scale(1)";
  }, 200);
}

function updateCartUI() {
  const cartContainer = document.getElementById("cartItemsList");
  const totalSpan = document.getElementById("cartTotalPrice");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart"><i class="fas fa-coffee"></i> <br> Your cart is empty. Add some magic!</div>`;
    totalSpan.innerText = "Total: $0.00";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = "";
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(cartItemDiv);
  });
  totalSpan.innerText = `Total: $${total.toFixed(2)}`;

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      const delta = parseInt(btn.dataset.delta);
      const cartItem = cart.find((i) => i.id === id);
      if (cartItem) {
        const newQty = cartItem.quantity + delta;
        if (newQty <= 0) {
          cart = cart.filter((i) => i.id !== id);
        } else {
          cartItem.quantity = newQty;
        }
        saveCart();
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      cart = cart.filter((i) => i.id !== id);
      saveCart();
    });
  });
}

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
}

document.getElementById("cartIcon").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  products.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-img" src="${prod.img}" alt="${prod.name}">
      <div class="product-info">
        <div class="product-title">${prod.name}</div>
        <div class="product-desc">${prod.desc}</div>
        <div class="price-row">
          <span class="price">$${prod.price.toFixed(2)}</span>
          <button class="add-to-cart" data-id="${prod.id}">Add to bag</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      const product = products.find((p) => p.id === id);
      if (product) addToCart(product);
      openCart();
    });
  });
}

document.getElementById("heroOrderBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
});

const paymentModal = document.getElementById("paymentModal");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const closePaymentBtn = document.getElementById("closePaymentBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

function openPaymentModal() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some delicious coffee first.");
    return false;
  }
  paymentModal.classList.add("active");
  document.getElementById("paymentInfo").innerHTML = "";
  return true;
}

function closePaymentModal() {
  paymentModal.classList.remove("active");
}

checkoutBtn.addEventListener("click", openPaymentModal);
closePaymentBtn.addEventListener("click", closePaymentModal);

confirmPaymentBtn.addEventListener("click", () => {
  const cardNum = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("expiry").value.trim();
  const cvc = document.getElementById("cvc").value.trim();
  const paymentMsgDiv = document.getElementById("paymentInfo");

  if (!cardNum || !expiry || !cvc) {
    paymentMsgDiv.innerHTML = "❌ Please fill all payment details";
    paymentMsgDiv.style.color = "red";
    return;
  }
  if (cart.length === 0) {
    paymentMsgDiv.innerHTML = "Cart empty, cannot proceed.";
    return;
  }

  paymentMsgDiv.innerHTML = "⏳ Processing payment...";
  setTimeout(() => {
    paymentMsgDiv.innerHTML =
      "✅ Payment approved! Order confirmed. Thank you! 🧾";
    paymentMsgDiv.style.color = "#2b6e3c";
    cart = [];
    saveCart();
    closePaymentModal();
    closeCart();
    alert(
      "🎉 Your coffee order is confirmed! Barista is preparing your order.",
    );
  }, 1000);
});

window.onclick = (e) => {
  if (e.target === paymentModal) closePaymentModal();
};

renderProducts();
loadCart();
