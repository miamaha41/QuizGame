import { getUser, getQuiz } from "./firebase.js";
import { showErrorToast, showSuccessToast } from "./toast.js";
import Quiz from "./component.js";
class Login {
    constructor() {
        this.initial();
        this.setup();
    }
    initial() {
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
        const border = document.querySelector('.border');
        const username = document.querySelector('.username');
        const password = document.querySelector('.password');
        this.btnLogin = btnLogin;
        this.btnHome = btnHome;
        this.username = username;
        this.password = password;
        this.border = border;
        this.loginForm = loginForm;
    }
    checkLogin() {
        return getUser().then(data => {
            if (data.username == this.username.value.trim() && data.password == this.password.value.trim()) {
                localStorage.setItem('login', '1');
                showSuccessToast("You logged in successfully!");
                return true;
            } else {
                showErrorToast("Username or password is incorrect!");
                return false;
            }
        })
    }
    setup() {
        this.btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            this.checkLogin().then(values => {
                if (values) {
                    // this.border.style.display = 'none';
                    this.loginForm.remove();
                    window.customElements.define("quiz-questions", Quiz);
                    getQuiz();
                }
            })
        })
        this.btnHome.addEventListener("click", (e) => {
            e.preventDefault();
            this.loginForm.remove();
            const home = document.querySelector('.contain');
            setTimeout(() => home.style.display = '', 500)
        })
    }
}
export default Login;