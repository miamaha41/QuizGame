import { getUser } from "./firebase.js"
class Login {
    contructor() {
        const app = document.querySelector('.app');
        const loginForm = document.createElement('div');
        loginForm.classList.add('border');
        loginForm.innerHTML = `
        <div class="title"><span>LOGIN TO EDIT ALL QUESTIONS </span></div>
        <form class="login">
            <label for="username" id="username">Enter your username: </label>
            <input type="text" id="username" class="username" placeholder="" required>
            <label for="password" id="password">Enter your password: </label>
            <input type="password" id="password" class="password" placeholder="" required>
            <button type="submit" class="btnLogin">Login</button>
        </form>`
        app.appendChild(loginForm);
        const btnLogin = document.querySelector('.btnLogin');
        const username = document.querySelector('.username').value;
        const password = document.querySelector('.password').value;
        console.log(username, password);
        btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            firebase.getUser().then(data => {
                if (data.username == username && data.password == password) {
                    localStorage.setItem('login', 1);
                    showSuccessToast("You logged in successfully!");
                } else {
                    showErrorToast("Username or password is incorrect!");
                }
            })
        })
    }
}
export default Login;