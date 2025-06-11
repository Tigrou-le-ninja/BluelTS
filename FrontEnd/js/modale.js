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
    figureElement.setAttribute("id", work.id);

    // Ajout attribut personnalisé "categoryID" à l'élément "figureElement"
    figureElement.dataset.cat = work.categoryId;

    // Création de l'élément image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    // Insérer les éléments image et figcaption dans l'élement figure
    figureElement.appendChild(imageElement);

    // Insérer l'élément figure dans la section "modalGallery"
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