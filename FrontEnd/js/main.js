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
    }
    catch (error) {alert(error)}
}

function displayCategories (categories) {

   const filters = document.querySelector(".filters") 
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

                // Sélectionner le bouton filtre en fonction de la catégorie
                // selectionButtonFilter(id); --> fonction activeButton

                // Appliquer le filtre en fonction de l'identifiant catégorie
                applyFilter(id);
            });

            filters.appendChild(boutonFiltreElement)
        }
}

getCategories()

function applyFilter (id) {
console.log(id)
const allClass = document.getElementsByClassName("fig")
for (let element of allClass) {
    console.log(element.dataset.cat)
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

/**
 * Sort projects by categs
 * @param {Evenment} e
 */
const sortByCat = (e) => {
    const allClass = document.getElementsByClassName("fig");
    for (let elem of allClass) {
        //id = 0 ==> categs ALL
        if (e.target.id !== "0") {
            if (elem.dataset.cat !== e.target.id) {
                elem.classList.add("hid");
            } else {
                if (elem.classList.contains("hid"))
                    elem.classList.remove("hid");
            }
        } else {
            if (elem.classList.contains("hid")) elem.classList.remove("hid");
        }
    }
};