const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// Taille d'une case
const box = 32;

// Charger l'image du fond (grille avec damiers)
const ground = new Image();
ground.src = "img/ground.png"; // Assurez-vous que le fichier est au bon emplacement.

// Charger l'image de la nourriture
const foodImg = new Image();
foodImg.src = "img/food.png";

// Charger les fichiers audios

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3"; // charger l'audio de mort
eat.src = "audio/eat.mp3"; // charger l'audio de manger
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// Variables globales
let snake;
let food;
let score;
let bestScore = localStorage.getItem("bestScore") || 0;
let d;
let game;
let speed = 50;
let isPaused = false;

// Réinitialiser le jeu
function startGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = generateFood();
    score = 0;
    d = null;
    speed = 100;
    clearInterval(game);
    game = setInterval(draw, speed);
    updateScoreboard();
}

// Générer une nourriture à une position valide sur la grille
function generateFood() {
    return {
        x: Math.floor(Math.random() * 17 + 1) * box, // Positions limitées au damier
        y: Math.floor(Math.random() * 15 + 3) * box
    };
}

// Afficher le score
function updateScoreboard() {
    document.getElementById("current-score").textContent = score;
    document.getElementById("best-score").textContent = bestScore;
}

// Contrôle de la direction
document.addEventListener("keydown", direction);

function direction(event){
    const key = event.keyCode;
    if (key == 37 && d != "RIGHT") { 
        left.play();
        d = "LEFT";}
    else if (key == 38 && d != "DOWN"){ 
        up.play();
        d = "UP"; }
    else if (key == 39 && d != "LEFT") { 
        right.play();
        d = "RIGHT"; }
    else if (key == 40 && d != "UP") { 
        down.play();
        d = "DOWN"; }
}

// Vérifier les collisions
function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// Dessiner le jeu
function draw() {
    // Dessiner le fond avec l'image du damier
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

    // Position actuelle de la tête du serpent
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Déplacer le serpent
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Si le serpent mange la nourriture
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eat.play();
        food = generateFood();
        updateSpeed(); // Augmenter la vitesse
    } else {
        snake.pop();
    }

    // Nouvelle position de la tête
    const newHead = { x: snakeX, y: snakeY };

    // Vérifier les collisions (avec les murs ou le serpent lui-même)
    if (
        snakeX < box || snakeX > 17 * box ||
        snakeY < 3 * box || snakeY > 17 * box ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        dead.play();
        // Mettre à jour le meilleur score
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

// Bouton recommencer
document.getElementById("restart").addEventListener("click", startGame);

// Démarrer le jeu
startGame();