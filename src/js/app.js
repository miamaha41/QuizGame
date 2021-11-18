import * as firebase from "./firebase.js"
import Quiz from "./component.js"
const btnStart = document.querySelector('.btnStart');
const containStart = document.querySelector('.contain');
const app = document.querySelector('.app');
// localStorage.setItem('countCorrectAnswer', 0);
class QuizGame {

}
btnStart.addEventListener('click',
        () => {
            window.customElements.define("quiz-questions", Quiz);
            firebase.getQuiz();
            containStart.style.display = 'none';
        }
    )
    // const btnLogin = document.querySelector('.btnLogin');
    // const username = document.querySelector('.username').value;
    // const password = document.querySelector('.password').value;
    // console.log(username, password);
    // btnLogin.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     getUser().then(data => {
    //         if (data.username == username && data.password == password) {
    //             localStorage.setItem('login', '1');
    //             alert("You logged in successfully!");
    //         } else {
    //             alert("Username or password is incorrect!");
    //         }
    //     })
    //     window.history.back();
    //     return false;
    // })