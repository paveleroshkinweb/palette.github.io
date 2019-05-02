const inputColor = document.querySelector('input[type="color"]');
const circle = document.querySelector('.circle');

const startColor = inputColor.value;
let prevColor = inputColor.value;

const body = document.querySelector('body');
const bucket = document.querySelector('.paint-bucket');
const chooseColor = document.querySelector('.choose-color');
const move = document.querySelector('.move');
const transform = document.querySelector('.transform');

const field = { rows: 3, columns: 3 };

const figuresBar = document.querySelector('.figures-bar');
const figureRows = createFigureRows(field.rows, field.columns);

let currentDrag = null;


addInputColorEventListeners(inputColor);

insertFigureRows(figureRows);


bucket.addEventListener('click', event => {
    const func = e => {
        if (e.target.classList.contains('figure')) {
            e.target.style.background = inputColor.value;
        }
    }
    commonActions(event.currentTarget, 'paint-bucket-cursor', 'click', func);
});

chooseColor.addEventListener('click', event => {
    const func = e => {
        if (e.target.classList.contains('figure')) {
            inputColor.value = rgbToHex(e.target.style.background);            
        }
    }
    commonActions(event.currentTarget, 'choose-color-cursor', 'click', func);
});

move.addEventListener('click', event => {
    commonActions(event.currentTarget, 'move-cursor', 'drag-drop');
});

transform.addEventListener('click', event => {
    const func = e => {
        if (e.target.classList.contains('figure')) {
            e.target.classList.toggle('circle-figure');
        }
    }
    commonActions(event.currentTarget, 'transform-cursor', 'click', func);
});


function rgbToHex(rgb) {
    if (rgb == '') {
        return startColor;
    }
    rgb = rgb.substring(rgb.indexOf('(') + 1, rgb.indexOf(')'))
                            .split(', ')
                            .map(Number);
    return  '#' + rgb.map(x => {

        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('');
}

function createElement(className) {
    const figure = document.createElement('div');
    figure.classList.add(className);
    return figure;
}

function createFigureRows(rowsNumber, columnsNumber) {
    const figureRows = [];
    for (let i = 0; i < rowsNumber; i++) {
        const row = createElement('figure-row');
        for (let j = 0; j < columnsNumber; j++) {
            const figure = createElement('figure');
            row.appendChild(figure);
        }
        figureRows.push(row);
    }
    return figureRows;
}

function insertFigureRows(figureRows) {
    for (let i = 0; i < figureRows.length; i++) {
        figuresBar.appendChild(figureRows[i]);
    }
}

function addInputColorEventListeners(inputColor) {
    inputColor.addEventListener('click', function(event) {
        prevColor = this.value;
    });
    
    inputColor.addEventListener('change', function(event) {
        circle.style.background = prevColor;
    });
}

function removeOldActive() {
    const activeElement = document.querySelector('.active');
    if (activeElement) {
        activeElement.classList.remove('active');
    }
} 

function onDragStart(event) {
    if (event.target.classList.contains('figure')) {
        event.target.classList.add('half-opacity');
        currentDrag = event.target;
    }
}

function onDragOver(event) {
    event.preventDefault();
    if (event.target.classList.contains('figure')) {
        event.target.classList.add('little-opacity');
    }
}

function onDragLeave(event) {
    if (event.target.classList.contains('figure')) {
        event.target.classList.remove('little-opacity');
    }
}   

function onDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('figure')) {
        [event.target.style.background, currentDrag.style.background] = 
                                        [currentDrag.style.background, event.target.style.background];
    event.target.classList.remove('little-opacity');
    currentDrag.classList.remove('half-opacity');
    [event.target.className, currentDrag.className] = 
                                        [currentDrag.className, event.target.className];
    }                                              
}

function onDragEnd(event) {
    event.preventDefault();
    currentDrag.classList.remove('half-opacity');    
} 

function removeOrAddDraggable(draggable) {
    figureRows.forEach(row => {
        const childs = row.childNodes;
        for (let i = 0; i < childs.length; i++) {
            childs[i].setAttribute('draggable', draggable);
        }
    });
    if (draggable) {
        figuresBar.ondragstart = onDragStart;
        figuresBar.ondragover = onDragOver;
        figuresBar.ondragleave = onDragLeave;
        figuresBar.ondrop = onDrop;
        figuresBar.ondragend = onDragEnd;
    }
}

function commonActions(target, className, action, func) {
    removeOldActive();    
    target.classList.add('active');
    body.className = className;
    if (action === 'click') {
        removeOrAddDraggable(false);
        figuresBar.onclick = func;
    } else {
        figuresBar.onclick = null;
        removeOrAddDraggable(true);        
    }
}

