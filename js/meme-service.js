'use strict';

var gMeme;

function createMeme(id) {
    gMeme = {
        elImg: null,
        selectedImgId: id,
        txts: [],
        selectedLine: undefined
    };
}

function createLine(size, x, y, color, strokeColor, fontFamily) {
    var line = {
        id: createId(),
        txt: 'New Line',
        size,
        x,
        y,
        color,
        strokeColor,
        fontFamily,
        isSelected: true
    }

    gMeme.txts.push(line);
    return line;
}

function addNewLine(currentValues) {

    // if there is a line selected - remove selection
    if (gMeme.selectedLine) {
        checkIfLineEmpty(gMeme.selectedLine);
        renderTextEditor();
    }

    // creates new line
    var size = 50;
    var x = 20;
    var y = getLineCorectY();
    var color;
    var strokeColor;
    var font;
    if (currentValues) {
        color = currentValues.color;
        strokeColor = currentValues.strokeColor;
        font = currentValues.font;
    } else {
        color = '#000000';
        strokeColor = '#ffffff';
        font = 'impact';
    }
    gMeme.selectedLine = createLine(size, x, y, color, strokeColor, font);
}

function checkIfLineEmpty(line) {
    // if line empty - erase it from array
    if (line.txt === '') {
        deleteLine(line);
        // if not empty - remove its selection
    } else {
        line.isSelected = false;
    }
}

function deleteLine(line) {
    var lineIdx = gMeme.txts.findIndex(currLine => {
        return line.id === currLine.id;
    })

    gMeme.selectedLine = undefined;
    gMeme.txts.splice(lineIdx, 1);
}

function deleteAll() {
    gMeme.selectedLine = undefined;
    gMeme.txts = [];
}

function getLineByIndex(lineIndex) {
    return gMeme.txts[lineIndex];
}

function changeColor(line, color) {
    line.color = color;
}

function changeStrokeColor(line, color) {
    line.strokeColor = color;
}

function changeFontFmaily(line, font) {
    line.fontFamily = font;
}

function changeFontSize(line, value) {
    line.size += value;
}

function moveCanvasEl(line, direction) {
    var moveLenght = 10;
    switch (direction) {
        case 'left':
            if (line.x + line.width > 30) {
                line.x -= moveLenght;
            }
            break;
        case 'right':
            if (line.x < gCanvas.width - 30) {
                line.x += moveLenght;
            }
            break;
        case 'up':
            if (line.y > 30) {
                line.y -= moveLenght;
            }
            break;
        case 'down':
            if (line.y - line.size < gCanvas.height - 30) {
                line.y += moveLenght;
            }
            break;
    }
}

