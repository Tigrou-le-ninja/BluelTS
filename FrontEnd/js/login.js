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

async function connexion(user) {
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

        (data) => {
            localStorage.setItem("token", data.token); 
            window.location.href = "./index.html"; 
        }
    } catch (error) {
        alert(error);
    }
}