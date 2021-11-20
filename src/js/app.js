import * as firebase from "./firebase.js";
import Quiz from "./component.js";
import { showErrorToast, showSuccessToast } from "./toast.js";
import Login from "./login.js"
const btnStart = document.querySelector('.btnStart');
const containStart = document.querySelector('.contain');
const app = document.querySelector('.app');
const btnAdmin = document.querySelector('.btnAdmin');
class QuizGame {}

function checkLogin() {
    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;
    return firebase.getUser().then(data => {
        if (data.username == username && data.password == password) {
            localStorage.setItem('login', '1');
            showSuccessToast("You logged in successfully!");
            return true;
        } else {
            showErrorToast("Username or password is incorrect!");
            return false;
        }
    })
}
btnStart.addEventListener('click', (e) => {
    e.preventDefault();
    window.customElements.define("quiz-questions", Quiz);
    localStorage.setItem('login', 0);
    firebase.getQuiz();
    containStart.style.display = 'none';
})
btnAdmin.addEventListener('click', () => {
    containStart.style.display = 'none';
    const app = document.querySelector('.app');
    const loginForm = document.createElement('div');
    loginForm.classList.add('border');
    loginForm.innerHTML = `
    <div class="title"><span>LOGIN TO EDIT ALL QUESTIONS </span></div>
    <form class="login">
        <label for="username" id="username">Enter your username: </label>
        <input type="text" id="username" class="username"  required>
        <label for="password" id="password">Enter your password: </label>
        <input type="password" id="password" class="password" required>
        <button type="submit" class="btnLogin">Login</button>
        <i class="fas fa-home home"> back to home</i>
    </form>`
    app.appendChild(loginForm);
    const btnLogin = document.querySelector('.btnLogin');
    const btnHome = document.querySelector('.home');
    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        checkLogin().then(values => {
            if (values) {
                const border = document.querySelector('.border');
                border.style.display = 'none';
                window.customElements.define("quiz-questions", Quiz);
                firebase.getQuiz();
            }
        })
    })
    btnHome.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.remove();
        const home = document.querySelector('.contain');
        setTimeout(() => home.style.display = '', 500)

    })
})