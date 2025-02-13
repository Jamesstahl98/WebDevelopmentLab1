import { PokemonCard } from "./PokemonCard.js";

export const pokemonCardCollection = [
    new PokemonCard("ex12-5", "Gengar", 25, 0, 5, new Date("2025-01-25")), 
    new PokemonCard("mcd19-6", "Pikachu", 2, 30, 4, new Date("2025-01-28")),
    new PokemonCard("sm9-35", "Geodude", 1, 0, 6, new Date("2025-02-11")),
    new PokemonCard("sm1-28", "Psyduck", 2, 45, 2, new Date("2025-02-09")),
    new PokemonCard("ex12-1", "Aerodactyl", 15, 0, 5, new Date("2025-02-02")),
    new PokemonCard("base3-1", "Aerodactyl", 20, 30, 3, new Date("2025-01-05")),
    new PokemonCard("ex14-45", "Bulbasaur", 2, 50, 7, new Date("2023-11-05")),
    new PokemonCard("ex6-54", "Bulbasaur", 2, 0, 6, new Date("2024-12-09")),
    new PokemonCard("base4-4", "Charizard", 100, 0, 1, new Date("2024-12-05")),
    new PokemonCard("base6-3", "Charizard", 150, 35, 5, new Date("2025-01-14")),
    new PokemonCard("ex6-113", "Charmander", 10, 0, 8, new Date("2024-02-15")),
    new PokemonCard("dp7-101", "Charmander", 3, 0, 4, new Date("2025-01-10")),
    new PokemonCard("base1-63", "Squirtle", 5, 20, 2, new Date("2025-01-19")),
    new PokemonCard("hgss2-63", "Squirtle", 20, 15, 3, new Date("2024-05-05")),
    new PokemonCard("base2-54", "Jigglypuff", 3, 0, 1, new Date("2024-06-07")),
    new PokemonCard("xy1-87", "Jigglypuff", 2, 0, 7, new Date("2024-10-10")),
    new PokemonCard("sv5-101", "Arbok", 15, 0, 1, new Date("2024-01-09")),
    new PokemonCard("sv3pt5-185", "Arbok", 20, 0, 7, new Date("2024-11-24")),
    new PokemonCard("sm12-2", "Oddish", 2, 0, 6, new Date("2025-01-01")),
    new PokemonCard("sm5-78", "Alolan Diglett", 5, 25, 2, new Date("2024-12-22")),
    new PokemonCard("dp3-85", "Diglett", 2, 0, 2, new Date("2025-02-11")),
    new PokemonCard("hgss4-19", "Dugtrio", 15, 0, 4, new Date("2025-02-01"))
];

let cart = [];

let currentPage = 1;
const productsPerPage = 16;
const totalPages = Math.ceil(pokemonCardCollection.length / productsPerPage);

window.onload = loadCart;

document.addEventListener("DOMContentLoaded", () => {
    populateProducts();
});

document.getElementById("addToCartButton").addEventListener("click", () => {
    const productId = document.getElementById("productId").getAttribute("content");
    addProductToCart(productId);
});

function populateProducts() 
{

    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        populateProductDisplay(sortBySale(pokemonCardCollection), "onSale", 8);
        populateProductDisplay(sortByDateAdded(pokemonCardCollection), "newInStock", 8);
    } 
    else if (window.location.pathname.includes("productPage")) {
        loadProductsWithPagination(currentPage, pokemonCardCollection);
        setupPagination();
    }
}

async function populateProductDisplay(collection, elementId, amountToDisplay)
{
    let productContainer = document.getElementById(elementId);

    productContainer.innerHTML = "";

    for (let i = 0; i < amountToDisplay && i < collection.length; i++) {
        let product = collection[i]; 

        let setId = product.id.split('-')[0];

        let productElement = document.createElement("div");
        productElement.classList.add("col");
        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center p-2 ps-0 ms-2 bg-light border">
                <div class="position-relative">
                    <!-- Sale Badge -->
                    ${product.percentOff > 0 ? `
                        <span class="badge bg-danger position-absolute top-0 start-0 translate-middle rounded-circle"
                              style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                            -${product.percentOff}%
                        </span>` : ""}
                    
                    <!-- Product Image -->
                    <img src="https://images.pokemontcg.io/${product.id.replace("-", "/")}.png" 
                         class="img-fluid rounded me-3" alt="${product.name}" style="width: 100px; height: auto;">
                </div>
                <div>
                    <p class="fw-bold mb-1">${product.name}</p>
                    <p>$${product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100))}</p>
                </div>
            </div>
        `;
        productElement.addEventListener("click", () => openProductModal(product));

        productContainer.appendChild(productElement);
    }
}
function loadProductsWithPagination(page, collection) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = collection.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        let productElement = document.createElement("div");
        productElement.classList.add("col");

        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center p-2 ps-0 ms-2 bg-light border">
                <div class="position-relative">
                    <!-- Sale Badge -->
                    ${product.percentOff > 0 ? `
                        <span class="badge bg-danger position-absolute top-0 start-0 translate-middle rounded-circle"
                              style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                            -${product.percentOff}%
                        </span>` : ""}
                    
                    <!-- Product Image -->
                    <img src="https://images.pokemontcg.io/${product.id.replace("-", "/")}.png" 
                         class="img-fluid rounded me-3" alt="${product.name}" style="width: 100px; height: auto;">
                </div>
                <div>
                    <p class="fw-bold mb-1">${product.name}</p>
                    <p>$${product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100))}</p>
                </div>
            </div>
        `;

        productElement.addEventListener("click", () => openProductModal(product));
        productsContainer.appendChild(productElement);
    });
}

function setupPagination() {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = ""; 

    const prevButton = document.createElement("li");
    prevButton.classList.add("page-item");
    prevButton.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadProductsWithPagination(currentPage, pokemonCardCollection);
        }
    });
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", () => {
            currentPage = i;
            loadProductsWithPagination(currentPage, pokemonCardCollection);
        });
        pagination.appendChild(pageItem);
    }

    const nextButton = document.createElement("li");
    nextButton.classList.add("page-item");
    nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages)
        {
            currentPage++;
            loadProductsWithPagination(currentPage, pokemonCardCollection);
        }
    });
    pagination.appendChild(nextButton);
}

async function openProductModal(product) {
    document.getElementById("modalProductRarity").textContent = "";
    document.getElementById("modalProductSet").textContent = "";

    document.getElementById("productId").setAttribute("content", product.id);
    document.getElementById("productModalLabel").textContent = product.name;
    document.getElementById("modalProductImage").src = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;
    document.getElementById("modalProductPrice").textContent = product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100));
    document.getElementById("modalProductDiscount").textContent = product.percentOff;
    document.getElementById("modalProductStock").textContent = product.numberInStock;
    
    let cardData = await getCardAsync(product.id);
    document.getElementById("modalProductSet").textContent = cardData.set.name || "Unknown Set";
    document.getElementById("modalProductRarity").textContent = cardData.rarity || "Unknown Rarity";
}

function addCartItemToHTML(product) {
    const cartList = document.getElementById("shoppingCartList");

    const listItem = document.createElement("li");
    listItem.setAttribute("data-id", product.id);

    const nameLabel = document.createElement("p");
    nameLabel.innerHTML = product.name;

    const priceLabel = document.createElement("p");
    priceLabel.innerHTML = `$${product.originalPriceInDollars - (product.originalPriceInDollars * (product.percentOff / 100))}`;

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove from cart";
    removeButton.type = "button";
    removeButton.ariaLabel = "removeButton";
    removeButton.addEventListener("click", () => removeProductFromCart(product.id, listItem));

    const separator = document.createElement("hr");

    listItem.appendChild(nameLabel);
    listItem.appendChild(priceLabel);
    listItem.appendChild(removeButton);

    cartList.appendChild(listItem);
    cartList.appendChild(separator);
}

function addProductToCart(id) {
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

function removeProductFromCart(productId, listItem) {
    cart = cart.filter(p => p.id !== productId);
    saveCart();
    listItem.nextElementSibling?.remove();
    listItem.remove();
    console.log(`Removed product with ID ${productId}`);
}

async function getCardAsync(cardId)
{
    try 
    {
        let response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`);
        let data = await response.json();
        return data.data;
    } 
    catch (error) 
    {
        console.error("Error fetching card:", error);
        return "Unknown Card";
    }
}

function sortBySale(arrayTosort)
{
    let sortedProducts = [...arrayTosort]
    .sort((a, b) => b.percentOff - a.percentOff);
    return sortedProducts;
}

function sortByDateAdded(arrayTosort)
{
    let sortedProducts = [...arrayTosort]
    .sort((a, b) => b.dateAdded - a.dateAdded);
    return sortedProducts;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
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