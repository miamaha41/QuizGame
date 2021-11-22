import { showErrorToast, showSuccessToast } from './toast.js'
import { getAnswerCorrect, updateQuestion, deleteQuestion, insertQuestion, getQuiz } from "./firebase.js"
class Quiz extends HTMLElement {
    static get observedAttributes() {
        return ['index', 'count', 'idQuestion', 'title', 'answers', 'new'];
    }
    constructor() {
        super();
        const template = document.querySelector('.template');
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        const local = localStorage.getItem('login');
        const btnClose = this.shadowRoot.querySelector('.btnClose');
        const btnDel = this.shadowRoot.querySelector('.btnDel');
        const btnEdit = this.shadowRoot.querySelector('.btnEdit');
        const btnAdd = this.shadowRoot.querySelector('.btnAdd');
        const btnClear = this.shadowRoot.querySelector('.btnClear');
        const btnLogout = this.shadowRoot.querySelector('.btnLogout')
        const inputAnswers = this.shadowRoot.querySelectorAll('input:not([type="radio"])');
        const txt = this.shadowRoot.querySelector('.question-tittle');
        if (local == 0) {
            txt.disabled = true;
            Array.from(inputAnswers).forEach((answer) => answer.disabled = true);
            btnClear.style.visibility = 'hidden';
            btnAdd.style.visibility = 'hidden';
            btnEdit.style.visibility = 'hidden';
            btnDel.style.visibility = 'hidden';
            btnLogout.style.visibility = 'hidden';
        } else {
            txt.disabled = false;
            txt.style.border = '1px solid black';
            Array.from(inputAnswers).forEach((answer) => {
                answer.disabled = false;
                answer.style.border = '1px solid';
            });
            btnClear.style.visibility = 'visible';
            btnAdd.style.visibility = 'visible';
            btnEdit.style.visibility = 'visible';
            btnDel.style.visibility = 'visible';
            btnLogout.style.visibility = 'visible';
            btnClose.style.visibility = 'hidden';
        }
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
                case "new":
                    const inputAnswers = this.shadowRoot.querySelectorAll('input:not([type="radio"])');
                    const txt = this.shadowRoot.querySelector('.question-tittle');
                    const count = this.shadowRoot.querySelector('.question-count');
                    console.log(count)
                    count.innerText = "Creat a new question"
                    txt.value = "";
                    txt.setAttribute('placeholder', "Enter question's title");
                    Array.from(inputAnswers).map((answer) => {
                        answer.value = "";
                        answer.setAttribute('placeholder', 'Enter an answer');
                    })
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
            showErrorToast('Please select an answer!');
            return false;
        }
        return true;
    }
    checkAllInput() {
        const inputAnswers = this.shadowRoot.querySelectorAll('input:not([type="radio"])');
        const txt = this.shadowRoot.querySelector('.question-tittle');
        if (txt.value.trim() === "") {
            showErrorToast("Please enter question' title!")
            txt.setAttribute('placeholder', "Enter question's title!");
            return false;
        }
        let checkInput = Array.from(inputAnswers).some(input => input.value.trim() === "");
        if (checkInput) {
            showErrorToast("Please enter all answers!");
            return false;
        }
        return true;
    }
    getQuestionUer() {
        const inputTags = [".answer1", ".answer2", ".answer3", ".answer4"];
        const inputRadios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        const inputAnswers = this.shadowRoot.querySelectorAll('input:not([type="radio"])');
        const txt = this.shadowRoot.querySelector('.question-tittle').value.trim();
        let correctAnsIndex = Array.from(inputRadios).findIndex(radio => radio.checked);
        if (correctAnsIndex < 0) {
            return;
        }
        let correctAns = this.shadowRoot.querySelector(inputTags[correctAnsIndex]).value.trim();
        let otherAnswers = []
        Array.from(inputAnswers).map((answer, index) => {
            if (index != correctAnsIndex) {
                otherAnswers.push(answer.value.trim());
            }
        })
        return { txt, correctAns, otherAnswers };
    }
    connectedCallback() {
        const btnNext = this.shadowRoot.querySelector('.btnNext');
        const btnPrev = this.shadowRoot.querySelector('.btnPrev');
        const btnClose = this.shadowRoot.querySelector('.btnClose');
        const collectionQuiz = document.getElementsByTagName('quiz-questions');
        const btnDel = this.shadowRoot.querySelector('.btnDel');
        const btnEdit = this.shadowRoot.querySelector('.btnEdit');
        const btnAdd = this.shadowRoot.querySelector('.btnAdd');
        const btnClear = this.shadowRoot.querySelector('.btnClear');
        const btnLogout = this.shadowRoot.querySelector('.btnLogout');
        btnLogout.addEventListener('click', () => {
            const check = confirm('Are you sure you want to log out?');
            if (check) {
                localStorage.setItem('login', 0);
                Array.from(collectionQuiz).forEach(question => question.remove());
                showSuccessToast("You logged out successfully!")
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
            return;
        })
        btnClear.addEventListener('click', () => {
            this.clear();
        })
        btnAdd.addEventListener('click', () => {
            const idQuestion = this.getAttribute('idQuestion');
            if (idQuestion) {
                showErrorToast("This question is already in database. Please click button clear to add new question!");
                return;
            }
            if (this.checkRadio() && this.checkAllInput()) {
                let check = confirm('Are you sure you want to add new question!')
                if (check) {
                    const txt = this.getQuestionUer().txt;
                    const correctAns = this.getQuestionUer().correctAns;
                    const otherAnswers = this.getQuestionUer().otherAnswers;
                    insertQuestion(txt, correctAns, otherAnswers).then(() => {
                        showSuccessToast('You created a new question!');
                    }).catch(error => console.log(error))
                    Array.from(collectionQuiz).forEach(question => question.remove());
                    getQuiz().then();
                    return;
                }
                return;
            };
        })
        btnEdit.addEventListener('click', () => {
            const idQuestion = this.getAttribute('idQuestion');
            if (idQuestion) {
                if (this.checkRadio() && this.checkAllInput()) {
                    let check = confirm('Are you sure you want to update this question!')
                    if (check) {
                        const txt = this.getQuestionUer().txt;
                        const correctAns = this.getQuestionUer().correctAns;
                        const otherAnswers = this.getQuestionUer().otherAnswers;
                        updateQuestion(idQuestion, txt, correctAns, otherAnswers).then(() => {
                            showSuccessToast('You updated a question!');
                        }).catch(error => console.log(error))
                        return;
                    }
                    return;
                }
            } else {
                showErrorToast("Can't edit, because this question isn't in database.")
            }
        })
        btnDel.addEventListener('click', () => {
            const idQuestion = this.getAttribute('idQuestion');
            if (idQuestion) {
                let check = confirm('Are you sure you want to delete this question! ')
                if (check) {
                    deleteQuestion(idQuestion).then(() => {
                        showSuccessToast('You deleted a question.')
                        Array.from(collectionQuiz).forEach(question => question.remove());
                        return getQuiz().then();
                    }).catch(error => console.log(error));
                    return;
                }
                return;
            } else {
                showErrorToast("Can't delete, because this question isn't in database.")
            }

        })
        btnNext.addEventListener("click", () => {
            if (this.checkRadio()) {
                this.style.display = 'none';
                if (this == collectionQuiz[collectionQuiz.length - 1]) {
                    let check = confirm('This is last question. Do you want to end this game ?');
                    const local = localStorage.getItem('login');
                    if (check && local == 0) {
                        this.close(collectionQuiz);
                    } else if (check && local == 1) {
                        showSuccessToast("You logged out successfully!")
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000)
                    } else if (!check) {
                        this.style.display = '';
                    }
                }
            }
        })
        btnPrev.addEventListener("click", () => {
            if (this.checkRadio()) {
                if (this == collectionQuiz[0]) {
                    showErrorToast('This is first question. (No previous question)')
                    return;
                }
                this.previousSibling.style.display = '';
            }
        })
        btnClose.addEventListener("click", () => {
            // if (this.checkRadio()) {
            const check = confirm('Are you sure you want to close this quiz game?');
            if (check) {
                this.close(collectionQuiz);
                Array.from(collectionQuiz).forEach(question => question.remove());
            }
            // }
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render(name);
        const inputRadios = this.shadowRoot.querySelectorAll('input[type="radio"]');
        const answers = JSON.parse(this.getAttribute('answers'));
        const idQuestion = this.getAttribute('idQuestion');
        const local = localStorage.getItem('login');
        if (local == 1) {
            let index;
            getAnswerCorrect(idQuestion).then(data => {
                index = answers.findIndex(answer => answer == data);
                inputRadios[index].checked = true;
            }).catch(error => error);
        }
    }
    disconnectedCallback() {}
    checkAnswer() {
        const answerUser = this.shadowRoot.querySelector('input[type="radio"]:checked');
        const idQuestion = this.getAttribute('idQuestion');
        return getAnswerCorrect(idQuestion).then(data => {
            if (answerUser && data == answerUser.value) {
                return true;
            } else {
                return false;
            }
        }).catch(error => showErrorToast(error));

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
            showSuccessToast(`You have ${total}/${this.getAttribute('count')} correct answer(s).`)
            setTimeout(() => {
                window.location.reload();
            }, 5000)
        });
    }
    clear() {
            let check = confirm('Are you sure you want to clear for adding a new question?');
            if (check) {
                const quiz = document.createElement("quiz-questions");
                const app = document.querySelector(".app")
                this.insertAdjacentElement('afterend', quiz);
                this.style.display = 'none';
                quiz.setAttribute('new', 1);
                return;
            }
            return;
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