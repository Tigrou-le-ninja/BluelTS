// Générer dynamiquement le contenu de la modale

getWorksModal();

async function getWorksModal () {
    try {
       const response = await fetch ("http://localhost:5678/api/works")
       console.log(response)
       if (!response.ok) {
        throw new Error ("Une erreur " + response.status + " s'est produite")
       }
       const works = await response.json ()
       for (let work of works) {
        displayWorkModal (work)
       }
      // console.log(works)
    }
    catch (error) {alert(error)}
}

function displayWorkModal (work) {
    // Sélectionner le composant "modalGallery"
    const modalContent = document.querySelector(".modalContent");

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

    // Création de l'élément "deleteButton", d'une classe "deleteButton" et d'un id qui est celui du work concerné, et d'une icône pour le bouton
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.setAttribute("id", work.id); // INUTILE
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      deleteWork(work.id);
    })

    // Insérer les éléments image, figcaption et deleteButton dans l'élement figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteButton);

    // Insérer l'élément figure dans la section "modalContent"
    modalContent.appendChild(figureElement);
}

// Afficher la modale sous forme de boîte de dialogue quand on clique sur le bouton "Modifier"
const dialog = document.querySelector("dialog");
const editButton = document.getElementById("edition");
const closeButton = document.getElementById("closeModalBtn");

editButton.addEventListener("click", () => {
  dialog.showModal();
});

// Un click sur la croix ferme la modale
closeButton.addEventListener("click", () => {
  dialog.close();
});

// Un click en dehors de la modale la ferme
window.addEventListener("click", (event) => {
  if (typeof dialog !== "undefined" && event.target === dialog) {
    dialog.close();
  }
});

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
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
} catch (error) {
  console.error("Erreur lors de la suppression de l'élément :", error);
  alert("Une erreur s'est produite lors de la suppression de l'élément.");
  return;
}}