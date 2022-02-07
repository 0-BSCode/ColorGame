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
let ctr2 = 0;

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

// Change color of one circle in the row
function copyColor(source) {
    let color = getBgColor(source);

    if (ctr < 40 && ctr2 < 40) {
        let tempGuess = ctr % 4;
    
        guess[39-ctr].style.backgroundColor = color;
    
        if (tempGuess == 3) {
            setTimeout(() => {
                evaluateRow();
            }, 700);
        }
    
        ctr++;
    } else {
        answers.forEach(answer => answer.style.backgroundColor = answer.getAttribute('data-color'));
    }
}

function evaluateRow() {
    let guessCount = ctr;
    let finalAnswerCopy = JSON.parse(JSON.stringify(finalAnswer)); // Create deep copy of answers to prevent changing it

    while (ctr2 < ctr) {
        let guessCol = getBgColor(guess[40-guessCount]);
        let ansCol = answers[guessCount % 4].getAttribute('data-color');

        if (guessCol == ansCol && finalAnswerCopy[guessCol] > 0) {
            checks[39-ctr2].style.backgroundColor = 'black';
            finalAnswerCopy[guessCol]--;
        } else if (colors.includes(guessCol) && finalAnswerCopy[guessCol] > 0) {
            checks[39-ctr2].style.backgroundColor = 'white';
            finalAnswerCopy[guessCol]--;
        } else {
            checks[39-ctr2].style.backgroundColor = 'brown';
        }

        ctr2++;
        guessCount--;
    }
    console.log(finalAnswer);
    console.log(finalAnswerCopy);
    console.log("\n");
}

/*
TO-DO
2. Have checkers assess whether given row's guesses = correct
    - Take into account that colors can repeat in the final answer (count instances in final answer)
3. End game early if correct answer = achieved before 10 tries
*/