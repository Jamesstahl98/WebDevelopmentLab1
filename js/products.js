import { PokemonCard } from "./PokemonCard.js";
import { addProductToCart } from "./shoppingCart.js"

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

document.addEventListener("DOMContentLoaded", () => {
    populateProducts();
});

const addToCartButton = document.getElementById("addToCartButton");

if(addToCartButton != null)
{
    addToCartButton.addEventListener("click", () => {
        const productId = document.getElementById("productId").getAttribute("content");
        addProductToCart(productId);
    });
}

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
async function populateProductDisplay(collection, elementId, amountToDisplay) {
    let productContainer = document.getElementById(elementId);
    productContainer.innerHTML = "";

    collection.slice(0, amountToDisplay).forEach(product => {
        let imageUrl = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;

        if (!document.querySelector(`link[rel="preload"][href="${imageUrl}"]`)) {
            let link = document.createElement("link");
            link.rel = "preload";
            link.href = imageUrl;
            link.as = "image";
            link.fetchpriority = "high"; 
            document.head.appendChild(link);
        }
    });

    for (let i = 0; i < amountToDisplay; i++) {
        let skeleton = document.createElement("div");
        skeleton.classList.add("col", "skeleton-wrapper");
        skeleton.innerHTML = `
            <div class="d-flex align-items-center p-2 ps-0 ms-2 bg-dark border product-card">
                <div class="position-relative">
                    <div class="skeleton-image"></div>
                </div>
                <div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-price"></div>
                </div>
            </div>
        `;
        productContainer.appendChild(skeleton);
    }

    for (let i = 0; i < amountToDisplay && i < collection.length; i++) {
        let product = collection[i]; 
        let imageUrl = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;

        let productElement = document.createElement("div");
        productElement.classList.add("col", "product-wrapper");
        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center p-2 ps-0 ms-2 bg-dark border product-card">
                <div class="position-relative" style="width: 80px; height: 100px;">
                    <!-- Sale Badge -->
                    ${product.percentOff > 0 ? `
                        <span class="badge bg-danger position-absolute top-0 start-0 translate-middle rounded-circle"
                              style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                            -${product.percentOff}%
                        </span>` : ""}
                    
                    <!-- Product Image -->
                    <img src="${imageUrl}" fetchpriority="high" loading="eager"
                         class="img-fluid rounded me-3 product-image" alt="${product.name}" 
                         style="width: 80px; height: 100px; visibility: hidden;">
                </div>
                <div>
                    <p class="fw-bold mb-1">${product.name}</p>
                    <p>$${product.originalPriceInDollars - (product.originalPriceInDollars * (product.percentOff / 100))}</p>
                </div>
            </div>
        `;

        productElement.addEventListener("click", () => openProductModal(product));

        let img = productElement.querySelector("img");
        img.onload = () => {
            img.style.visibility = "visible";
            productContainer.children[i].replaceWith(productElement);
        };
        img.onerror = () => {
            
            productContainer.children[i].replaceWith(productElement);
        };
    }
}

function loadProductsWithPagination(page, collection) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = collection.slice(startIndex, endIndex);

    productsToDisplay.forEach((product) => {
        let imageUrl = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;
        
        if (!document.querySelector(`link[rel="preload"][href="${imageUrl}"]`)) {
            let link = document.createElement("link");
            link.rel = "preload";
            link.href = imageUrl;
            link.as = "image";
            link.fetchpriority = "high";
            document.head.appendChild(link);
        }

        let productElement = document.createElement("div");
        productElement.classList.add("col", "product-wrapper");
        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center p-2 ps-0 ms-2 bg-dark border product-card">
                <div class="position-relative" style="width: 80px; height: 100px;">
                    <!-- Sale Badge -->
                    ${product.percentOff > 0 ? ` 
                        <span class="badge bg-danger position-absolute top-0 start-0 translate-middle rounded-circle"
                              style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                            -${product.percentOff}%
                        </span>` : ""}
                    
                    <!-- Product Image (Initially hidden) -->
                    <img src="${imageUrl}" fetchpriority="high" loading="eager"
                         class="img-fluid rounded me-3 product-image" alt="${product.name}" 
                         style="width: 80px; height: 100px; visibility: hidden;">
                </div>
                <div>
                    <p class="fw-bold mb-1 product-name skeleton-text">Loading...</p>
                    <p class="product-price skeleton-text">...</p>
                </div>
            </div>
        `;

        productElement.addEventListener("click", () => openProductModal(product));

        productsContainer.appendChild(productElement);

        let img = productElement.querySelector("img");
        let namePlaceholder = productElement.querySelector(".product-name");
        let pricePlaceholder = productElement.querySelector(".product-price");

        img.onload = () => {
            img.style.visibility = "visible";
            namePlaceholder.innerHTML = product.name;
            pricePlaceholder.innerHTML = `$${(product.originalPriceInDollars - (product.originalPriceInDollars * (product.percentOff / 100))).toFixed(2)}`;
            
            namePlaceholder.classList.remove("skeleton-text");
            pricePlaceholder.classList.remove("skeleton-text");
        };

        img.onerror = () => {
            namePlaceholder.innerHTML = product.name;
            pricePlaceholder.innerHTML = `$${(product.originalPriceInDollars - (product.originalPriceInDollars * (product.percentOff / 100))).toFixed(2)}`;
            
            namePlaceholder.classList.remove("skeleton-text");
            pricePlaceholder.classList.remove("skeleton-text");
        };
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

    let productImage = document.getElementById("modalProductImage");
    productImage.src = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;
    productImage.alt = product.name;

    document.getElementById("modalProductPrice").textContent = product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100));
    document.getElementById("modalProductDiscount").textContent = product.percentOff;
    document.getElementById("modalProductStock").textContent = product.numberInStock;
    
    let cardData = await getCardAsync(product.id);
    document.getElementById("modalProductSet").textContent = cardData.set.name || "Unknown Set";
    document.getElementById("modalProductRarity").textContent = cardData.rarity || "Unknown Rarity";
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