export function renderQuestion(doc, index, countTotalQuestion) {
    const quiz = document.createElement("quiz-questions");
    const app = document.querySelector(".app")
    app.appendChild(quiz);
    let data = doc.data()
    quiz.setAttribute('idQuestion', doc.id)
    quiz.setAttribute('index', index);
    quiz.setAttribute('count', countTotalQuestion);
    quiz.setAttribute('title', data.question);
    const answerArray = shuffArray([...data.incorrect_answers, data.correct_answer]);
    // quiz.setAttribute('answers', [...answerArray]);
    // console.log(answerArray);
    quiz.setAttribute('answers', JSON.stringify(answerArray));
    // quiz.setAttribute('answer1', answerArray[0]);
    // quiz.setAttribute('answer2', answerArray[1]);
    // quiz.setAttribute('answer3', answerArray[2]);
    // quiz.setAttribute('answer4', answerArray[3]);
}
export function shuffArray(array) {
    let j, tmp;
    for (let i = array.length - 1; i >= 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
export function checkAnswer(answerUser, data, countCorrectAnswer) {
    if (answerUser === data) {
        countCorrectAnswer++;
    }
}