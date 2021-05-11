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
]

const dnd = document.getElementById('dragndrop')
const dndstartButton = document.getElementById('dnd-start-btn')
const dndfinishButton = document.getElementById('dnd-finish-btn')
const dndexitButton = document.getElementById('dnd-exit-btn')
const draggables = document.querySelectorAll(".dnd-draggable")
const dndQuestionElement = document.getElementById("dnd-question")
const dndScore = document.getElementById("dnd-score")
const dndResponse = document.getElementById("dnd-response")
const dndMainText = document.getElementById("dnd-main-text")
const dndContainer = document.getElementById("dnd-question-container")

function dndintro() {
    dndstartButton.classList.remove('hide')
    dndstartButton.addEventListener('click', () => {
        setQuestions(dndQuestions);
    })
}

let dndCorrectAnswers = 0
var isCorrect = false

function dndSetQuestions(questions) {
    dndContainer.classList.remove('hide')
    dndMainText.classList.add('hide')
    dndstartButton.classList.add('hide')
    questions.forEach(question => {
        const equation = question.question
        const newQuestion = document.createElement('div')
        newQuestion.classList.add("dnd-question")
        newQuestion.innerText = equation
        newQuestion.dataset.correct = question.answer
        newQuestion.dataset.answered = question.answered
        dndQuestionElement.appendChild(newQuestion)
    })
}

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add("dragging")
    })
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
        if (isCorrect) {
            draggable.classList.remove("dnd-draggable")
            draggable.classList.add("dnd-correct")
            dndCorrectAnswers++
            dndScore.innerHTML = `Rezultat: ${correctAnswers}/6`
        } else if (!isCorrect) {
            draggable.classList.remove("dnd-correct")
            draggable.classList.add("dnd-wrong")
        }
    })
})

const questions = document.querySelectorAll(".dnd-question")
questions.forEach(question => {
    question.addEventListener('dragover', e => {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        question.appendChild(draggable);
        dndCheckAnswer(draggable, question.dataset.correct);
    })
})

function dndCheckAnswer(selectedAnswer, correctAnswer) {
    const answer = selectedAnswer.innerHTML;
    if (answer == correctAnswer) isCorrect = true;
    else isCorrect = false;
}

function dndFinish() {
    dndIntro();
    dnd.style.display = "none";
    chat.style.display = "block";
    game.style.display = "block";
}