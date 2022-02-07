const boardHead = document.querySelector('div.board__header');
const boardBody = document.querySelector('div.board__body');
const colorBtns = document.querySelectorAll('button.colors__btn');

console.log(colorBtns);
colorBtns.forEach(btn => btn.addEventListener('click', () => getBgColor(btn)));

function generateAnswers() {
    let list = document.createElement('ul');
    list.classList.add('board__answer-list');
    for (let i=0; i<4; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('board__big-circle');
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
    changeColor(color);
}

// Change color of one circle in the row
function changeColor(color) {
    if (ctr < 40 && ctr2 < 40) {
        let tempGuess = ctr % 4;
        let tempCheck = 0;
    
        guess[39-ctr].style.backgroundColor = color;
    
        if (tempGuess == 3) {
            setTimeout(() => {
                while (tempCheck < 4) {
                    resetColor(checks[39-ctr2]);
                    tempCheck++;
                    ctr2++;
                }
            }, 1000);
        }
    
        ctr++;
    } else {
        alert("GAME FINISHED");
    }
}

function resetColor(elem) {
    elem.style.backgroundColor = 'black';
}

/*
TO-DO
1. Randomly generate final answer for top circles at start
2. Have checkers assess whether given row's guesses = correct
3. End game early if correct answer = achieved before 10 tries
*/