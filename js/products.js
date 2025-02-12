import { PokemonCard } from "./PokemonCard.js";

export const pokemonCardCollection = [
    new PokemonCard("ex12-5", "Gengar", 1, 0, 5, new Date("2025-01-25")), 
    new PokemonCard("mcd19-6", "Pikachu", 2, 30, 4, new Date("2025-01-28")),
    new PokemonCard("sm9-35", "Geodude", 1, 0, 6, new Date("2025-02-11")),
    new PokemonCard("sm1-28", "Psyduck", 2, 45, 2, new Date("2025-02-09")),
    new PokemonCard("ex12-1", "Aerodactyl", 3, 0, 5, new Date("2025-02-02")),
    new PokemonCard("base3-1", "Aerodactyl", 2, 30, 3, new Date("2025-01-05")),
    new PokemonCard("ex14-45", "Bulbasaur", 2, 50, 7, new Date("2023-11-05")),
    new PokemonCard("ex6-54", "Bulbasaur", 2, 0, 6, new Date("2024-12-09")),
    new PokemonCard("base4-4", "Charizard", 100, 0, 1, new Date("2024-12-05")),
    new PokemonCard("base6-3", "Charizard", 2, 35, 5, new Date("2025-01-14")),
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
    new PokemonCard("hgss4-19", "Dugtrio", 1, 0, 4, new Date("2025-02-01"))
];

document.addEventListener("DOMContentLoaded", () => {
    populateNewInStock();
    populateOnSale();
});

async function populateNewInStock() {
    let newInStock = document.getElementById("newInStock");
    let sortedProducts = [...pokemonCardCollection]
    .sort((a, b) => b.dateAdded - a.dateAdded);

    newInStock.innerHTML = "";

    for (let i = 0; i < 8 && i < sortedProducts.length; i++) {
        let product = sortedProducts[i]; 

        let setId = product.id.split('-')[0];

        let setName = await getSetName(setId);

        let productElement = document.createElement("div");
        productElement.classList.add("col");
        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center">
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
                    <p class="text-muted mb-1">${setName}</p>
                    <p>${product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100))} $</p>
                </div>
            </div>
        `;

        productElement.addEventListener("click", () => openProductModal(product, setName));

        newInStock.appendChild(productElement);
    }
}

async function populateOnSale() {
    let onSale = document.getElementById("onSale");
    let sortedProducts = [...pokemonCardCollection]
    .sort((a, b) => b.percentOff - a.percentOff);

    onSale.innerHTML = "";

    for (let i = 0; i < 8 && i < sortedProducts.length; i++) {
        let product = sortedProducts[i]; 

        let setId = product.id.split('-')[0];

        let setName = await getSetName(setId);

        let productElement = document.createElement("div");
        productElement.classList.add("col");
        productElement.setAttribute("data-bs-toggle", "modal");
        productElement.setAttribute("data-bs-target", "#productModal");
        productElement.style.cursor = "pointer";

        productElement.innerHTML = `
            <div class="d-flex align-items-center">
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
                    <p class="text-muted mb-1">${setName}</p>
                    <p>$${product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100))}</p>
                </div>
            </div>
        `;

        productElement.addEventListener("click", () => openProductModal(product, setName));

        onSale.appendChild(productElement);
    }
}

async function getSetName(setId) {
    try 
    {
        let response = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`);
        let data = await response.json();
        return data.data.name;
    } 
    catch (error) 
    {
        console.error("Error fetching set name:", error);
        return "Unknown Set";
    }
}

function openProductModal(product, setName) {
    document.getElementById("productModalLabel").textContent = product.name;
    document.getElementById("modalProductImage").src = `https://images.pokemontcg.io/${product.id.replace("-", "/")}.png`;
    document.getElementById("modalProductSet").textContent = setName;
    document.getElementById("modalProductPrice").textContent = product.originalPriceInDollars - (product.originalPriceInDollars*(product.percentOff/100));
    document.getElementById("modalProductDiscount").textContent = product.percentOff;
    document.getElementById("modalProductStock").textContent = product.numberInStock;
}