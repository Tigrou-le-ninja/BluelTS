import { displayWork } from "./main.js";

/**
 * On itère sur chaque élément de la liste "works" de la base de données afin de remplir la div "modalContent1" de la page index.html
 * Détails des manipulations ci-dessous
 * @param {Object} work
 */
export function displayWorkModal(work) {
    // Sélectionner le composant "modalContent1"
    const modalContent1 = document.querySelector(".modalContent1");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");
    figureElement.classList.add("fig");
    figureElement.setAttribute("id", "modal_" + work.id);
    figureElement.dataset.cat = work.categoryId;

    // Création de l'élément image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    // Création du bouton de suppression
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.setAttribute("id", work.id);
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
        deleteWork(work.id);
    });

    // Ajout des éléments à la figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteButton);

    // Ajout de la figure à la modale
    modalContent1.appendChild(figureElement);
}

// Afficher la modale sous forme de boîte de dialogue quand on clique sur le bouton "Modifier"
const dialog = document.querySelector("dialog");
const editButton = document.getElementById("edition");

editButton.addEventListener("click", () => {
    dialog.showModal();
});

// Un click sur la croix ferme la modale (valable pour la partie suppression et ajout)
const closeButton1 = document.getElementById("closeModalBtn1");
const closeButton2 = document.getElementById("closeModalBtn2");

closeButton1.addEventListener("click", () => {
    dialog.close();
});

closeButton2.addEventListener("click", () => {
    dialog.close();
});

// Un click en dehors de la modale la ferme
window.addEventListener("click", (event) => {
    if (typeof dialog !== "undefined" && event.target === dialog) {
        dialog.close();
    }
});

// Navigation entre les deux parties de la modale
const addPictureBtn = document.getElementById("addPictureBtn");
const addPicture = document.getElementById("addPicture");
const editGallery = document.getElementById("editGallery");
const goBackButton = document.getElementById("goBack");

// Un click sur le bouton "Ajouter une photo" ouvre la partie ajout de la modale
addPictureBtn.addEventListener("click", () => {
    addPicture.style.display = "flex";
    editGallery.style.display = "none";
});

// Un click sur le bouton "goBack" ferme la partie ajout de la modale et revient sur la partie suppression
goBackButton.addEventListener("click", () => {
    addPicture.style.display = "none";
    editGallery.style.display = "flex";
});

/**
 * On vérifie l'état de connexion de l'utilisateur avant toute interaction avec l'API
 * Si l'utilisateur est connecté, on envoie l'id du bouton (= l'id du projet) à la base de données et on attend la réponse
 * Si la réponse est positive (= projet supprimé de la base de données), on supprime l'élément de la modale et de la galerie principale
 * Si la suppression échoue, on affiche un message d'erreur
 * @param {Number} id 
 */
async function deleteWork(id) {
    // Vérifie si l'utilisateur est connecté
    if (!localStorage.getItem("token")) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });
        if (!response.ok) {
            throw new Error(
                "Une erreur " + response.status + " s'est produite"
            );
        }
        const figureElement = document.getElementById("modal_" + id);
        if (figureElement) {
            figureElement.remove();
        }
        const figure = document.getElementById("main_" + id);
        if (figure) {
            figure.remove();
        }
        alert("L'élément a été supprimé avec succès.");

        // On ferme la modale après la suppression
        closeButton1.click();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'élément :", error);
        alert("Une erreur s'est produite lors de la suppression de l'élément.");
        return;
    }
}

/**
 * On itère sur chaque élément de la liste "categories" de la base de données afin de remplir le select "category" de la modale
 * Détails des manipulations ci-dessous
 * @param {Object} categories 
 */
export function displaySelectCategories(categories) {
    // On récupère le select "category" de la modale
    const category = document.getElementById("category");
    category.innerHTML = "";

    // On crée une option par défaut qui n'est pas vide
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Sélectionner une catégorie";
    category.appendChild(emptyOption);

    // On itère sur la liste des catégories et on crée une option pour chacune d'entre elles
    for (let cat of categories) {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        category.appendChild(option);
    }
}

// Un click sur le bouton "Valider" de la partie ajout de la modale déclenche la fonction addWork
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => {
    addWork();
});

// Fonction qui ajoute un projet
async function addWork() {
    // Vérifie si l'utilisateur est connecté
    if (!localStorage.getItem("token")) {
        return;
    }

    const form = document.getElementById("addPictureForm");
    const formData = new FormData(form);

    // Vérification des données de formData
    const checkData = (formData) => {
        let ret = true;
        formData.forEach((value, key) => {
            console.log(key + "__" + value);
            if (typeof value === "undefined" || value === "" || value === null)
                ret = false;
        });
        return ret;
    };

    console.log(checkData(formData));

    // Si les données sont valides, on envoie la requête à l'API
    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: "application/json",
            },
            body: formData,
        });

        console.log(response);

        if (!response.ok) {
            throw new Error(
                "Une erreur " + response.status + " s'est produite"
            );
        }
        const ret = await response.json();
        console.log(ret);

        // Ajout du nouvel élément aux galeries
        displayWorkModal(ret);
        displayWork(ret);
        alert("L'élément a été ajouté avec succès.");

        //Réinitialisation du formulaire
        form.reset();
        checkFormValidity();

        // L'aperçu de l'image disparaît, les éléments présents avant réapparaissent
        preview.src = ""; 
        preview.style.display = "none"; 
        noPictureYet.style.display = "block"; 
        labelPicture.style.display = "block"; 
        pictureSize.style.display = "block";

        // pictureZone reprend ses propriétés initiales
        pictureZone.style.padding = "25px 0"; 
        pictureZone.style.height = "119px";

        // On ferme la modale après l'ajout
        closeButton2.click();
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'élément :", error);
        alert("Une erreur s'est produite lors de l'ajout de l'élément.");
        return;
    }
}

// Afficher une miniature de l'image sélectionnée
// Sélectionner les éléments en rapport avec l'aperçu de l'image
const preview = document.querySelector("#picturePreview");

// Sélectionner les éléments dont les propriétés changent à l'aperçu de l'image
const noPictureYet = document.querySelector("#noPictureYet");
const labelPicture = document.querySelector("#label-picture");
const pictureSize = document.querySelector("#pictureSize");
const pictureZone = document.querySelector("#pictureZone");

// Quand tous les champs sont remplis, le bouton "Valider" devient cliquable
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

console.log("titleInput", titleInput);

titleInput.addEventListener("keyup", () => {
    checkFormValidity();
});

categoryInput.addEventListener("change", () => {
    checkFormValidity();
});

imageInput.addEventListener("change", (event) => {
    console.log("Image input changed");
    previewFile(event);
    checkFormValidity();
});

/**
 * Quand l'utilisateur sélectionne une image, on affiche un aperçu de celle-ci
 * On utilise FileReader pour lire le fichier et afficher l'image dans l'élément <img> avec l'id "picturePreview"
 * @param {event} event 
 */
function previewFile(event) {
    console.log("previewFile called");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            // Convertir l'image en string base64
            preview.src = reader.result;
        },
        false
    );
    if (file) {
        reader.readAsDataURL(file);

        // Cacher les éléments qui ne sont plus nécessaires et afficher la preview
        noPictureYet.style.display = "none";
        labelPicture.style.display = "none";
        pictureSize.style.display = "none";
        preview.style.display = "block";

        // pictureZone change de propriétés pour accomoder la preview
        pictureZone.style.padding = "0";
        pictureZone.style.height = "169px";
    }
}

// Vérifier si tous les champs sont remplis pour activer le bouton "Valider"
// Si tous les champs sont remplis, le bouton est activé et sa couleur change
function checkFormValidity() {
    console.log("checkFormValidity called");
    if (
        titleInput.value !== "" &&
        categoryInput.value !== "" &&
        imageInput.files.length > 0
    ) {
        confirmButton.disabled = false;
        confirmButton.style.backgroundColor = "#1D6154";
    } else {
        confirmButton.disabled = true;
        confirmButton.style.backgroundColor = "#A7A7A7";
    }
}