import { getAnswerCorrect, updateQuestion, deleteQuestion, insertQuestion, getQuiz } from "./firebase.js"
class Quiz extends HTMLElement {
    static get observedAttributes() {
        return ['index', 'count', 'idQuestion', 'title', 'answers'];
    }
    constructor() {
        super();
        const template = document.querySelector('.template');
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
    render(nameAttribute) {
            switch (nameAttribute) {
                case "index":
                case "count":
                    const index = this.shadowRoot.querySelector(".question-count");
                    index.innerText = `Quiz: ${this.getAttribute('index')}/${this.getAttribute('count')}`;
                    break;
                case "title":
                    const title = this.shadowRoot.querySelector(".question-tittle");
                    title.innerText = this.getAttribute('title');
                    break;
                case "answers":
                    /**
                     * @type Array.<String>
                     */
                    const answers = JSON.parse(this.getAttribute("answers"));
                    const inputTags = [".answer1", ".answer2", ".answer3", ".answer4"];
                    /**
                     * @type HTMLCollectionOf.<HTMLInputElement>
                     */
                    const inputRadios = this.shadowRoot.querySelectorAll('input[type=radio]');
                    answers.forEach((ans, index) => {
                        const label = this.shadowRoot.querySelector(inputTags[index]);
                        label.value = ans;
                        inputRadios[index].value = ans;
                    });
                    break;
            }
        }
        /**
         * Check if no answer is selected 
         * @return {Boolean} *false* if no answer is selected
         */
    checkRadio() {
        /**
         * @type Array.<Nodelist>
         */
        const checkRadios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        if (Array.from(checkRadios).every(checkRadio => !checkRadio.checked)) {
            alert('Please select an answer.')
            return false;
        }
        return true;
    }
    editQuestion() {
        const inputTags = [".answer1", ".answer2", ".answer3", ".answer4"];
        const inputRadios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        const inputAnswers = this.shadowRoot.querySelectorAll('input:not([type="radio"])');
        const txt = this.shadowRoot.querySelector('.question-tittle').value;
        const idQuestion = this.getAttribute('idQuestion');
        let correctAnsIndex = Array.from(inputRadios).findIndex(radio => radio.checked);
        if (correctAnsIndex < 0) {
            return;
        }
        let correctAns = this.shadowRoot.querySelector(inputTags[correctAnsIndex]);
        let otherAnswers = []
        Array.from(inputAnswers).map((answer, index) => {
            if (index != correctAnsIndex) {
                otherAnswers.push(answer.value);
            }
        })
        updateQuestion(idQuestion, txt, correctAns.value, otherAnswers).then(() => {
            alert('Edit successfully');
        }).catch(error => console.log(error))
    }
    connectedCallback() {
        const btnNext = this.shadowRoot.querySelector('.btnNext');
        const btnPrev = this.shadowRoot.querySelector('.btnPrev');
        const btnClose = this.shadowRoot.querySelector('.btnClose');
        const collectionQuiz = document.getElementsByTagName('quiz-questions');
        const btnDel = this.shadowRoot.querySelector('.btnDel');
        const btnEdit = this.shadowRoot.querySelector('.btnEdit');
        const btnAdd = this.shadowRoot.querySelector('.btnAdd');
        btnAdd.addEventListener('click', () => {
            document.createElement("quiz-questions", Quiz)
            this.style.display = 'none';
        })
        btnEdit.addEventListener('click', () => {
            if (this.checkRadio()) {
                let check = confirm('Are you sure to update this question!')
                if (check) {
                    this.editQuestion();
                    return;
                }
                return;
            };
        })
        btnDel.addEventListener('click', () => {
            let check = confirm('Are you sure to delete this question! ')
            const idQuestion = this.getAttribute('idQuestion');
            if (check) {
                deleteQuestion(idQuestion).then(alert('Delete successfully'));
                getQuiz().then();
                this.style.display = 'none';
                return;
            }
            return;
        })
        btnNext.addEventListener("click", () => {
            if (this.checkRadio()) {
                this.style.display = 'none';
                if (this == collectionQuiz[collectionQuiz.length - 1]) {
                    let check = confirm('This is last question. Do you want to end this game ?');
                    if (check) {
                        this.close(collectionQuiz);
                    } else {
                        this.style.display = '';
                    }
                }
            }
        })
        btnPrev.addEventListener("click", () => {
            if (this.checkRadio()) {
                if (this == collectionQuiz[0]) {
                    alert('This is first question. (No previous question)')
                }
                this.previousSibling.style.display = '';
            }
        })
        btnClose.addEventListener("click", () => {
            if (this.checkRadio()) {
                const check = confirm('Are you sure to close this game?');
                if (check) {
                    this.close(collectionQuiz);
                }
            }
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render(name);
    }
    disconnectedCallback() {}

    checkAnswer() {
        const answerUser = this.shadowRoot.querySelector('input[type="radio"]:checked');
        const idQuestion = this.getAttribute('idQuestion');
        return getAnswerCorrect(idQuestion).then(data => data == answerUser.value);

        // return getAnswerCorrect(idQuestion).then(data => {
        //     if (data == answerUser.value) {
        //         let total = parseInt(localStorage.getItem("total"))
        //         if (isNaN(total)) {
        //             total = 1;
        //         } else {
        //             total += 1
        //         }
        //         localStorage.setItem("total", total);
        //         return data;
        //     }
        // });
    }
    close(collectionQuiz) {
        localStorage.setItem("total", 0)
        let promises = Array.from(collectionQuiz).map(q => {
            return q.checkAnswer()
        })
        Promise.all(promises).then((values) => {
            /**
             * @type Array.<Boolean>
             */
            const results = values;
            let total = 0;
            results.forEach(item => {
                total += item ? 1 : 0;
            });
            localStorage.setItem("total", total);
            alert(`You have ${total}/${this.getAttribute('count')} correct answer(s).`)
        });
    }

    /**
     * Calculate the sum of 2 numbers   
     * @param {Number} a first number
     * @param {Number} b second number
     * @param {Object} options Options
     * @param {String | Number} options.a 
     * @returns {Number} sum of 2 number
     * @author Hai Yen 11.11.2021 <miamaha41@gmail.com>
     */
    // sum(a, b, options = {}) {}
}
export default Quiz;