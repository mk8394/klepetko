const startButton = document.getElementById('quiz-start-btn')
const nextButton = document.getElementById('quiz-next-btn')
const finishButton = document.getElementById('quiz-finish-btn')
const exitButton = document.getElementById('quiz-exit-btn')
const questionContainerElement = document.getElementById('quiz-question-container')
const answerButtonsElement = document.getElementById('quiz-answer-buttons')
const quizContainer = document.getElementById('quiz')
const photoElement = document.getElementById('quiz-photo')
const score = document.getElementById('quiz-score')
const mainText = document.getElementById('quiz-main-text')
const response = document.getElementById("quiz-response")
const game = document.getElementById('game')
const chat = document.getElementById('chat')

let shuffledQuestions, currentQuestionIndex
let quizCorrectAnswers = 0

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

exitButton.addEventListener('click', () => {
    finishGame();
})

function intro() {
    startButton.classList.remove('hide')
    finishButton.classList.add('hide')
    questionContainerElement.classList.add('hide')
    startButton.addEventListener('click', startGame)
    mainText.classList.remove('hide')
}

function startGame() {
    startButton.classList.add('hide')
    mainText.classList.add('hide')
    shuffledQuestions = quizQuestions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    photoElement.innerHTML = `<img src="${question.photo}">`
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        button.classList.add('quiz-answer-button')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }  
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    nextButton.classList.add('hide')
    response.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        selectedButton.style.color = "#f1eb49"
        selectedButton.style.backgroundColor = "#75C165"
        selectedButton.style.border = "2px solid #f1eb49"
        response.classList.remove("hide");
        quizCorrectAnswers++
        score.innerHTML = `Rezultat: ${quizCorrectAnswers}/2`
        response.innerHTML = "Pravilen odgovor!"
    } else {
        selectedButton.style.color = "#f1eb49"
        selectedButton.style.backgroundColor = "#ef474c"
        selectedButton.style.border = "2px solid #f1eb49"
        response.classList.remove("hide");
        response.innerHTML = "Žal si izbral napačen odgovor :("
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        if(quizCorrectAnswers > 0) response.innerHTML = `Čestitke!<br>Vaš rezultat: ${quizCorrectAnswers}/2!`
        else response.innerHTML = `Žal nisi odgovorili na nobeno vprašanje pravilno :(`
        finishButton.classList.remove('hide')
        finishButton.addEventListener('click', finishGame)
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true
    })
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

function finishGame() {
    resetState();
    intro();
    score.innerHTML = `Rezultat: 0/2`
    quizCorrectAnswers = 0
    quizContainer.style.display = 'none';
    chat.style.display = 'block';
    game.style.display = 'block';
}

const quizQuestions = [
    {
        photo: "assets/Klepetko_Games_Jabolko-07.png",
        answers: [
            { text: 'APPLE', correct: true },
            { text: 'BANANA', correct: false },
            { text: 'PEAR', correct: false },
            { text: 'CAR', correct: false }
        ]
    },
    {
        photo: 'assets/Klepetko_Games_Jabolko-07.png',
        answers: [
            { text: 'APPLE', correct: true },
            { text: 'BANANA', correct: false },
            { text: 'PEAR', correct: false },
            { text: 'CAR', correct: false }
        ]
    }
    /*
    {
        question: 'Koliko je 5 + 3?',
        answers: [
            { text: '6', correct: false },
            { text: '8', correct: true },
            { text: '0', correct: false },
            { text: '2', correct: false }
        ]
    },
    {
        question: 'Koliko je 0 * 2?',
        answers: [
            { text: '6', correct: false },
            { text: '8', correct: false},
            { text: '0', correct: true },
            { text: '2', correct: false }
        ]
    },
    {
        question: 'Koliko je 1 * 100?',
        answers: [
            { text: '6', correct: false },
            { text: '8', correct: false},
            { text: '100', correct: true },
            { text: '2', correct: false }
        ]
    }*/
]