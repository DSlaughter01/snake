// Create a function which moves the head and body to the right of the screen
// Call this function every 100 ms
// Create a function which ends the game when the snake hits the right
// Create a function which creates food
// Create a function which checks for collision of the head with the food
document.addEventListener('DOMContentLoaded', () => {

    let currentScore = 0;
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = currentScore;
    const gridDisplay = document.getElementById("grid");
    const gridDistance = 20;
    const squareCount = 400;
    let snakeBodyLength = 0;

    let squares;
    let headSquareIdx = Math.floor(squareCount/2 - gridDistance/2);
    let foodSquareIdx;
    let bodySquares = [];

    // Direction, how many squares to advance
    const up = -gridDistance;
    const down = gridDistance;
    const left = -1;
    const right = 1;
    
    let currentDirection = right;
    let newDirection;

    let timerId;

    // Create 400 divs of empty squares
    for (let i = 0; i < squareCount; i++) {
        let division = document.createElement('div');
        division.classList.add('square');
        division.classList.add('empty');
        gridDisplay.appendChild(division);
    }
    squares = document.querySelectorAll('.square');

    // Create the user and start moving right
    function createUser() {
        squares[headSquareIdx].classList.replace('empty', 'head-square');

        for (let i = 1; i < snakeBodyLength + 1; i++) {
            squares[headSquareIdx - i].classList.replace('empty', 'body-square');
            bodySquares.push(headSquareIdx - i);
        }
    }
    createUser();

    // Create a snack in a random unoccupied square
    function createFood() {
        let possFoodSquare = document.querySelectorAll('.empty');
        foodSquareIdx = Math.floor(Math.random() * possFoodSquare.length);
        let foodSquare = possFoodSquare[foodSquareIdx];
        foodSquare.classList.add('food-square');
    }
    createFood();

    // Check if the snake eats
    function isEating() {
        if (headSquareIdx == foodSquareIdx) {
            squares[headSquareIdx].classList.remove('food-square');
            currentScore += 100;
            scoreDisplay.textContent = currentScore;

            // Grow the body
            bodySquares.push(squares[headSquareIdx - newDirection]);
            squares[headSquareIdx - newDirection].classList.replace('empty', 'body-square');
            
            createFood();
        }
    }

    // Set direction through keydown
    function userInput(e) {

        switch(e.key) {
            case 'ArrowLeft': {
                currentDirection = left;
                break;
                }
            case 'ArrowRight': {
                currentDirection = right;
                break;
                }
            case 'ArrowUp': {
                currentDirection = up;
                break;
            }
            case 'ArrowDown': {
                currentDirection = down;
                break;
            }
            default: {
                break;
            }
        }
    }
    document.addEventListener('keydown', userInput);

    // Check if the snake collides with the wall
    function checkCollisions() {      

        // Conditions for border collisions
        let condRight = (currentDirection === right && headSquareIdx % gridDistance === gridDistance - 1);
        let condUp = (currentDirection === up && headSquareIdx < gridDistance);
        let condDown = (currentDirection === down && headSquareIdx > squareCount - gridDistance);
        let condLeft = (currentDirection === left && headSquareIdx % gridDistance === 0); 

        if (condRight || condUp || condDown || condLeft) {
            return true;
        } else {
            return false;
        }
    }

    function moveSnake() {
        // Can we apply directions to a certain division?

        if (!checkCollisions()) {

            // Move the head
            squares[headSquareIdx].classList.remove('head-square');
            headSquareIdx += currentDirection;
            squares[headSquareIdx].classList.add('head-square');
            isEating();

            // Move the body

        } else {
            scoreDisplay.textContent = "GAME OVER";
            clearInterval(timerId);
        }
    }
    timerId = setInterval(moveSnake, 500);


    // Possible movement combinations
        // right --> up         right --> down
        // left --> up          left --> down
        // up --> left          up --> right
        // down --> left        down --> right
})