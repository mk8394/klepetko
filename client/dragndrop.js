const dndQuestions = [
    {
        question: "7 + 3 = ",
        answer: 10,
    },
    {
        question: "3 + 4 = ",
        answer: 7,
    },
    {
        question: "9 + 2 = ",
        answer: 11,
    },
    {
        question: "6 + 2 = ",
        answer: 8,
    },
    {
        question: "5 + 4 = ",
        answer: 9,
    },
    {
        question: "8 + 5 = ",
        answer: 13,
    }
];

const dnd = document.getElementById('dragndrop');
const dndStartButton = document.getElementById('dnd-start-btn');
const dndFinishButton = document.getElementById('dnd-finish-btn');
const dndExitButton = document.getElementById('dnd-exit-btn');
const dndDraggables = document.querySelectorAll(".dnd-draggable");
const dndQuestionElement = document.getElementById("dnd-question");
const dndAnswerElement = document.getElementById('dnd-draggables');
const dndScore = document.getElementById("dnd-score");
const dndResponse = document.getElementById("dnd-response");
const dndMainText = document.getElementById("dnd-main-text");
const dndContainer = document.getElementById("dnd-question-container");

//dndStartButton.addEventListener('click', dndStart);

dndExitButton.addEventListener('click', dndFinishGame);

let dndCorrectAnswers = 0;
var isCorrect = false;

//function dndStart() {
    dndSetQuestions(dndQuestions);
//}

function dndSetQuestions(questions) {
    dndStartButton.classList.add('hide');
    dndMainText.classList.add('hide');
    dndContainer.classList.remove('hide');
    dndCorrectAnswers = 0;
    dndScore.innerHTML = `Rezultat: 0/6`
    questions.forEach(question => {
        const equation = question.question;
        const newQuestion = document.createElement('div');
        const test = document.createElement('p');
        newQuestion.classList.add("dnd-question");
        newQuestion.dataset.correct = question.answer;
        newQuestion.innerHTML = `<p id="equationFrom">${equation}</p>`;
        dndQuestionElement.appendChild(newQuestion);
        newQuestion.appendChild(test);
    });
}

dndDraggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add("dragging");
    });
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        if (isCorrect) {
            draggable.classList.remove("dnd-draggable");
            draggable.classList.remove("dnd-wrong");
            draggable.classList.add("dnd-correct");
            draggable.draggable = false;
            dndCorrectAnswers++;
            dndScore.innerHTML = `Rezultat: ${dndCorrectAnswers}/6`;
            isCorrect = false;
        } else if (!isCorrect) {
            draggable.classList.remove("dnd-correct");
            draggable.classList.add("dnd-wrong");
        }
        if (dndCorrectAnswers == 6) {
            dndFinishButton.classList.remove('hide');
            dndFinishButton.addEventListener('click', dndFinishGame);
            dndResponse.classList.remove('hide');
            dndResponse.innerHTML = `Čestitke!<br>Pravilno ste odgovorili na vsa vprašanja!`;
        }
    });
});

const questions = document.querySelectorAll(".dnd-question");
questions.forEach(question => {
    question.addEventListener('dragover', e => {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        if (question.childElementCount != 3) {
            question.appendChild(draggable);
            dndCheckAnswer(draggable, question.dataset.correct);
        }
    });
});

function dndCheckAnswer(selectedAnswer, correctAnswer) {
    isCorrect = false;
    const answer = selectedAnswer.innerText;
    if (answer == correctAnswer) isCorrect = true;
    else isCorrect = false;
}

function dndFinishGame() {
    dndCorrectAnswers = 0;
    quizScore.innerHTML = `Rezultat: 0/6`;
    dnd.style.display = "none";
}