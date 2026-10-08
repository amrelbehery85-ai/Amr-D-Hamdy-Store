console.log("Store Started");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products-container");

async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = "<p>تعذّر تحميل المنتجات، حاول لاحقًا.</p>";
    }
}

function renderProducts(list) {
    productsContainer.innerHTML = "";
    list.forEach(function (product) {
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image">Product Image</div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>${product.price} EGP</span>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

document.getElementById("search").addEventListener("input", function (e) {
    const text = e.target.value.toLowerCase();
    const filtered = products.filter(function (p) {
        return p.name.toLowerCase().includes(text);
    });
    renderProducts(filtered);
});

function addToCart(productId) {
    const existing = cart.find(function (item) {
        return item.id === productId;
    });

    if (existing) {
        existing.quantity++;
    } else {
        const product = products.find(function (p) {
            return p.id === productId;
        });
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function (product, index) {
        total += product.price * product.quantity;
        totalQuantity += product.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong>
                    <p>${product.price} EGP × ${product.quantity}</p>
                </div>
                <div>
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-count").textContent = totalQuantity;
    cartTotal.textContent = total;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

document.getElementById("btn").addEventListener("click", function () {
    document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
});

loadProducts();
updateCart();