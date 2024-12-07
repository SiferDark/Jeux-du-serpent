const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// Taille d'une case
const box = 32;

// Charger les images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// Charger les fichiers audios
const dead = new Audio("audio/dead.mp3");
const eat = new Audio("audio/eat.mp3");
const up = new Audio("audio/up.mp3");
const right = new Audio("audio/right.mp3");
const left = new Audio("audio/left.mp3");
const down = new Audio("audio/down.mp3");

// Variables globales
let snake, food, score, bestScore, d, game, speed, isPaused;

// Initialisation du meilleur score
bestScore = localStorage.getItem("bestScore") || 0;

// Fonction pour démarrer le jeu
function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = generateFood();
  score = 0;
  d = null;
  speed = 100;
  isPaused = false;
  clearInterval(game);
  game = setInterval(draw, speed);
  updateScoreboard();
}

// Générer une nourriture à une position valide
function generateFood() {
  return {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  };
}

// Mettre à jour le tableau des scores
function updateScoreboard() {
  document.getElementById("current-score").textContent = score;
  document.getElementById("best-score").textContent = bestScore;
}

// Gérer les directions avec les touches fléchées
document.addEventListener("keydown", (event) => {
  const key = event.keyCode;
  if (key === 32) {
    togglePause();
    return;
  }
  if (key === 37 && d !== "RIGHT") {
    left.play();
    d = "LEFT";
  } else if (key === 38 && d !== "DOWN") {
    up.play();
    d = "UP";
  } else if (key === 39 && d !== "LEFT") {
    right.play();
    d = "RIGHT";
  } else if (key === 40 && d !== "UP") {
    down.play();
    d = "DOWN";
  }
});

// Basculer la pause
function togglePause() {
  if (isPaused) {
    isPaused = false;
    game = setInterval(draw, speed);
  } else {
    isPaused = true;
    clearInterval(game);
    // Afficher "Pause" sur le canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Changa one";
    ctx.textAlign = "center";
    ctx.fillText("Pause", cvs.width / 2, cvs.height / 2);
  }
}

// Vérifier les collisions
function collision(head, array) {
  return array.some((segment) => head.x === segment.x && head.y === segment.y);
}

// Dessiner le jeu
function draw() {
  if (isPaused) return;

  // Dessiner le fond
  ctx.drawImage(ground, 0, 0);

  // Dessiner le serpent
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Dessiner la nourriture
  ctx.drawImage(foodImg, food.x, food.y);

  // Position de la tête du serpent
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Déplacer le serpent
  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  // Vérifier si le serpent mange la nourriture
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    eat.play();
    food = generateFood();
    updateSpeed(); // Augmenter la vitesse
  } else {
    snake.pop(); // Supprimer la dernière case
  }

  // Nouvelle tête
  const newHead = { x: snakeX, y: snakeY };

  // Vérifier les collisions
  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }
    alert(`Game Over! Score : ${score} | Meilleur : ${bestScore}`);
    startGame();
    return;
  }

  // Ajouter la nouvelle tête
  snake.unshift(newHead);

  // Mettre à jour le tableau des scores
  updateScoreboard();
}

// Ajuster la vitesse
function updateSpeed() {
  clearInterval(game);
  speed = Math.max(10, 100 - score * 5);
  game = setInterval(draw, speed);
}

// Bouton "Recommencer"
document.getElementById("restart").addEventListener("click", startGame);

// Démarrer le jeu
startGame();