const boardHead = document.querySelector('div.board__header');
const boardBody = document.querySelector('div.board__body');
const colorBtns = document.querySelectorAll('button.colors__btn');
const colors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)",
                "rgb(255, 165, 0)", "rgb(255, 192, 203)", "rgb(255, 255, 0)"];
const finalAnswer = {};

colorBtns.forEach(btn => btn.addEventListener('click', () => copyColor(btn)));

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
function copyColor(source) {
    let color = getBgColor(source);
    let tempGuess = ctr % 4; // Corresponds to circles in the row
    
    guess[39-ctr].style.backgroundColor = color;

    if (tempGuess == 3) {
        evaluateRow();
    }

    ctr++;
}

function evaluateRow() {
    let guessCount = ctr;
    let finalAnswerCopy = JSON.parse(JSON.stringify(finalAnswer)); // Create deep copy of answers to prevent changing it
    let count = 0;
    let index;

    while (count < 4) {
        index = 39 - guessCount;
        let guessCol = getBgColor(guess[index]);
        let ansCol = answers[(index) % 4].getAttribute('data-color');


        if (guessCol == ansCol && finalAnswerCopy[guessCol] > 0) {
            checks[index].style.backgroundColor = 'black';
            finalAnswerCopy[guessCol]--;
        } else if (colors.includes(guessCol) && finalAnswerCopy[guessCol] > 0) {
            checks[index].style.backgroundColor = 'white';
            finalAnswerCopy[guessCol]--;
        } else {
            checks[index].style.backgroundColor = 'brown';
        }

        count++;
        guessCount--;
    }

    if (ctr == 39) {
        alert("You have lost!");
        answers.forEach(answer => answer.style.backgroundColor = answer.getAttribute('data-color'));
    } else if (checkWin(index)) {
        alert("You have won!");
        answers.forEach(answer => answer.style.backgroundColor = answer.getAttribute('data-color'));
    }
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
4. Documentation
    - Comment everything
    - Create markdown (follow FrontendMentor style?)
    - Push changes to local repo

*/