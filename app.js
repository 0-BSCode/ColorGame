const boardHead = document.querySelector('div.board__header');
const boardBody = document.querySelector('div.board__body');
const colorBtns = document.querySelectorAll('button.colors__btn');
const colors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)",
                "rgb(255, 165, 0)", "rgb(255, 192, 203)", "rgb(255, 255, 0)"];
const finalAnswer = {};

colorBtns.forEach(btn => btn.addEventListener('click', () => exportColor(btn)));

function randomColor() {
    let index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

function generateAnswers() {
    let list = document.createElement('ul');
    list.classList.add('board__answer-list');
    for (let i=0; i<4; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('board__big-circle');
        listItem.style.backgroundColor = 'black';

        let color = randomColor();
        if (Object.keys(finalAnswer).includes(color)) {
            finalAnswer[color]++;
        } else {
            finalAnswer[color] = 1;
        }

        listItem.setAttribute('data-color', color);
        listItem.classList.add('board__answer');
        listItem.setAttribute('data-id', i);
        list.appendChild(listItem);
    }
    boardHead.appendChild(list);
}

function generateBoard() {
    let checkId = 0;
    let guessId = 0;

    for (let row = 0; row < 10; row++) {

        let ctr = 0;
        // Generate check and guess list
        let checkList = document.createElement('ul');
        checkList.classList.add('board__check-list');

        let guessList = document.createElement('ul');
        guessList.classList.add('board__guess-list');

        while(ctr < 4) {
            let checkCell = document.createElement('li');
            checkCell.classList.add('board__small-circle');
            checkCell.classList.add('board__check');
            checkCell.setAttribute('data-id', checkId);
            checkList.appendChild(checkCell);
            checkId++;

            let guessCell = document.createElement('li');
            guessCell.classList.add('board__big-circle');
            guessCell.classList.add('board__guess');
            guessCell.setAttribute('data-id', guessId);
            guessList.appendChild(guessCell);
            guessId++;

            ctr++;
        }

        boardBody.appendChild(checkList);
        boardBody.appendChild(guessList);

    }
}

generateAnswers();
generateBoard();

const answers = document.querySelectorAll('li.board__answer');
const checks = document.querySelectorAll('li.board__check');
const guess = document.querySelectorAll('li.board__guess');
let ctr = 0;

// Get background color of button just clicked
function getBgColor(element) 
{
    let color;
    if (element.currentStyle)
      color = element.currentStyle.backgroundColor;
    if (window.getComputedStyle)
    {
      var elementStyle=window.getComputedStyle(element,"");
      if (elementStyle)
        color = elementStyle.getPropertyValue("background-color");
    }
    // Return 0 if both methods failed.  
    return color;
}

function checkWin(startingId) {
    let count = 0;
    for (let i = 0; i < 4; i++)  {
        if (getBgColor(checks[startingId - i]) == 'rgb(0, 0, 0)') {
            count++;
        }
    }

    return count == 4;
}

// Change color of one circle in the row
function exportColor(source) {
    let color = getBgColor(source);
    let tempGuess = ctr % 4; // Corresponds to circles in the row
    
    guess[39-ctr].style.backgroundColor = color;

    if (tempGuess == 3) {
        evaluateRow();
    }

    ctr++;
}

function evaluateRow() {
    let finalAnswerCopy = JSON.parse(JSON.stringify(finalAnswer)); // Create deep copy of answers to prevent changing it
    let answerKeys = Object.keys(finalAnswer); // Get answer key to check if guesses are in them
    
    let guessCount = ctr; // Demarcates index of circle that starts specific guess row
    let checkIndex = 39 - ctr; // Demarcates index of circle that starts specific check row
    let checkItr = 0; // Counts how many circles in the check row we've gone through already

    let index; // Goes over every guess circle in each for loop to check for whites and blacks
    let loopItr;

    
    for (loopItr = 0; loopItr < 4; loopItr++) {
        index = 39-guessCount; // Go to circle in the row
        let guessCol = getBgColor(guess[index]); // Get circle's color

        // Get color of answer circle that's in the same column as guess circle
        let ansCol = answers[(index) % 4].getAttribute('data-color');

        // Check to see if iterator over check circles is less than 4
        if (checkItr < 4) {

            // If circle colors match and it hasn't appeared an excessive
            // amount of times yet
            if (guessCol == ansCol && finalAnswerCopy[guessCol] > 0) {
                checks[checkIndex].style.backgroundColor = 'black';
                finalAnswerCopy[guessCol]--;
                checkIndex++; // Go to next check circle
                checkItr++; // Go to  next check circle
            }
        }

        guessCount--;
    }

    // Reset guessCount to go over all the guess circles to check for whites
    guessCount = ctr;

    for (loopItr = 0; loopItr < 4; loopItr++) {
        index = 39-guessCount;
        let guessCol = getBgColor(guess[index]);
        let ansCol = answers[(index) % 4].getAttribute('data-color');


        // Check to see if iterator over check circles is less than 4
        if (checkItr < 4) {
            
            // Guess color isn't the correct answer but it's part of the answers and has
            // yet to appear an excessive amount of times
            if (guessCol != ansCol && answerKeys.includes(guessCol)
                && finalAnswerCopy[guessCol] > 0) {
                console.log("Check Index: " + checkIndex);
                checks[checkIndex].style.backgroundColor = 'white';
                finalAnswerCopy[guessCol]--;
                checkIndex++;
                checkItr++;
            }

        }
        guessCount--;
    }

    // Turn remaining uncolored circles into brown ones
    while(checkItr < 4) {
        checks[checkIndex].style.backgroundColor = 'brown';
        checkIndex++;
        checkItr++;
    }

    if (ctr == 39) { // All rows have been used up
        alert("You have lost!");
        answers.forEach(answer => answer.style.backgroundColor = answer.getAttribute('data-color'));
    } else if (checkWin(index)) { // If 4 check circles = black, you win
        alert("You have won!");
        answers.forEach(answer => answer.style.backgroundColor = answer.getAttribute('data-color'));
    } // If none of the conditions are met, game continues
}

/*
TO-DO
1. Change UI
    - Change location of options (to the side instead of on the bottom)
    - Change color of the table
    - Design the game title
2. Regarding refreshing
    - Have page refresh automatically when game ends
    - Have restart button
3. Clean up code
    - Get rid of unnecessary variables
    - Get rid of comments
    - Have check circles colored in such a way that it doesn't give away order of answers
        - PRIORITIZE (current algorithm is inaccurate)
        - Answer: Pink / Yellow / Yellow / Orange
        - Input: Orange / Yellow / Yellow / Orange
        - Actual Output: White / Black / Black / Brown
        - Expected Output: Brown / Black / Black / Black
        - What's wrong = When it encounters orange for the first time, it subtracts count from finalAnswers, so it won't consider any other orange (even if latter orange = correct)
        - SOLUTION: Check which cells might be black -> check which cells might be white -> color rest brown
4. Documentation
    - Comment everything
    - Create markdown (follow FrontendMentor style?)
    - Push changes to local repo
*/