const grid = document.getElementById("grid");
const message = document.getElementById("message");
const gridSize = 7;
const requiredClicks = 57; // Wymagane poprawne kwadraciki
const totalCells = gridSize * gridSize;
const progressBar = document.getElementById("progress-bar");
const progressPercentage = document.getElementById("progress-percentage");



let activeCells = new Map(); // indeksy i timeouty
let gameOver = false;
let score = 0;
let lastActivatedTimes = new Map(); // klucz: index, wartość: timestamp w ms



function createGrid() {
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    cell.addEventListener("click", () => {
      if (gameOver) return;

      if (activeCells.has(i)) {
        // Trafiony aktywny kwadrat
        clearTimeout(activeCells.get(i));
        activeCells.delete(i);
        cell.classList.remove("active");

        score++;
        updateProgressBar();
if (score >= requiredClicks) {
  showSuccess();
}

      } else {
        // Kliknięcie nieaktywnego = porażka
        showFailure();
      }
    });

    grid.appendChild(cell);
  }
}

function updateProgressBar() {
  const percentage = Math.min(100, ((score / requiredClicks) * 100).toFixed(2));
  progressBar.style.width = percentage + "%";
  progressPercentage.textContent = percentage + "%";
}




function activateRandomCell() {
  if (gameOver) return;

  const now = Date.now();
  const cells = document.querySelectorAll(".cell");

  const availableIndexes = [];

  for (let i = 0; i < totalCells; i++) {
    if (activeCells.has(i)) continue; // już aktywna

    const lastTime = lastActivatedTimes.get(i) || 0;
    if (now - lastTime >= 1000) {
      availableIndexes.push(i);
    }
  }

  if (availableIndexes.length === 0) return; // brak dostępnych komórek

  const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  const cell = cells[randomIndex];


  lastActivatedTimes.set(randomIndex, now);

  cell.classList.add("active");

  const timeout = setTimeout(() => {
    if (!gameOver && activeCells.has(randomIndex)) {
      showFailure();
    }
  }, 2000); // czas na kliknięcie

  activeCells.set(randomIndex, timeout);
}


function startGameLoop() {
  setInterval(() => {
    activateRandomCell();
  }, 350); //Tempo pojawiania się
}

function showFailure() {
  gameOver = true;

  document.querySelector(".container").classList.add("hidden");
  document.getElementById("failure-screen").classList.remove("hidden");


  const failureScore = document.getElementById("failure-score");
  failureScore.textContent = `Trafione kwadraty: ${score} / ${requiredClicks}`;


  activeCells.forEach((timeout, index) => {
    clearTimeout(timeout);
    document.querySelector(`.cell[data-index='${index}']`).classList.remove("active");
  });
  activeCells.clear();
}



function restartGame() {
  gameOver = false;
  score = 0;
  activeCells.clear();
  lastActivatedTimes.clear();
  progressBar.style.width = "0%";
  progressPercentage.textContent = "0%";

  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("active");
  });

  document.querySelector(".container").classList.remove("hidden");
  document.getElementById("success-screen").classList.add("hidden");
  document.getElementById("failure-screen").classList.add("hidden");
}




function showSuccess() {
  gameOver = true;

  document.querySelector(".container").classList.add("hidden");

  document.getElementById("success-screen").classList.remove("hidden");

  activeCells.forEach((timeout, index) => {
    clearTimeout(timeout);
    document.querySelector(`.cell[data-index='${index}']`).classList.remove("active");
  });
  activeCells.clear();
}



createGrid();
startGameLoop();
