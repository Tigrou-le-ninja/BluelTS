// Les informations de connexion de l'utilisateur sont stockées dans un objet que l'on passe ensuite à la fonction connexion()
const form = document.getElementById("login");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let emailInput = document.getElementById("email").value;
    let passwordInput = document.getElementById("password").value;

    if (emailInput === "" || passwordInput === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    const user = {
        email: emailInput,
        password: passwordInput,
    };
    connexion(user);
});

/**
 * On poste les identifiants de connexion de l'utilisateur à l'API
 * Si la connexion est réussie, on stocke le token dans le localStorage et on redirige vers la page index.html
 * Si la connexion échoue, on affiche un message d'erreur
 * @param {Object} user 
 */
async function connexion(user) {
    const msgError = document.getElementById("login-error");
    msgError.textContent = "";

    try {
        // Poster à l'API et attendre la réponse
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error(
                "Une erreur " + response.status + " s'est produite"
            );
        }
        console.log(response);
        const data = await response.json();
        console.log(data);
        
        localStorage.setItem("token", data.token); 
        window.location.href = "./index.html"; 
    } catch (error) {
        if (msgError) {
            msgError.textContent = "Identifiant ou mot de passe incorrect";
        }
    }
}       