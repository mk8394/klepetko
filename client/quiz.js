const quizStartButton = document.getElementById('quiz-start-btn');
const quizNextButton = document.getElementById('quiz-next-btn');
const quizFinishButton = document.getElementById('quiz-finish-btn');
const quizExitButton = document.getElementById('quiz-exit-btn');
const quizQuestionContainer = document.getElementById('quiz-question-container');
const quizAnswerButtons = document.getElementById('quiz-answer-buttons');
const quizContainer = document.getElementById('quiz');
const quizPhotoElement = document.getElementById('quiz-photo');
const quizScore = document.getElementById('quiz-score');
const quizMainText = document.getElementById('quiz-main-text');
const quizResponse = document.getElementById("quiz-response");

let shuffledQuestions, currentQuestionIndex;
let quizCorrectAnswers = 0;

quizStartButton.addEventListener('click', quizStart);
quizNextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    quizSetNextQuestion();
});

quizExitButton.addEventListener('click', () => {
    quizFinishGame();
});

function quizIntro() {
    quizStartButton.classList.remove('hide');
    quizFinishButton.classList.add('hide');
    quizQuestionContainer.classList.add('hide');
    quizStartButton.addEventListener('click', quizStart);
    quizMainText.classList.remove('hide');
}

function quizStart() {
    quizStartButton.classList.add('hide');
    quizMainText.classList.add('hide');
    shuffledQuestions = quizQuestions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    quizQuestionContainer.classList.remove('hide');
    quizSetNextQuestion();
}

function quizSetNextQuestion() {
    quizResetState();
    quizShowQuestion(shuffledQuestions[currentQuestionIndex]);
}

function quizShowQuestion(question) {
    quizPhotoElement.innerHTML = `<img src="${question.photo}">`;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.classList.add('quiz-answer-button');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', quizSelectAnswer);
        quizAnswerButtons.appendChild(button);
    });
}

function quizResetState() {
    quizNextButton.classList.add('hide');
    quizResponse.classList.add('hide');
    while (quizAnswerButtons.firstChild) {
        quizAnswerButtons.removeChild(quizAnswerButtons.firstChild);
    }
}

function quizSelectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        selectedButton.style.color = "#f1eb49";
        selectedButton.style.backgroundColor = "#75C165";
        selectedButton.style.border = "2px solid #f1eb49";
        quizResponse.classList.remove("hide");
        quizCorrectAnswers++;
        quizScore.innerHTML = `Rezultat: ${quizCorrectAnswers}/5`;
        quizResponse.innerHTML = "Pravilen odgovor!";
    } else {
        selectedButton.style.color = "#f1eb49";
        selectedButton.style.backgroundColor = "#ef474c";
        selectedButton.style.border = "2px solid #f1eb49";
        quizResponse.classList.remove("hide");
        quizResponse.innerHTML = "Žal si izbral napačen odgovor :(";
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        quizNextButton.classList.remove('hide');
    } else {
        if (quizCorrectAnswers > 0) quizResponse.innerHTML = `Čestitke!<br>Vaš rezultat: ${quizCorrectAnswers}/5!`;
        else quizResponse.innerHTML = `Žal nisi odgovorili na nobeno vprašanje pravilno :(`;
        quizFinishButton.classList.remove('hide');
        quizFinishButton.addEventListener('click', quizFinishGame);
    }
    Array.from(quizAnswerButtons.children).forEach(button => {
        button.disabled = true;
    });
}

function quizFinishGame() {
    quizResetState();
    quizIntro();
    quizScore.innerHTML = `Rezultat: 0/5`;
    quizCorrectAnswers = 0;
    quizContainer.style.display = 'none';
}

const quizQuestions = [
    {
        photo: "assets/Quiz/Klepetko_Anglescina_Igra-07.png",
        answers: [
            { text: 'FLOWER', correct: true },
            { text: 'TREE', correct: false },
            { text: 'BUSH', correct: false },
            { text: 'GRASS', correct: false }
        ]
    },
    {
        photo: 'assets/Quiz/Klepetko_Anglescina_Igra-08.png',
        answers: [
            { text: 'CAT', correct: false },
            { text: 'FROG', correct: true },
            { text: 'LION', correct: false },
            { text: 'MOUSE', correct: false }
        ]
    },
    {
        photo: 'assets/Quiz/Klepetko_Anglescina_Igra-09.png',
        answers: [
            { text: 'SUN', correct: false },
            { text: 'RAINBOW', correct: false },
            { text: 'CLOUD', correct: true },
            { text: 'RAIN', correct: false }
        ]
    },
    {
        photo: 'assets/Quiz/Klepetko_Anglescina_Igra-10.png',
        answers: [
            { text: 'LAMP', correct: false },
            { text: 'VASE', correct: false },
            { text: 'MIRROR', correct: false },
            { text: 'CLOCK', correct: true }
        ]
    },
    {
        photo: 'assets/Quiz/Klepetko_Anglescina_igra-11.png',
        answers: [
            { text: 'PEAR', correct: false },
            { text: 'APPLE', correct: true },
            { text: 'STRAWBERRY', correct: false },
            { text: 'BANANA', correct: false }
        ]
    }

];