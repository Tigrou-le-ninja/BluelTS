const email = document.getElementById("email")
const password = document.getElementById("password")

let emailInput = email.value
let passwordInput = password.value

form.addEventListener("submit", function(event) {
        event.preventDefault();
        connexion(emailInput.value, passwordInput.value);
        console.log(emailInput.value, passwordInput.value);
    });

 function connexion(email,password) {

 }  