const CART_KEY = "brt-flowers-cart";

function readCart() {
    const savedCart = sessionStorage.getItem(CART_KEY);
    if (!savedCart) return [];

    try {
        const cart = JSON.parse(savedCart);
        if (!Array.isArray(cart)) throw new TypeError("Cart data must be a list.");
        return cart.filter((item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            Number.isFinite(item.price) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch (error) {
        console.error("Could not read the saved shopping bag.", error);
        sessionStorage.removeItem(CART_KEY);
        return [];
    }
}

function saveCart(cart) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartQuantity(cart) {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function showToast(message) {
    const toast = document.querySelector(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 2400);
}

function updateCartDisplay(cart) {
    const quantity = cartQuantity(cart);
    const count = document.querySelector(".cart-count");
    const summary = document.querySelector(".cart-summary");
    const cartLink = document.querySelector(".cart-link");

    if (count) count.textContent = String(quantity);
    if (summary) summary.textContent = `${quantity} ${quantity === 1 ? "bouquet" : "bouquets"} in your bag`;
    if (cartLink) cartLink.setAttribute("aria-label", `Cart, ${quantity} items`);
}

function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".site-nav");
    if (!toggle || !navigation) return;

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            navigation.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation");
        }
    });
}

function setupShop() {
    const productButtons = document.querySelectorAll(".add-to-cart");
    if (!productButtons.length) return;

    const searchInput = document.querySelector("#text-input");
    const cards = [...document.querySelectorAll(".product-card")];
    const emptyMessage = document.querySelector(".search-empty");
    let cart = readCart();
    updateCartDisplay(cart);

    productButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const { id, name, price } = button.dataset;
            if (!id || !name || !price) return;
            const productPrice = Number(price);
            if (!Number.isFinite(productPrice)) return;

            const existing = cart.find((item) => item.id === id);
            if (existing) existing.quantity += 1;
            else cart.push({ id, name, price: productPrice, quantity: 1 });
            saveCart(cart);
            updateCartDisplay(cart);
            showToast(`${name} added to your bag.`);
        });
    });

    searchInput?.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
        cards.forEach((card) => {
            const matches = card.dataset.name.toLowerCase().includes(query);
            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });
        if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    });

    document.querySelector(".clear-cart")?.addEventListener("click", () => {
        cart = [];
        saveCart(cart);
        updateCartDisplay(cart);
        showToast("Your bag is now empty.");
    });

    document.querySelector(".checkout-button")?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Add a bouquet before checking out.");
            return;
        }
        window.location.href = "payment.html";
    });
}

function setupPayment() {
    const orderItems = document.querySelector(".order-items");
    const total = document.querySelector(".order-total");
    const submitButton = document.querySelector(".place-order");
    const form = document.querySelector(".payment-form");
    if (!orderItems || !total || !submitButton || !form) return;

    const cart = readCart();
    const quantity = cartQuantity(cart);

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-order";
        empty.textContent = "Your bag is empty. Choose a bouquet to get started.";
        orderItems.append(empty);
        submitButton.disabled = true;
    } else {
        cart.forEach((item) => {
            const row = document.createElement("div");
            row.className = "order-row";
            const label = document.createElement("span");
            label.textContent = `${item.name} × ${item.quantity}`;
            const price = document.createElement("span");
            price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
            row.append(label, price);
            orderItems.append(row);
        });
        const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        total.textContent = `$${orderTotal.toFixed(2)}`;
    }

    const count = document.querySelector(".payment-cart-count");
    if (count) count.textContent = String(quantity);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (cart.length === 0 || !form.reportValidity()) return;

        sessionStorage.removeItem(CART_KEY);
        form.hidden = true;
        const confirmation = document.querySelector(".payment-confirmation");
        if (confirmation) {
            confirmation.hidden = false;
            confirmation.focus();
        }
    });
}

function setupSignup() {
    const form = document.querySelector(".signup-form");
    const password = document.querySelector("#signup-password");
    const confirmation = document.querySelector("#confirm-password");
    const status = document.querySelector(".signup-status");
    if (!form || !password || !confirmation || !status) return;

    const validatePassword = () => {
        confirmation.setCustomValidity(
            confirmation.value && confirmation.value !== password.value
                ? "Passwords do not match."
                : ""
        );
    };
    password.addEventListener("input", validatePassword);
    confirmation.addEventListener("input", validatePassword);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        validatePassword();
        if (!form.reportValidity()) return;
        status.textContent = "This demo does not create or store accounts yet.";
        status.hidden = false;
    });
}

setupMenu();
setupShop();
setupPayment();
setupSignup();
