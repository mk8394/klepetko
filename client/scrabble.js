const scrabbleContainer = document.getElementById("scrabble");
const scrabbleMainContainer = document.getElementById("scrabble-main-content");
const scrabbleMsg = document.getElementById("scrabble-msg");
const scrabbleInput = document.getElementById("scrabble-input");
const scrabbleStartBtn = document.getElementById("scrabble-start-btn");
const scrabbleGuessBtn = document.getElementById("scrabble-guess-btn");
const scrabbleNextBtn = document.getElementById("scrabble-next-btn");
const scrabbleExitBtn = document.getElementById("scrabble-exit-btn");
const scrabbleFinishBtn = document.getElementById("scrabble-finish-btn");
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
    scrabbleGuessBtn.classList.remove("hide");
    scrabbleNextBtn.classList.add("hide");
}

scrabbleStartBtn.addEventListener("click", function () {
    scrabbleMainText.classList.add("hide");
    scrabbleMainContainer.classList.remove("hide");
    scrabbleStartBtn.classList.add("hide");
    scrabbleInput.classList.remove("hide");
    scrabbleSetNewQuestion();
});

scrabbleGuessBtn.addEventListener("click", function () {
    let tempWord = scrabbleInput.value;
    scrabbleAnswers++;
    if (tempWord === newWords) {
        scrabbleCorrectAnswers++;
        scrabbleScore.innerHTML = `Rezultat ${scrabbleCorrectAnswers}/5`;
        scrabbleResponse.innerText = "Bravo! Ugotovil si pravilno!";
        scrabbleNextBtn.classList.remove("hide");
    } else {
        scrabbleResponse.innerText = "Žal si odgovoril napačno :(";
        scrabbleNextBtn.classList.remove("hide");
    }
    if (scrabbleAnswers == 5) {
        scrabbleNextBtn.classList.add("hide");
        scrabbleFinishBtn.classList.remove("hide");
        scrabbleResponse.innerText = `Tvoj rezultat: ${scrabbleCorrectAnswers}`;
    }
    scrabbleResponse.classList.remove("hide");
    scrabbleGuessBtn.classList.add("hide");
});

scrabbleNextBtn.addEventListener("click", function () {
    scrabbleResponse.classList.add("hide");
    scrabbleInput.value = "";
    scrabbleSetNewQuestion();
});

scrabbleFinishBtn.addEventListener("click", function () {
    scrabbleExitGame();
});

scrabbleExitBtn.addEventListener("click", function () {
    scrabbleExitGame();
});

function scrabbleExitGame() {
    scrabbleScore.innerHTML = `Rezultat 0/5`
    scrabbleContainer.style.display = "none";
    scrabbleCorrectAnswers = 0;
    scrabbleAnswers = 0;
}