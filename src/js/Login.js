import { getUser } from "./firebase.js"
class Login {
    contructor() {
        const btnLogin = document.querySelector('.btnLogin');
        const username = document.querySelector('#username').value.trim();
        const password = document.querySelector('#password').value.trim();
        btnLogin.addEventListener("submit", (e) => {
            getUser().then(data => {
                if (data.username == username && data.password == password) {
                    localStorage.setItem('login', '1');
                    alert("You logged in successfully!");
                } else {
                    alert("Username or password is incorrect!");
                }
            })
            e.preventDefault();
        })
    }
}