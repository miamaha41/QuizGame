import * as firebase from "./firebase.js"
import Quiz from "./component.js"
const btnStart = document.querySelector('.btnStart');
const containStart = document.querySelector('.contain');
const app = document.querySelector('.app');
// localStorage.setItem('countCorrectAnswer', 0);
class QuizGame {
    totalQuestion;
    countCorrectAnswer;
    indexQuestion;
    contructor() {}
    startGame() {
        countCorrectAnswer = 0;
    }
}
btnStart.addEventListener('click',
    () => {
        window.customElements.define("quiz-questions", Quiz);
        firebase.getQuiz();
        containStart.style.display = 'none';
    }
)