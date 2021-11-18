// db.collection("Quiz1").get()
//     .then(
//         snapshot => {
//             snapshot.docs.forEach(doc =>
//                 doc.data()
//             )
//             console.log(snapshot.size);
//         }
//     );


import { renderQuestion, shuffArray } from "./ui.js"
export async function getDataRealtime() {
    let snapshot = await db.collection("Quiz1").onSnapshot(
        sn => {
            let changes = sn.docChanges();
            changes.forEach(
                change => {
                    render(change.doc)
                    console.log(change.type)
                });
        }
    );
}

export const getQuiz = async function() {
    let snapshot = await db.collection("Quiz1").get();
    let countTotal = snapshot.size
    let i = 1;
    let newArray = shuffArray(snapshot.docs);
    newArray.forEach(doc => {
        renderQuestion(doc, i, countTotal)
        i++;
    });
    // console.log(snapshot.docs)
}
export async function insertQuestion(ques, correct_ans, incorrect_ans) {
    await db.collection("Quiz1").add({
        question: ques,
        correct_answer: correct_ans,
        incorrect_answers: incorrect_ans
    });
}
// insertQuestion("What is the most common type of pitch thrown by pitchers in baseball?", '["Slowball", "Screwball", "Palmball"]', "Fastball");
export async function deleteQuestion(id) {
    await db.collection("Quiz1").doc(id).delete();
}
export async function updateQuestion(id, ques, correct_ans, incorrect_ans) {
    await db.collection("Quiz1").doc(id).update({
        question: ques,
        incorrect_answers: incorrect_ans,
        correct_answer: correct_ans
    });
}
export async function getAnswerCorrect(id) {
    let doc = await db.collection("Quiz1").doc(id).get();
    let answerData = doc.data().correct_answer;
    return answerData;
}
export function getUser() {
    return db.collection("Account")
        .get().then((doc) => {
            if (doc.exists) {
                return doc.data();
            }
            return {}
        })
}