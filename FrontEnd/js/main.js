async function getWorks () {
    try {
       const response = await fetch ("http://localhost:5678/api/works")
       console.log(response)
       if (!response.ok) {
        throw new Error ("Une erreur " + response.status + " s'est produite")
       }
       const works = await response.json ()
       for (let work of works) {
        displayWork (work)
       }
      // console.log(works)
    }
    catch (error) {alert(error)}
}

getWorks()

function displayWork (work) {
    // Sélectionner le composant "gallery"
    const sectionGallery = document.querySelector(".gallery");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");

    // Ajouter l'attribut "id" à l'élément "figureElement"
    figureElement.setAttribute("id", work.id);

    // Ajout attribut personnalisé "categoryID" à l'élément "figureElement"
    figureElement.dataset.categoryId = work.categoryId;

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

// Créer un bouton pour chaque catégorie
        for (let category of categories) {
            // Création du bouton
            const boutonFiltreElement = document.createElement("button");

            // Définir l'attribut data-id
            boutonFiltreElement.setAttribute("data-id", category.id);

            // Ajouter la classe CSS
            boutonFiltreElement.classList.add("boutonFiltre");

            // Sélectionner le bouton filtre selon la catégorie
            if (category.id === filterCategoryId)
                boutonFiltreElement.classList.add("boutonFiltreActive");

            // Définir le texte du bouton
            boutonFiltreElement.textContent = category.name;

            // Ajouter le bouton dans la barre des filtres
            boutonsFiltreElement.appendChild(boutonFiltreElement);

            // Créer une fonction d'évènement "click" pour le bouton
            boutonFiltreElement.addEventListener("click", function (event) {
                // Identifiant de la catégorie contenu dans le bouton
                const id = Number(event.target.dataset.id);

                // Sélectionner le bouton filtre en fonction de la catégorie
                selectionButtonFilter(id);

                // Appliquer le filtre en fonction de l'identifiant catégorie
                applyFilter(id);
            });