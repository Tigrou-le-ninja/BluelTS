import { displayWorkModal, displaySelectCategories } from "./modale.js";

// Tant que le DOM n'est pas chargé, on ne peut pas manipuler les éléments HTML
// On attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    getWorks(); // Fonction ligne 50
    getCategories(); // Fonction ligne 108
    isUserLoggedIn();
});

function isUserLoggedIn() {
    console.log("isUserLoggedIn called");
    // Vérifier si le token existe dans le localStorage
    const token = localStorage.getItem("token");
    // Récupérer les éléments dont l'affichage change en fonction de la connexion
    const editionBanner = document.querySelector(".edition-banner");
    const editIcon2 = document.getElementById("editIcon2");
    const editButton = document.querySelector(".edit-button");
    const filters = document.querySelector(".filters");
    const logInOrLogout = document.querySelector(".login-or-logout");
    if (token !== null) {
        // Affiche la div "edition-banner", au bouton "Modifier" et à l'icône "fa-pen-to-square"
        editionBanner.style.display = "flex";
        editIcon2.style.display = "flex";
        editButton.style.display = "flex";
        // Cache la div "filters"
        filters.style.display = "none";
        // Remplace le texte "login" par "logout" + change le comportement du lien
        logInOrLogout.innerHTML = '<a href="./index.html">logout</a>';
        logInOrLogout.addEventListener("click", (event) => {
            logoutLink();
        });
    } else {
        // Cache la div "edition-banner", au bouton "Modifier" et à l'icône "fa-pen-to-square"
        editionBanner.style.display = "none";
        editIcon2.style.display = "none";
        editButton.style.display = "none";
        // Affiche la div "filters"
        filters.style.display = "flex";
    }
}

function logoutLink() {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");
    isUserLoggedIn();
}

async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        console.log(response);
        if (!response.ok) {
            throw new Error(
                "Une erreur " + response.status + " s'est produite"
            );
        }
        const works = await response.json();
        for (let work of works) {
            displayWork(work);
            displayWorkModal(work); // Fonction : modale.js ligne 8
        }
    } catch (error) {
        alert(error);
    }
}

/**
 * On itère sur chaque élément de la liste "works" de la base de données afin de remplir la div "gallery" de la page index.html
 * Détails des manipulations ci-dessous
 * @param {Object} work
 */
export function displayWork(work) {
    // Sélectionner le composant "gallery"
    const sectionGallery = document.querySelector(".gallery");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");

    // Création d'une classe "fig"
    figureElement.classList.add("fig");

    // Ajouter l'attribut "id" à l'élément "figureElement"
    figureElement.setAttribute("id", "main_" + work.id);

    // Ajout d'un attribut cat à l'élément, correspondant à la catégorie du projet dans la base de données
    figureElement.dataset.cat = work.categoryId;

    // Création de l'élément image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    // Création de l'élément "figcaption"
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;

    // Insérer les éléments image et figcaption dans l'élement figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

    // Insérer l'élément figure dans la section "gallery"
    sectionGallery.appendChild(figureElement);
}

// Fonction asynchrone pour récupérer les catégories (fonctionne comme getWorks)
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        console.log(response);
        if (!response.ok) {
            throw new Error(
                "Une erreur " + response.status + " s'est produite"
            );
        }
        const categories = await response.json();
        displayCategories(categories);
        displaySelectCategories(categories); // Fonction : modale.js ligne 133
    } catch (error) {
        alert(error);
    }
}

/**
 * On itère sur chaque élément de la liste "categories" de la base de données afin de remplir la div "filters" de la page index.html
 * Détails des manipulations ci-dessous
 * @param {Object} categories 
 */
function displayCategories(categories) {
    const filters = document.querySelector(".filters");

    // Créer le bouton "Tous"
    const boutonTous = document.createElement("button");
    boutonTous.setAttribute("data-id", 0);
    boutonTous.classList.add("boutonFiltre");
    boutonTous.textContent = "Tous";
    boutonTous.addEventListener("click", function (event) {
        const id = Number(event.target.dataset.id);
        applyFilter(id); // Fonction ligne 178
    });

    filters.appendChild(boutonTous);

    // Créer un bouton pour chaque catégorie
    for (let category of categories) {
        // Création du bouton
        const boutonFiltreElement = document.createElement("button");

        // Définir l'attribut data-id
        boutonFiltreElement.setAttribute("data-id", category.id);

        // Ajouter la classe CSS
        boutonFiltreElement.classList.add("boutonFiltre");

        // Définir le texte du bouton
        boutonFiltreElement.textContent = category.name;

        // Créer une fonction d'évènement "click" pour le bouton
        boutonFiltreElement.addEventListener("click", function (event) {
            // Identifiant de la catégorie contenu dans le bouton
            const id = Number(event.target.dataset.id);

            // Appliquer le filtre en fonction de l'identifiant catégorie
            applyFilter(id);
        });

        filters.appendChild(boutonFiltreElement);
    }
}

/**
 * On compare l'id du bouton avec celui du projet et agit en conséquence
 * Si l'id du bouton est égal à 0, on affiche tous les projets
 * Si l'id du bouton est différent de 0, on affiche uniquement les projets de la catégorie correspondante
 * @param {Number} id 
 */
function applyFilter(id) {
    const allClass = document.getElementsByClassName("fig");
    for (let element of allClass) {
        if (id != 0) {
            console.log(parseInt(element.dataset.cat));
            if (parseInt(element.dataset.cat) != id)
                element.classList.add("hid");
            else {
                if (element.classList.contains("hid")) {
                    element.classList.remove("hid");
                }
            }
        } else {
            if (element.classList.contains("hid")) {
                element.classList.remove("hid");
            }
        }
    }
}