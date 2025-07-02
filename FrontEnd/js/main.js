import { displayWorkModal , displaySelectCategories } from "./modale.js";

// Tant que le DOM n'est pas chargé, on ne peut pas manipuler les éléments HTML
// On attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  isUserLoggedIn();
});

function isUserLoggedIn () {
    // Vérifier si le token existe dans le localStorage
    const token = localStorage.getItem("token");
    // Récupérer les éléments dont l'affichage change en fonction de la connexion
    const editionBanner = document.querySelector(".edition-banner");
    const editIcon2 = document.getElementById("editIcon2");
    const editButton = document.querySelector(".edit-button");
    const filters = document.querySelector(".filters");
    const logInOrLogout = document.querySelector(".login-or-logout");
    if (token !== null) {
        // Style display flex à la div "edition-banner", au bouton "Modifier" et à l'icône "fa-pen-to-square"
        editionBanner.style.display = "flex";
        editIcon2.style.display = "flex";
        editButton.style.display = "flex";
        // Style display none à la div "filters"
        filters.style.display = "none";
        // Remplacer le texte "login" par "logout"
        logInOrLogout.innerHTML = '<a href="login.html">logout</a>';
    } else {
        // Style display none à la div "edition-banner", au bouton "Modifier" et à l'icône "fa-pen-to-square"
        editionBanner.style.display = "none";
        editIcon2.style.display = "none";
        editButton.style.display = "none";
        // Style display flex à la div "filters"
        filters.style.display = "flex";
    }
    getWorks();
}

async function getWorks () {
    try {
       const response = await fetch ("http://localhost:5678/api/works")
       console.log(response)
       if (!response.ok) {
        throw new Error ("Une erreur " + response.status + " s'est produite")
       }
       const works = await response.json ()
       for (let work of works) {
        displayWork (work);
        displayWorkModal(work);
       }
      // console.log(works)
    }
    catch (error) {alert(error)}
}
/**
 * Que fait la fonction
 * @param {type du paramètre(ici un Object)} work 
 */
export function displayWork (work) {
    // Sélectionner le composant "gallery"
    const sectionGallery = document.querySelector(".gallery");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");

    // Création d'une classe "fig"
    figureElement.classList.add("fig")

    // Ajouter l'attribut "id" à l'élément "figureElement"
    figureElement.setAttribute("id", "main_" + work.id);

    // Ajout attribut personnalisé "categoryID" à l'élément "figureElement"
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
// Fonction asynchrone pour récup les catégories (idem getWorks)
async function getCategories () {
    try {
       const response = await fetch ("http://localhost:5678/api/categories")
       console.log(response)
       if (!response.ok) {
        throw new Error ("Une erreur " + response.status + " s'est produite")
       }
       const categories = await response.json ()
        displayCategories (categories)
        displaySelectCategories (categories)
    }
    catch (error) {alert(error)}
}

function displayCategories (categories) {

   const filters = document.querySelector(".filters") 

// Créer le bouton "Tous"
        const boutonTous = document.createElement("button")
        boutonTous.setAttribute("data-id", 0)
        boutonTous.classList.add("boutonFiltre")
        boutonTous.textContent = "Tous"
        boutonTous.addEventListener("click", function (event) {
            const id = Number(event.target.dataset.id)
            applyFilter (id)
        })

        filters.appendChild(boutonTous)

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
                applyFilter (id);
            });

            filters.appendChild(boutonFiltreElement)
        }
}

getCategories()

function applyFilter (id) {
const allClass = document.getElementsByClassName("fig")
for (let element of allClass) {
    if (id != 0) {
        console.log(parseInt(element.dataset.cat))
         if (parseInt(element.dataset.cat) != id)
       element.classList.add("hid")
    else {
        if (element.classList.contains("hid")) {
        element.classList.remove("hid")
        }
    }
    } else {
    if (element.classList.contains("hid")) {
        element.classList.remove("hid")
        }
    }
}
}

function activateButton () {
    const allButtons = document.getElementsByClassName("button")
    for (let button of allButtons) {
    button.classList.toggle("activeButtton")
    }
}