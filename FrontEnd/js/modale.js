import {getCategories} from "./categories.js";

// Générer dynamiquement le contenu de la partie ajout de la modale
export function displayWorkModal (work) {
    // Sélectionner le composant "modalContent1"
    const modalContent1 = document.querySelector(".modalContent1");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");

    // Création d'une classe "fig"
    figureElement.classList.add("fig")

    // Ajouter l'attribut "id" à l'élément "figureElement"
    figureElement.setAttribute("id", "modal_" + work.id);

    // Ajout attribut personnalisé "categoryID" à l'élément "figureElement"
    figureElement.dataset.cat = work.categoryId;

    // Création de l'élément image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    // Création de l'élément "deleteButton", d'une classe "deleteButton", d'un id qui est celui du work concerné, et d'une icône pour le bouton
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.setAttribute("id", work.id); // INUTILE
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      deleteWork(work.id); // Fonction commence ligne 107
    })

    // Insérer les éléments image, figcaption et deleteButton dans l'élement figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteButton);

    // Insérer l'élément figure dans la section "modalContent"
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


// Fonction qui supprime un projet
async function deleteWork (id) {
  // Vérifier si l'utilisateur est connecté
  if (!localStorage.getItem("token")) {
    return;
  }

  // Appel à l'API par la route DELETE
  try {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  if (!response.ok) {
    throw new Error("Une erreur " + response.status + " s'est produite");
  }
  // Supprimer l'élément de la galerie et de la moddale
  const figureElement = document.getElementById("modal_" + id);
  if (figureElement) {
    figureElement.remove();
  }
  const figure = document.getElementById("main_" + id);
  if (figure) {
    figure.remove();
  }
  alert("L'élément a été supprimé avec succès.");
  closeButton1.click(); // Fermer la modale après la suppression
} catch (error) {
  console.error("Erreur lors de la suppression de l'élément :", error);
  alert("Une erreur s'est produite lors de la suppression de l'élément.");
  return;
}}

// Fonction qui remplit le sélecteur de catégories dans la partie ajout de la modale
export async function displaySelectCategories (categories) {
  // // Sélectionner le sélecteur de catégories
  // const selectCategory = document.getElementById("selectCategory");

  // // Vider le sélecteur avant de le remplir
  // selectCategory.innerHTML = "";

  // // Créer une option vide pour la sélection
  // const emptyOption = document.createElement("option");
  // emptyOption.value = "";
  // emptyOption.textContent = "Sélectionner une catégorie";
  // selectCategory.appendChild(emptyOption);

  // // Remplir le sélecteur avec les catégories
  // for (let category of categories) {
  //   const option = document.createElement("option");
  //   option.value = category.id;
  //   option.textContent = category.name;
  //   selectCategory.appendChild(option);
  // }
}

// Un click sur le bouton "Valider" de la partie ajout de la modale déclenche la fonction addWork
const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => {
  addWork();
});

// Fonction qui ajoute un projet
async function addWork() {
  // Vérifier si l'utilisateur est connecté
  if (!localStorage.getItem("token")) {
    return;
  }

  // Récupération des données du formulaire
  const form = document.getElementById("addPictureForm");
  const formData = new FormData(form);
  const title = formData.get("title");
  const categoryId = formData.get("selectCategory");
  const picture = formData.get("picture");

  // Appel à l'API par la route POST avec les données du formulaire
    try {
  const response = await fetch(`http://localhost:5678/api/works`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  if (!response.ok) {
    throw new Error("Une erreur " + response.status + " s'est produite");
  }
  // Supprimer l'élément de la galerie et de la moddale
  const figureElement = document.getElementById("modal_" + id);
  if (figureElement) {
    figureElement.remove();
  }
  const figure = document.getElementById("main_" + id);
  if (figure) {
    figure.remove();
  }
  alert("L'élément a été supprimé avec succès.");
  closeButton1.click(); // Fermer la modale après la suppression
} catch (error) {
  console.error("Erreur lors de la suppression de l'élément :", error);
  alert("Une erreur s'est produite lors de la suppression de l'élément.");
  return;
}}