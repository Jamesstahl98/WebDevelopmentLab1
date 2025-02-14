import { pokemonCardCollection } from "./products.js";

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    waitForHeaderAndLoadCart();
});
function waitForHeaderAndLoadCart() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && headerContainer.innerHTML.trim() !== "") {
        loadCart();
    } else {
        setTimeout(waitForHeaderAndLoadCart, 100);
    }
}
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];

    const cartList = document.getElementById("shoppingCartList");
    cartList.innerHTML = ""; 

    cart.forEach(product => {
        addCartItemToHTML(product);
    });
}

function removeProductFromCart(productId, listItem) {
    cart = cart.filter(p => p.id !== productId);
    saveCart();
    listItem.nextElementSibling?.remove();
    listItem.remove();
    console.log(`Removed product with ID ${productId}`);
}

export function addProductToCart(id) {
    const product = pokemonCardCollection.find(p => p.id === id);
    if (product) {
        cart.push(product);
        saveCart();
        addCartItemToHTML(product);
        console.log("Added to cart:", product);
    } else {
        console.log("Product not found.");
    }
}

function addCartItemToHTML(product) {
    const cartList = document.getElementById("shoppingCartList");

    const listItem = document.createElement("li");
    listItem.setAttribute("data-id", product.id);
    listItem.classList.add("cart-item");

    const productImage = document.createElement("img");
    productImage.src = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;
    productImage.alt = product.name;
    productImage.classList.add("cart-item-image");

    const textContainer = document.createElement("div");
    textContainer.classList.add("cart-item-text");

    const nameLabel = document.createElement("p");
    nameLabel.innerHTML = product.name;
    nameLabel.classList.add("cart-item-name");

    const priceLabel = document.createElement("p");
    priceLabel.innerHTML = `$${(product.originalPriceInDollars - (product.originalPriceInDollars * (product.percentOff / 100))).toFixed(2)}`;
    priceLabel.classList.add("cart-item-price");

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove from cart";
    removeButton.type = "button";
    removeButton.ariaLabel = "removeButton";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => removeProductFromCart(product.id, listItem));

    const separator = document.createElement("hr");

    textContainer.appendChild(nameLabel);
    textContainer.appendChild(priceLabel);
    textContainer.appendChild(removeButton);

    listItem.appendChild(productImage);
    listItem.appendChild(textContainer);

    cartList.appendChild(listItem);
    cartList.appendChild(separator);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}