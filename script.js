document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const startButton = document.getElementById("start-button");
    const difficultyDropdown = document.getElementById("difficulty-dropdown");
    const arrowKeysContainer = document.getElementById("arrow-keys");

    const boxSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let direction = "right";
    let food = {};
    let score = 0;
    let gameInterval;
    let speed = 150; // Default speed

    function setDifficulty(difficulty) {
        const difficultyLevels = {
            easy: 200,
            intermediate: 150,
            professional: 100,
            expert: 80,
            insane: 50
        };

        speed = difficultyLevels[difficulty];
    }

    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        ctx.fillStyle = "#00F";
        snake.forEach(segment => {
            ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
        });

        // Draw the food
        ctx.fillStyle = "#F00";
        ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

        // Move the snake
        let headX = snake[0].x;
        let headY = snake[0].y;

        if (direction === "right") headX++;
        else if (direction === "left") headX--;
        else if (direction === "up") headY--;
        else if (direction === "down") headY++;

        // Check for collision with the walls
        if (headX < 0 || headX * boxSize >= canvas.width || headY < 0 || headY * boxSize >= canvas.height) {
            // Game over
            alert("Game over! Your score: " + score);
            resetGame();
            return;
        }

        // Check for collision with itself
        for (let i = 1; i < snake.length; i++) {
            if (headX === snake[i].x && headY === snake[i].y) {
                // Game over
                alert("Game over! Your score: " + score);
                resetGame();
                return;
            }
        }

        // Check for collision with food
        if (headX === food.x && headY === food.y) {
            // Increase the length of the snake
            snake.unshift({ x: headX, y: headY });
            // Generate new food
            generateFood();
            // Increase the score
            score++;
            updateScore();

            // Check if the score is a multiple of 10
            if (score > 0 && score % 10 === 0) {
                increaseSpeed();
            }
        } else {
            // Move the snake by adding a new head and removing the tail
            snake.unshift({ x: headX, y: headY });
            snake.pop();
        }
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)),
            y: Math.floor(Math.random() * (canvas.height / boxSize))
        };

        // Ensure the food does not overlap with the snake
        while (isCollision(food, snake)) {
            food.x = Math.floor(Math.random() * (canvas.width / boxSize));
            food.y = Math.floor(Math.random() * (canvas.height / boxSize));
        }
    }

    function isCollision(obj1, obj2Array) {
        // Check if obj1 collides with any object in obj2Array
        return obj2Array.some(obj2 => obj1.x === obj2.x && obj1.y === obj2.y);
    }

    function updateScore() {
        scoreElement.innerText = "Score: " + score;
    }

    function resetGame() {
        clearInterval(gameInterval);
        snake = [{ x: 10, y: 10 }];
        direction = "right";
        score = 0;
        updateScore();
        generateFood();
        startButton.style.display = "block";
    }

    function increaseSpeed() {
        // Increase speed after reaching a multiple of 10 in score
        speed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(draw, speed);
    }

    function startGame() {
        startButton.style.display = "none";
        setDifficulty(difficultyDropdown.value);
        generateFood();
        gameInterval = setInterval(draw, speed);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" && direction !== "down") direction = "up";
        else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
        else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
        else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    });

    startButton.addEventListener("click", startGame);
// Show arrow keys container on mobile devices
if (window.innerWidth <= 600) {
    arrowKeysContainer.style.display = "flex";

    const arrowKeyButtons = document.querySelectorAll(".arrow-key");
    
    arrowKeyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const key = this.dataset.key;
            moveSnakeByKey(key);
        });

        // Add touch events for responsiveness
        button.addEventListener("touchstart", function (event) {
            event.preventDefault();
            const key = this.dataset.key;
            moveSnakeByKey(key);
        });
    });

    function moveSnakeByKey(key) {
        if (key === "up" && direction !== "down") direction = "up";
        else if (key === "down" && direction !== "up") direction = "down";
        else if (key === "left" && direction !== "right") direction = "left";
        else if (key === "right" && direction !== "left") direction = "right";
    }
}

});
