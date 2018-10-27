'use strict';

// TODO: MOBILE - to show only img and text input while keyboard is open
// TODO: LANGUAGE - render according to current language (text editor, delete modal)
// TODO: CONTINUOUS MOVING - on mousedown instead of onclick - 
//       set interval and remove it when mouse is up.
//       also - implement it on keyboard arrows.
// TODO: when gMeme.txts is empty - 
//       don't show delete modal/tell user there is nothing to delete

var gCanvas;
var gCtx;
var gIsMoving;
var gPrevPos;

function init() {

    gIsMoving = false;
    gPrevPos = {};

    // init imgs
    createImgs();

    // init keywords
    gKeyWordsMap = getFromStorage('keywordsMap');
    if (!gKeyWordsMap) {
        creatKeyWordsMap();
        saveToStorage('keywordsMap', gKeyWordsMap)
    }

    renderKeywordsDatalist();
    initGallery();
}

function initGallery() {
    renderKeywords();
    renderGallery(gImgs);
}

function initCanvas() {
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d');
    var containerWidth = document.querySelector('main').offsetWidth;
    var containerHeight = document.querySelector('main').offsetHeight;
    gCanvas.width = containerWidth;
    gCanvas.height = containerHeight;

    // set canvas width and height
    var img;
    if (gMeme.elImg) img = gMeme.elImg;
    else img = getImageById(gMeme.selectedImgId);

    var imageRatio = img.width / img.height;

    var canvasComputed = {};

    canvasComputed = { width: gCanvas.width, height: gCanvas.width / imageRatio };

    // if computed height is smaller than canvas - miminize canvas height
    if (canvasComputed.height < gCanvas.height) {
        gCanvas.height = canvasComputed.height;
    } else {
        // if width is more than height - miminize width
        if (imageRatio >= 1) {
            let ratio = img.height / gCanvas.height;
            gCanvas.width = img.width / ratio;
        }
    }

    // update aside to canvas height if desktop
    if (window.innerWidth >= 920) {
        var asideEl = document.querySelector('aside');
        asideEl.style.height = `${gCanvas.height}px`;
    }
}


// TEXT EDITING functions

function onEnterText(txt) {

    var line = gMeme.selectedLine;

    // if there is no line selected - 
    // creates new line with current values
    if (!line) {
        let currentValues = getCurrentValues();
        addNewLine(currentValues);
    }

    // update line's txt
    gMeme.selectedLine.txt = txt;

    renderMeme();
}

function getCurrentValues() {
    // get color
    var elColor = document.querySelector('.colorInput');
    var color = elColor.value;

    // get stroke color
    var elStrokeolor = document.querySelector('.strokeColorInput');
    var strokeColor = elStrokeolor.value;

    // get fontFamily
    var elFont = document.querySelector('.fontSelector');
    var font = elFont.value;

    return { color, strokeColor, font };
}

function setTextWidth(line) {
    var txt = line.txt;
    gCtx.font = `${line.size}px ${line.fontFamily}`;
    var width = gCtx.measureText(txt).width;
    line.width = width;
}


function onChangeTextColor(color) {
    // if there is a line selected
    if (gMeme.selectedLine) {
        // change its color
        changeColor(gMeme.selectedLine, color);
        // render the meme
        renderMeme();
    }
}

function onChangeStrokeColor(color) {
    // if there is a line selected
    if (gMeme.selectedLine) {
        // change its stroke color
        changeStrokeColor(gMeme.selectedLine, color);
        // render the meme
        renderMeme();
    }
}

function onChangeFontSize(value) {
    if (gMeme.selectedLine) {
        if (value === 'plus') changeFontSize(gMeme.selectedLine, 5);
        else if (value === 'minus') {
            if (gMeme.selectedLine.size > 5) changeFontSize(gMeme.selectedLine, -5);
        }
        renderMeme();
    }
}

function onChangeFontFamily(font) {
    if (gMeme.selectedLine) {
        changeFontFmaily(gMeme.selectedLine, font);
        renderMeme();
    }
}

function onMoveCanvasEl(direction) {
    if (gMeme.selectedLine) {
        moveCanvasEl(gMeme.selectedLine, direction);
        renderMeme();
    }
}

function onClickCanvas(ev, isMobile = false) {

    var mouseX = ev.clientX - gCanvas.offsetLeft;
    var mouseY = ev.clientY - gCanvas.offsetTop;

    // if on mobile - different calc
    if (isMobile) {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }

    gPrevPos.x = mouseX;
    gPrevPos.y = mouseY;

    // check if clicked on line
    var line = gMeme.txts.find(line => {
        return (mouseY < line.y + 15 && mouseY > line.y - line.size - 10
            && mouseX < line.width + line.x + 10 && mouseX > line.x - 10);
    });

    var eventToAdd = 'mousemove';
    // if on mobile - different event
    if (isMobile) {
        eventToAdd = 'touchmove';
    }

    // if a line was selected
    if (line) {
        line.isSelected = true;
        gCanvas.addEventListener(eventToAdd, drag, false);
        if (!isMobile) {
            gIsMoving = true;
        }
    } else {
        if (isMobile) {
            gCanvas.removeEventListener('touchmove', drag, false);
        }
    }

    // if clicked on different line
    // (or not on any line when there was a line selected)
    if (gMeme.selectedLine !== line) {
        // if there was a line selected before
        if (gMeme.selectedLine) {
            checkIfLineEmpty(gMeme.selectedLine);
        }
        // update current line
        gMeme.selectedLine = line;
    }

    // render text editor according to line
    renderTextEditor(line);
    renderMeme();
}

function onAddNewLine() {
    // if there is a line selected - add new line with default values.
    // if not - add new line with current values that user chose
    var currentValues;
    if (!gMeme.selectedLine) {
        currentValues = getCurrentValues();
    }

    addNewLine(currentValues);

    // get focus on input
    var elInput = document.querySelector('.textInput');
    elInput.focus();

    renderMeme();
}

function getLineCorectY() {
    var y;
    // if its the first line - put it on top
    if (!gMeme.txts.length) {
        y = 65;
        // if its the second line
    } else if (gMeme.txts.length === 1) {
        // if the first one is on top - put the second down
        if (gMeme.txts[0].y < 150) {
            y = gCanvas.height - 30;
            // if the first one in down - put the second top
        } else {
            y = 65;
        }
    } else {
        let prevLine = gMeme.txts[gMeme.txts.length - 1];
        let prevY = prevLine.y;
        let spaceBetweenLines = gCanvas.height / 6;
        y = prevY + spaceBetweenLines;
        // if y more than canvas
        if (y > gCanvas.height) {
            y = 140;
        }
    }
    return y;
}

// DRAG AND DROP functions

function drag(ev) {

    var mouseX = ev.clientX - gCanvas.offsetLeft;
    var mouseY = ev.clientY - gCanvas.offsetTop;

    // if on mobile - different calc
    if (ev.type === 'touchmove') {
        mouseX = ev.changedTouches[0].clientX - gCanvas.offsetLeft;
        mouseY = ev.changedTouches[0].clientY - gCanvas.offsetTop;
    }

    var newX = gMeme.selectedLine.x + (mouseX - gPrevPos.x);
    var newY = gMeme.selectedLine.y + (mouseY - gPrevPos.y);
    
    // if in range of canvas (relevant for mobile)
    if (newX + gMeme.selectedLine.width > 0 && newX < gCanvas.width && 
        newY > 0 && newY - gMeme.selectedLine.size < gCanvas.height) {
        gMeme.selectedLine.x = newX;
        gMeme.selectedLine.y = newY;
    
        gPrevPos.x = mouseX;
        gPrevPos.y = mouseY;
    
        renderMeme();
    }
}

function onMouseUp() {
    if (gIsMoving) {
        gCanvas.removeEventListener('mousemove', drag, false);
        gIsMoving = false;
    }
}

// MOBILE DRAG AND DROP function

function onTouchStart(ev) {
    onClickCanvas(ev, true);
}

// RENDER functions

// render meme
function renderMeme() {
    // clean canvas
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

    // render img
    var img;
    if (gMeme.elImg) img = gMeme.elImg;
    else img = getImageById(gMeme.selectedImgId);
    drawImgOnCanvas(img);

    // render lines
    gMeme.txts.forEach(line => {
        if (line.txt) {
            if (line.isSelected) {
                setTextWidth(line);
                markLine(line);
            }

            gCtx.font = `${line.size}px ${line.fontFamily}`;

            // paint inner text 
            gCtx.fillStyle = line.color;
            gCtx.fillText(line.txt, line.x, line.y);

            // paint stroke text 
            gCtx.strokeStyle = line.strokeColor;
            gCtx.strokeText(line.txt, line.x, line.y);
        }
    })
}

// mark line around selected line
function markLine(line) {
    // If line is not empty
    if (line.txt) {
        gCtx.beginPath();
        gCtx.moveTo(line.x - 10, line.y - line.size - 10);
        gCtx.lineTo(line.x + line.width + 10, line.y - line.size - 10);
        gCtx.lineTo(line.x + line.width + 10, line.y + 15);
        gCtx.lineTo(line.x - 10, line.y + 15);
        gCtx.lineTo(line.x - 10, line.y - line.size - 10);
        gCtx.strokeStyle = 'red';
        gCtx.stroke();
    }
}

function renderTextEditor(line) {
    var elHeadline = document.querySelector('.editorHeadline');
    var elColor = document.querySelector('.colorInput');
    var elStrokeColor = document.querySelector('.strokeColorInput');
    var elTextInput = document.querySelector('.textInput');
    var elFont = document.querySelector('.fontSelector');

    // TODO: render according to lang
    // if there is line selected
    if (line) {
        elHeadline.innerHTML = 'Edit Line';
        // update values
        elColor.value = line.color;
        elStrokeColor.value = line.strokeColor;
        elTextInput.value = line.txt;
        elFont.value = line.fontFamily;
    } else {
        elHeadline.innerHTML = 'New Line Editor';
        elColor.value = '#000000';
        elStrokeColor.value = '#ffffff';
        elTextInput.value = '';
        elFont.value = 'impact';
    }
}

// INJECT UL-> LI IMAGES TO GALLERY DIV
function renderGallery(imgs) {
    var elGallery = document.querySelector('.gallery-items');
    var strHtml = '<ul>';

    for (var i = 0; i < imgs.length; i++) {
        strHtml += `    <li class="gallery-img">
                        <img src="${imgs[i].url}" data-id="${imgs[i].id}" onclick="onSelectImg('${imgs[i].id}')">
                        </li>`
    }
    strHtml += '</ul>'

    elGallery.innerHTML = strHtml;
}

// render keywords
function renderKeywordsDatalist() {
    var elDatalist = document.querySelector('#keywords-list');

    var keywords = Object.keys(gKeyWordsMap);

    var strHtmls = keywords.map(keyword => {
        return `
                <option value="${keyword}">
               `;
    });

    elDatalist.innerHTML = strHtmls.join('');
}

function renderKeywords() {
    gKeyWordsMap = getFromStorage('keywordsMap');
    var keywords = Object.keys(gKeyWordsMap);

    var strHtmls = keywords.map(keyword => {
        let keywordSize = gKeyWordsMap[keyword] * 2 + 10;

        if (keywordSize > 50) {
            keywordSize = 50;
        }
        return `
        <li class="keyword" onclick="onKeywordSelect('${keyword}')" style="font-size: ${keywordSize}px">
            ${keyword}
        </li>
        `;
    });

    var elKeywords = document.querySelector('.keywords');
    elKeywords.innerHTML = strHtmls.join('');
}

// CONTROLLER BUTTONS functions

function returnToGallery(ev) {
    ev.preventDefault();
    document.body.classList.add('gallery');
    document.querySelector('main').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'inherit';
    initGallery();
}


// DELETE functions

function onEraseClick() {
    // open modal
    var elErase = document.querySelector('.erase-modal-container');
    elErase.classList.add('open');

    // update modal
    // TODO: render according to lang
    var elWhatToDelete = document.querySelector('.whatToDelete');
    if (gMeme.selectedLine && gMeme.selectedLine.txt !== '') {
        elWhatToDelete.innerHTML = 'Are you sure you want to delete line?';
    } else {
        elWhatToDelete.innerHTML = 'Are you sure you want to delete all?';
    }
}

function onDelete() {

    // remove modal
    removeModal();

    // if there is a line selected and it's not empty - delete line
    if (gMeme.selectedLine && gMeme.selectedLine.txt !== '') {
        deleteLine(gMeme.selectedLine);
    } else {
        deleteAll();
    }

    renderMeme();
    renderTextEditor();
}

function onCancelDelete() {
    // remove modal
    removeModal();
}

function removeModal() {
    var elErase = document.querySelector('.erase-modal-container');
    elErase.classList.remove('open');
}

function drawImgOnCanvas(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

// called when key is pressed while user on input line text
function onKeyPress(ev) {
    if (ev.key === 'Enter') {
        // remove selection and current line
        gMeme.selectedLine.isSelected = false;
        gMeme.selectedLine = undefined;
        // get out of input
        var elInput = document.querySelector('.textInput');
        elInput.blur();
        // render text editor and meme
        renderMeme();
        renderTextEditor();
    }
}

// SELECT IMG functions

function onSelectImg(id) {
    document.body.classList.remove('gallery');
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    createMeme(id);
    initCanvas();
    renderTextEditor();
    renderMeme();
}

// DOWNLOAD IMG functions

function onDownloadImage(elLink) {
    if (gMeme.selectedLine) {
        gMeme.selectedLine.isSelected = false;
        gMeme.selectedLine = undefined;
        renderTextEditor();
        renderMeme();
    }
    let canvas = document.getElementById('canvas');
    elLink.href = canvas.toDataURL();
    elLink.download = 'meme.jpg';
}


// UPLOAD IMG functions

function onUploadImgBtn(ev) {
    handleImageFromInput(ev, uploadNewImg);
}

// SHARE functions

function onShareMeme(ev) {
    ev.preventDefault();
    alert('Sorry, still under construction');
}

// KEYWORDS functions

function onKeywordSelect(keyword) {
    // if isn't selecting the same keyword
    if (gCurrKeyword !== keyword) {
        gCurrKeyword = keyword;
        updateKeyWordsMap(keyword);
        var imgs = getImgsByFilter(keyword);
        renderGallery(imgs);
    }
}