import { displayWork } from "./main.js";

// Générer dynamiquement le contenu de la partie ajout de la modale
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

// Un click sur le bouton "Ajouter une photo" ouvre la partie ajout de la modale et vérifie si les champs sont remplis
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
async function deleteWork(id) {
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
      throw new Error("Une erreur " + response.status + " s'est produite");
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
    closeButton1.click();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément :", error);
    alert("Une erreur s'est produite lors de la suppression de l'élément.");
    return;
  }
}

// Fonction qui remplit le sélecteur de catégories dans la partie ajout de la modale
export function displaySelectCategories(categories) {
  const category = document.getElementById("category");
  category.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Sélectionner une catégorie";
  category.appendChild(emptyOption);

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
  if (!localStorage.getItem("token")) {
    return;
  }

  const form = document.getElementById("addPictureForm");
  const formData = new FormData(form);
  const title = formData.get("title");
  const category = formData.get("category");
  const image = formData.get("image");

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
      throw new Error("Une erreur " + response.status + " s'est produite");
    }
    const ret = await response.json();
    console.log(ret);
    // Ici, vous pouvez ajouter le nouvel élément à la galerie si besoin
    displayWorkModal(ret);
    displayWork(ret);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'élément :", error);
    alert("Une erreur s'est produite lors de l'ajout de l'élément.");
    return;
  }
}

// Afficher une miniature de l'image sélectionnée
  // Sélectionner les éléments en rapport avec l'aperçu de l'image
  const preview = document.querySelector("#picturePreview");
  const fileInput = document.querySelector("input[type=file]");

  // Sélectionner les éléments qui vont disparaître pour laisser place à l'aperçu de l'image
  const noPictureYet = document.querySelector("#noPictureYet");
  const labelPicture = document.querySelector("#label-picture");
  const pictureSize = document.querySelector("#pictureSize");

fileInput.addEventListener("change", previewFile());

function previewFile() {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
      // Convertir l'image en string base64
      preview.src = reader.result;
    },
    false,
  );

  if (file) {
    reader.readAsDataURL(file);
    // Cacher les éléments qui ne sont plus nécessaires et afficher la preview
    noPictureYet.style.display = "none";
    labelPicture.style.display = "none";
    pictureSize.style.display = "none";
    preview.style.display = "block";
  }
};

// Quand tous les champs sont remplis, le bouton "Valider" devient cliquable
const titleInput = document.querySelector("#title");
const categoryInput = document.querySelector("#category");
const imageInput = document.querySelector("#image");

titleInput.addEventListener("change", checkFormValidity());
categoryInput.addEventListener("change", checkFormValidity());
imageInput.addEventListener("change", checkFormValidity());

function checkFormValidity() {
  if (titleInput.value !== "" && categoryInput.textContent !== "Sélectionner une catégorie"  && imageInput.files.length > 0) {
    confirmButton.disabled = false;
    confirmButton.style.backgroundColor = "#1D6154";
  } else {
    confirmButton.disabled = true;
  }
}