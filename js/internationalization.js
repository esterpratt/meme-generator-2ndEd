'use strict';

// Internationalization and localization
var gLanguage = 'eng';
var language = [{}]

// object with all translation
var gTranslations = {
    eng: {
        isRtl: false,
        title: 'meme\'tasek?',
        headlayers: 'Layers',
        texteditor: 'Text Editor',
        btnback: 'Back',
        btnacces: 'Accessibility',
        btnshare: 'Share',
        btnupload: 'Upload',
        btndownload: 'Download',
        headfooter: '⛬ SHARE WITH LOVE ❤',
        modalheadline: 'Are you sure you want to delete all?',
        deletebtn: 'Delete',
        deletebtncancel: 'Cancel',

    },
    heb: {
        isRtl: true,
        title: 'מימ\'תעסק?',
        headlayers: 'שכבות',
        texteditor: 'עורך טקסט',
        btnback: 'חזרה',
        btnacces: 'נגישות',
        btnshare: 'שיתוף',
        btnupload: 'העלאה',
        btndownload: 'הורדה',
        headfooter: '⛬  שתפו באהבה  ❤',
        modalheadline: 'האם אתה בטוח שתרצה למחוק?',
        deletebtn: 'מחק',
        deletebtncancel: 'ביטול',
    }
}

var gTranslationsTitles = {
    eng: {
        btnback: 'Back to Gallery',
        btnacces: 'Change to accessibility mode',
        btnshare: 'Share with friends',
        btnupload: 'Upload to server',
        btndownload: 'Download image',
    },
    heb: {
        btnback: 'חזרה לגלריה',
        btnacces: 'עבור למצב נגישות',
        btnshare: 'שיתוף לחברים',
        btnupload: 'העלאה לשרת',
        btndownload: 'הורדה',
    }
}

function getUserLang() {
    return gLanguage;
}
var gTranslationsPlaceholder = {
    eng: {
        inputtext: 'Enter Text',
    },
    heb: {
        inputtext: 'הזן טקסט',    }
}

function changeLanguage(lang) {
    gLanguage = lang;
    translateElements(lang);
    translateElementsTitle(lang);
    translateElementsPlaceholder(lang);
    if (gTranslations[lang].isRtl) document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
}

function translateElements(lang) {
    // select all the element with data attribute - for each - translate;
    var translateEls = document.querySelectorAll('[data-translate]');
    for (var i = 0; i < translateEls.length; i++) {
        var translateEl = translateEls[i];
        var translate = translateEl.dataset.translate;
        translateEl.innerText = gTranslations[lang][translate];
    }
}

function translateElementsTitle(lang) {
    // select all the element with data attribute - for each - translate title;
    var translateEls = document.querySelectorAll('[data-translate]');
    for (var i = 0; i < translateEls.length; i++) {
        var translateEl = translateEls[i];
        if (translateEl.title) {
            var translate = translateEl.dataset.translate;
            translateEl.title = gTranslationsTitles[lang][translate];
        }
    }
}

function translateElementsPlaceholder(lang) {
    // select all the element with data attribute - for each - translate placeholder;
    var translateEls = document.querySelectorAll('[data-translate]');
    for (var i = 0; i < translateEls.length; i++) {
        var translateEl = translateEls[i];
        if (translateEl.placeholder) {
            var translate = translateEl.dataset.translate;
            translateEl.placeholder = gTranslationsPlaceholder[lang][translate];
        }
    }
}
