const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const finishButton = document.getElementById('finish-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const quizContainer = document.getElementById('quiz')
const game = document.getElementById('game')
const chat = document.getElementById('chat')
const score = document.getElementById('score')
const mainText = document.getElementById('main-text')

let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function intro() {
    startButton.classList.remove('hide')
    finishButton.classList.add('hide')
    questionContainerElement.classList.add('hide')
    startButton.addEventListener('click', startGame)
}

function startGame() {
    startButton.classList.add('hide')
    mainText.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    correctAnswers = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        selectedButton.classList.add('correct')
        correctAnswers++
        score.innerHTML = `Rezultat: ${correctAnswers}/5`
    } else {
        selectedButton.classList.add('wrong')
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        mainText.classList.remove('hide')
        if(correctAnswers > 1) mainText.innerHTML = `Čestitke!<br>Vaš rezultat: ${correctAnswers}/5!`
        else mainText.innerHTML = `Žal niste odgovorili na nobeno vprašanje pravilno!`
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
    mainText.innerHTML = "Dobrodošli v kvizu iz matematike!<br>Kviz lahko poskusite s klikom na spodnji gumb"
    quizContainer.style.display = 'none';
    chat.style.display = 'block';
    game.style.display = 'block';
}

const questions = [
    {
        question: 'Koliko je 2 + 2?',
        answers: [
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '3', correct: false },
            { text: '2', correct: false }
        ]
    },
    {
        question: 'Koliko je 4 * 2?',
        answers: [
            { text: '6', correct: false },
            { text: '8', correct: true },
            { text: '0', correct: false },
            { text: '2', correct: false }
        ]
    },
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
    }
]