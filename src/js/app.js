import * as firebase from "./firebase.js";
import Quiz from "./component.js";
// import { showErrorToast, showSuccessToast } from "./toast.js";
import Login from "./login.js"
class QuizGame {
    btnStart;
    containStart;
    btnAdmin;
    constructor() {
        const btnStart = document.querySelector('.btnStart');
        const containStart = document.querySelector('.contain');
        const btnAdmin = document.querySelector('.btnAdmin');
        this.btnStart = btnStart;
        this.containStart = containStart;
        this.btnAdmin = btnAdmin;
        console.log(btnStart, btnAdmin);
        console.log(btnStart, btnAdmin);
        this.setup();
    }
    setup() {
        this.btnStart.addEventListener('click', () => {
            window.customElements.define("quiz-questions", Quiz);
            localStorage.setItem('login', 0);
            firebase.getQuiz();
            this.containStart.style.display = 'none';
        });
        this.btnAdmin.addEventListener('click', () => {
            this.containStart.style.display = 'none';
            const login = new Login();
        });
    }
}
const game = new QuizGame();