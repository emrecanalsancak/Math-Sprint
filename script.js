// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const equationRadioContainers = document.querySelectorAll(
  ".equation-radio-container"
);
const radioInputs = document.querySelectorAll(".amount-input");
const equationRadioInputs = document.querySelectorAll(".equation-input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");
const amountSelect = document.getElementById("amount-select");
const equationSelect = document.getElementById("equation-select");
const startBtn = document.getElementById("start-button");
const nextBtn = document.getElementById("next-button");
const equationForm = document.getElementById("equation-form");

// Equations
let chosenEquation;
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;
function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Best socres to dom
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Local Storage
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update best score array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct bestScore
    if (questionAmount == score.questions) {
      // return best score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  bestScoresToDOM();
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
}

// Reset
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  startForm.hidden = false;
  nextBtn.hidden = false;
  startBtn.hidden = true;
  equationsArray = [];
  playerGuessArray = [];
  questionAmount = 0;
  chosenEquation = "";
  valueY = 0;
  playAgainBtn.hidden = true;
}

// best scored DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to top back
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

//Stop timer
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Wrong guesses
    equationsArray.forEach((equation, i) => {
      if (equation.evaluated === playerGuessArray[i]) {
      } else {
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
}

function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Store user selection
function select(guessedTrue) {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Display game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Num
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations(chosenEquation) {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    let equationValue;
    firstNumber = getRandomInt(20);
    secondNumber = getRandomInt(20);
    if (chosenEquation === "+") {
      equationValue = firstNumber + secondNumber;
    }
    if (chosenEquation === "-") {
      equationValue = firstNumber - secondNumber;
    }
    if (chosenEquation === "*") {
      equationValue = firstNumber * secondNumber;
    }
    if (chosenEquation === "/") {
      equationValue = (firstNumber / secondNumber).toFixed(1);
    }
    const equation = `${firstNumber} ${chosenEquation} ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    let equationValue;
    firstNumber = getRandomInt(20);
    secondNumber = getRandomInt(20);
    if (chosenEquation === "+") {
      equationValue = firstNumber + secondNumber;
    }
    if (chosenEquation === "-") {
      equationValue = firstNumber - secondNumber;
    }
    if (chosenEquation === "*") {
      equationValue = firstNumber * secondNumber;
    }
    if (chosenEquation === "/") {
      equationValue = (firstNumber / secondNumber).toFixed(1);
    }
    wrongFormat[0] = `${firstNumber} ${chosenEquation} ${
      secondNumber + 3
    } = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} ${chosenEquation} ${secondNumber} = ${
      equationValue - 3
    }`;
    wrongFormat[2] = `${
      firstNumber + 3
    } ${chosenEquation} ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// ADD equations to dom
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations(chosenEquation);
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Display countDown
function countdownStart() {
  let countDown = 3;
  countdown.textContent = countDown;
  const timeCountDown = setInterval(() => {
    countDown--;
    if (countDown === 0) {
      countdown.textContent = "Go!";
    } else if (countDown === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = countDown;
    }
  }, 1000);
  // countdown.textContent = "3";
  // setTimeout(() => {
  //   countdown.textContent = "2";
  // }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = "1";
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = "GO!";
  // }, 3000);
}

// Navigate from Splash Page to Countdown page
function showCountdown() {
  equationForm.hidden = true;
  countdownPage.hidden = false;
  splashPage.hidden = true;
  console.log("show count", chosenEquation, questionAmount);
  countdownStart();
  populateGamePage();
}

// Get value from selected button
function getEquation() {
  let equationRadio;
  equationRadioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      equationRadio = radioInput.value;
    }
  });
  return equationRadio;
}

function getRadioValue() {
  let radioValue;

  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });

  return radioValue;
}

function showEquationSelect(e) {
  e.preventDefault();
  // nextBtn.hidden = true;
  // startBtn.hidden = false;
  // startForm.hidden = true;
  // equationForm.hidden = false;
  chosenEquation = getEquation();
  console.log(
    "equation select",
    questionAmount,
    "chosenEquation",
    chosenEquation
  );

  if (chosenEquation && questionAmount) showCountdown();
}

// Form that decides amount of questions
function selectedQuestionAmount(e) {
  e.preventDefault();

  questionAmount = getRadioValue();

  if (questionAmount) {
    // showEquationSelect();
    nextBtn.hidden = true;
    startBtn.hidden = false;
    startForm.hidden = true;
    equationForm.hidden = false;
  }
}

startForm.addEventListener("click", () => {
  if (!startForm.hidden) {
    radioContainers.forEach((radioEl) => {
      // Remove Selected Label Styling
      radioEl.classList.remove("selected-label");

      // Add back if radio button selected
      if (radioEl.children[1].checked) {
        radioEl.classList.add("selected-label");
      }
    });
  }
});

equationForm.addEventListener("click", () => {
  if (!equationSelect.hidden) {
    equationRadioContainers.forEach((el) => {
      el.classList.remove("selected-label");

      if (el.children[1].checked) {
        el.classList.add("selected-label");
      }
    });
  }
});

// Event Listeners
// nextBtn.addEventListener("submit", selectedQuestionAmount);
equationForm.addEventListener("submit", showEquationSelect);
startForm.addEventListener("submit", selectedQuestionAmount);
gamePage.addEventListener("click", startTimer);

// On Load
getSavedBestScores();
