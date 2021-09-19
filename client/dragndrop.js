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
//const dndStartButton = document.getElementById('dnd-start-btn');
const dndCheckButton = document.getElementById('dnd-check-btn');
const dndFinishButton = document.getElementById('dnd-finish-btn');
const dndExitButton = document.getElementById('dnd-exit-btn');
const dndAnswersElement = document.getElementById("dnd-draggables")
const dndQuestionElement = document.getElementById("dnd-question");
const dndScore = document.getElementById("dnd-score");
const dndResponse = document.getElementById("dnd-response");
const dndMainText = document.getElementById("dnd-main-text");
const dndContainer = document.getElementById("dnd-question-container");

dndExitButton.addEventListener('click', dndFinishGame);

let dndCorrectAnswers = 0;
let dndAnswered = 0;

dndStartGame();

function dndStartGame() {
    dndSetQuestions(dndQuestions);
    dndSetAnswers(dndQuestions);
    //dndStartButton.classList.add('hide');
    //dndMainText.classList.add('hide');
    //dndContainer.classList.remove('hide');
    dndFinishButton.classList.add("hide");
    dndMainText.classList.remove("hide");
    dndCorrectAnswers = 0;
    dndScore.innerHTML = `Rezultat: 0/6`;
}

function dndSetQuestions(questions) {
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

function dndSetAnswers(questions) {
    questions.forEach(question => {
        const newDraggable = document.createElement("p");
        newDraggable.innerText = question.answer;
        newDraggable.classList.add("dnd-draggable");
        newDraggable.draggable = true;
        dndAnswersElement.appendChild(newDraggable);
    });
}

const dndDraggables = document.querySelectorAll(".dnd-draggable");
dndDraggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add("dragging");
        draggable.style.margin = 20;
    });
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        dndAnswered++;
    });
});

const questions = document.querySelectorAll(".dnd-question");
questions.forEach(question => {
    question.addEventListener('dragover', e => {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        if (question.childElementCount != 3) {
            question.appendChild(draggable);
            draggable.dataset.answer = question.dataset.correct;
            draggable.style.margin = 0;
            if (dndAnswered == 1) {
                dndCheckButton.classList.remove("hide");
            }
        }
    });
});

dndCheckButton.addEventListener("click", function() {
    dndCheckAnswers();
});

function dndCheckAnswers() {
    dndDraggables.forEach(draggable => {
        var correctAnswer = draggable.dataset.answer;
        var answer = draggable.innerText;
        draggable.draggable = false;
        if (correctAnswer == answer) {
            dndCorrectAnswers++;
            draggable.classList.add("dnd-correct");
        } else {
            draggable.classList.add("dnd-wrong");
        };
        draggable.style.margin = "10px";
    });
    if (dndCorrectAnswers == 0) dndResponse.innerText = `Žal nisi pravilno izračunal nobenega računa :(`
    if (dndCorrectAnswers == 1) dndResponse.innerText = `Pravilno si povezal ${dndCorrectAnswers} matematični račun!`
    if (dndCorrectAnswers == 2) dndResponse.innerText = `Pravilno si povezal ${dndCorrectAnswers} matematična računa!`
    if (dndCorrectAnswers == 3) dndResponse.innerText = `Pravilno si povezal ${dndCorrectAnswers} matematične račune!`
    if (dndCorrectAnswers == 6) dndResponse.innerText = `Pravilno si povezal vseh ${dndCorrectAnswers} matematičnih računov! :)`
    dndScore.innerHTML = `Rezultat: ${dndCorrectAnswers}/6`;
    dndCheckButton.classList.add("hide");
    dndFinishButton.classList.remove("hide");
    dndResponse.classList.remove("hide");
    dndMainText.classList.add("hide");
}

dndFinishButton.addEventListener("click", function() {
    dndFinishGame();
});

function dndRemoveElements() {
    dndQuestionElement.innerHTML = "";
    dndAnswersElement.innerHTML = "";
}

function dndFinishGame() {
    dndScore.innerHTML = `Rezultat: 0/6`;
    dnd.style.display = "none";
    dndResponse.classList.add("hide");
    dndAnswered = 0;
    dndCorrectAnswers = 0;
    dndRemoveElements();
    dndStartGame();
}