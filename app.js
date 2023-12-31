document.addEventListener('DOMContentLoaded', () => {

    // Board display elements
    let currentScore = 0;
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = currentScore;
    const gridDisplay = document.getElementById("grid");
    const gridDistance = 20;
    const squareCount = gridDistance * gridDistance;
    let squares;    
    let foodSquareIdx;

    // Snake elements
    let snakeBodyLength = 4;
    let snakeSquares = [Math.floor(squareCount/2 - gridDistance/2)];

    // Direction, how many squares to advance
    const up = -gridDistance;
    const down = gridDistance;
    const left = -1;
    const right = 1;
    let direction = right;

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
        const headIdx = snakeSquares[snakeSquares.length - 1];
        squares[headIdx].classList.replace('empty', 'head-square');

        for (let i = 1; i < snakeBodyLength + 1; i++) {
            squares[headIdx - i].classList.replace('empty', 'body-square');
            snakeSquares.unshift(headIdx - i);
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

    // Check if the snake is eating
    function isEating(headIdx) {

        if (headIdx == foodSquareIdx) {
            squares[headIdx].classList.remove('food-square');
            currentScore += 100;
            scoreDisplay.textContent = currentScore;

            createFood();
        }
    }

    // Set direction through keydown
    function userInput(e) {

        switch(e.key) {
            case 'ArrowLeft': {
                direction = left;
                break;
                }
            case 'ArrowRight': {
                direction = right;
                break;
                }
            case 'ArrowUp': {
                direction = up;
                break;
            }
            case 'ArrowDown': {
                direction = down;
                break;
            }
            default: {
                break;
            }
        }
    }
    document.addEventListener('keydown', userInput);

    // Check if the snake collides with the wall
    function checkCollisions(headIdx) {      

        // Conditions for border collisions
        let condRight = (direction === right && headIdx % gridDistance === gridDistance - 1);
        let condUp = (direction === up && headIdx < gridDistance);
        let condDown = (direction === down && headIdx > squareCount - gridDistance);
        let condLeft = (direction === left && headIdx % gridDistance === 0); 

        if (condRight || condUp || condDown || condLeft) {
            return true;
        } else {
            return false;
        }
    }

    function moveSnake() {

        let headIdx = snakeSquares[snakeSquares.length - 1];
        console.log(headIdx);
        const fat = isEating(headIdx);
        if (!checkCollisions(headIdx)) {

            // If eating, don't remove tail
            if (!fat) {
                squares[snakeSquares[0]].classList.replace('body-square', 'empty');
                snakeSquares.shift();      
            }
            
            // If not eating, remove tail
            squares[headIdx].classList.replace('head-square', 'body-square');
            headIdx += direction;
            squares[headIdx].classList.replace('empty', 'head-square');
            snakeSquares.push(headIdx);

        } else {
            scoreDisplay.textContent = "GAME OVER";
            clearInterval(timerId);
        }
    }
    timerId = setInterval(moveSnake, 300);
 

    // Possible movement combinations
        // right --> up         right --> down
        // left --> up          left --> down
        // up --> left          up --> right
        // down --> left        down --> right
})