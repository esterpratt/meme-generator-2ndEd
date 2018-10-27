'use strict';

var gImgs;
var gKeyWordsMap;
var gCurrKeyword;

function createImgs() {
    gImgs = [
        createImg('img/003.jpg', ['trump', 'stupid', 'man']),
        createImg('img/004.jpg', ['cute', 'dog', 'cute']),
        createImg('img/005.jpg', ['dog', 'kid', 'sleepy']),
        createImg('img/006.jpg', ['cat', 'sleepy']),
        createImg('img/2.jpg', ['happy', 'dance']),
        createImg('img/5.jpg', ['happy', 'kid']),
        createImg('img/8.jpg', ['happy']),
        createImg('img/9.jpg', ['happy', 'kid', 'cute']),
        createImg('img/12.jpg', ['man']),
        createImg('img/19.jpg', ['man', 'angry']),
        createImg('img/img6.jpg', ['dog', 'happy', 'cute']),
        createImg('img/drevil.jpg', ['man']),
        createImg('img/img2.jpg', ['kid', 'dance', 'happy', 'cute']),
        createImg('img/img4.jpg', ['trump', 'stupid', 'man']),
        createImg('img/img5.jpg', ['happy', 'kid', 'cute']),
        createImg('img/img11.jpg', ['happy', 'man']),
        createImg('img/img12.jpg', ['man']),
        createImg('img/leo.jpg', ['happy', 'man']),
    ];
}

function createImg(url, keyWords) {
    return { id: createId(), url, keyWords };
}

function getImageById(id) {
    return document.querySelector(`[data-id='${id}']`);
}

function uploadNewImg(imgEl) {
    gMeme.elImg = imgEl;
    deleteAll();
    initCanvas();
    renderTextEditor();
    renderMeme();
}

function getImgsByFilter(keyword) {
    var filteredImgs = gImgs.filter(img => {
        return img.keyWords.some(imgKewWord => {
            return imgKewWord === keyword
        })
    })

    return filteredImgs;
}

function creatKeyWordsMap() {
    gKeyWordsMap = {};
    // go over imgs keywords and init keywords count to 1
    gImgs.forEach(img => {
        img.keyWords.forEach(keyWord => {
            gKeyWordsMap[keyWord] = 1;
        });
    });
}

function updateKeyWordsMap(key) {
    if (gKeyWordsMap[key]) {
        gKeyWordsMap[key]++;
        saveToStorage('keywordsMap', gKeyWordsMap);
    }
}