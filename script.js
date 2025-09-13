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

  const cells = document.querySelectorAll(".cell");
  const randomIndex = Math.floor(Math.random() * totalCells);
  const cell = cells[randomIndex];

  // Jeżeli już aktywny to pomijam
  if (activeCells.has(randomIndex)) return;

  cell.classList.add("active");


  const timeout = setTimeout(() => {
    if (!gameOver && activeCells.has(randomIndex)) {
      showFailure();
    }
  }, 2000);  // 10 sekund na kliknięcie

  activeCells.set(randomIndex, timeout);
}

function startGameLoop() {
  setInterval(() => {
    activateRandomCell();
  }, 300); //Tempo pojawiania się
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
  progressBar.style.width = "0%";
  progressPercentage.textContent = "0%";

  // Usuwanie klas
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
