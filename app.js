const boardHead = document.querySelector('div.board__header');
const colorBtns = document.querySelectorAll('button.colors__btn');

console.log(colorBtns);
colorBtns.forEach(btn => btn.addEventListener('click', () => getBgColor(btn)));

// Generate circles w/ JS to automatically assign ID properties
// which will be used to assign their colors later
function generateCircles(elem) {
    let list = document.createElement('ul');
    list.classList.add('board__circle-list');
    for (let i=0; i<4; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('board__big-circle');
        listItem.setAttribute('data-id', i);
        list.appendChild(listItem);
    }
    elem.appendChild(list);
}

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

generateCircles(boardHead);
const circles = document.querySelectorAll('li.board__big-circle');
// Counter for identifying which circle on the row we're on
let ctr = 0;


// Change color of one circle in the row
function changeColor(color) {
    if (ctr < 4) {
        circles[ctr].style.backgroundColor = color;
        ctr++;
    } else {
        circles.forEach(circle => circle.style.backgroundColor = "yellow");
    }
}
