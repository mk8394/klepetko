const scrabbleContainer = document.getElementById("scrabble");
const scrabbleMainContainer = document.getElementById("scrabble-main-content");
const scrabbleMsg = document.getElementById("scrabble-msg");
const scrabbleInput = document.getElementById("scrabble-input");
const scrabbleStartButton = document.getElementById("scrabble-start-btn");
const scrabbleGuessButton = document.getElementById("scrabble-guess-btn");
const scrabbleNextButton = document.getElementById("scrabble-next-btn");
const scrabbleExitButton = document.getElementById("scrabble-exit-btn");
const scrabbleFinishButton = document.getElementById("scrabble-finish-btn");
const scrabbleScore = document.getElementById("scrabble-score");
const scrabbleResponse = document.getElementById("scrabble-response");
const scrabbleMainText = document.getElementById("scrabble-main-text");

let scrabbleWords = ["jabolko", "jež", "sonce", "kalkulator", "avto", "dež", "oči", "dan", "kocka", "krog", "pes", "mačka", "pingvin", "jakna", "torba", "svinčnik"];
let newWords = "";
let randWords = "";

let scrabbleCorrectAnswers = 0;
let scrabbleAnswers = 0;

const scrabbleCreateQuestions = () => {
    let randomQuestions = Math.floor(Math.random() * scrabbleWords.length);
    let newTempWords = scrabbleWords[randomQuestions];
    return newTempWords;
};

const scrabble = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        let temp = arr[i];
        let j = Math.floor(Math.random() * (i + 1));

        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};

const scrabbleSetNewQuestion = () => {
    newWords = scrabbleCreateQuestions();
    randWords = scrabble(newWords.split("")).join("");
    scrabbleMsg.innerHTML = randWords;
    scrabbleGuessButton.classList.remove("hide");
    scrabbleNextButton.classList.add("hide");
}

scrabbleStartButton.addEventListener("click", function () {
    scrabbleMainText.classList.add("hide");
    scrabbleMainContainer.classList.remove("hide");
    scrabbleStartButton.classList.add("hide");
    scrabbleInput.classList.remove("hide");
    scrabbleSetNewQuestion();
});

scrabbleGuessButton.addEventListener("click", function () {
    let tempWord = scrabbleInput.value;
    scrabbleAnswers++;
    if (tempWord === newWords) {
        scrabbleCorrectAnswers++;
        scrabbleScore.innerHTML = `Rezultat ${scrabbleCorrectAnswers}/5`;
        scrabbleResponse.innerText = "Bravo! Ugotovil si pravilno!";
        scrabbleNextButton.classList.remove("hide");
    } else {
        scrabbleResponse.innerText = "Žal si odgovoril napačno :(";
        scrabbleNextButton.classList.remove("hide");
    }
    if (scrabbleAnswers == 5) {
        scrabbleNextButton.classList.add("hide");
        scrabbleFinishButton.classList.remove("hide");
        scrabbleResponse.innerText = `Tvoj rezultat: ${scrabbleCorrectAnswers}`;
    }
    scrabbleResponse.classList.remove("hide");
    scrabbleGuessButton.classList.add("hide");
});

scrabbleNextButton.addEventListener("click", function () {
    scrabbleResponse.classList.add("hide");
    scrabbleInput.value = "";
    scrabbleSetNewQuestion();
});

scrabbleFinishButton.addEventListener("click", function () {
    scrabbleExitGame();
});

scrabbleExitButton.addEventListener("click", function () {
    scrabbleExitGame();
});

function scrabbleExitGame() {
    scrabbleScore.innerHTML = `Rezultat 0/5`
    scrabbleContainer.style.display = "none";
    scrabbleResponse.classList.add("hide");
    scrabbleNextButton.classList.add("hide");
    scrabbleStartButton.classList.remove("hide");
    scrabbleMainText.classList.remove("hide");
    scrabbleMainContainer.classList.add("hide");
    scrabbleInput.classList.add("hide");
    scrabbleGuessButton.classList.add("hide");
    scrabbleFinishButton.classList.add("hide");
    scrabbleInput.value = "";
    scrabbleCorrectAnswers = 0;
    scrabbleAnswers = 0;
}