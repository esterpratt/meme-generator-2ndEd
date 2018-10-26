var UPLOAD_URL = 'http://ca-upload.com/api/v1.0/upload/upload.php'
var UPLOADED_IMG_URL = 'http://ca-upload.com/api/v1.0/upload/img'
var SHARE_URL = 'http://ca-upload.com/api/v1.0/upload/serveForShare.php?id='

// on submit call to this function
function uploadImg(elForm, ev) {
    // ev.preventDefault();

    document.getElementById('imgData').value = canvas.toDataURL("image/jpeg");
   
    // A function to be called if request succeeds
    function onSuccess(uploadedImgId) {
        console.log('uploadedImgId', uploadedImgId);

        var urlForShare = SHARE_URL + uploadedImgId;
        //var imgUrl      = UPLOADED_IMG_URL + uploadedImgId;

        urlForShare = encodeURIComponent(urlForShare)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${urlForShare}&t=${urlForShare}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgId}&t=${uploadedImgId}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
    })
    .then(function (response) {
        return response.text()
    })
    .then(onSuccess)
    .catch(function (error) {
        console.error(error)
    })
}

function handleImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


// add the publish form to dom + fb root
(function initService() {
    const body = document.querySelector('body')
    var fbDiv = document.createElement("div"); 
    fbDiv.id = 'fb-root'
    document.body.appendChild(fbDiv)

    document.querySelector('.publish-form-container').innerHTML = 
        `<form style="display:none" class="publish-form" action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
            <input name="img" id="imgData" type="hidden"/>
            <button type="submit" class="publish-btn">Publish</button>
        </form>`

    if (!document.querySelector('.share-container')) {
        var shareConDiv = document.createElement('span'); 
        shareConDiv.classList.add('share-container')
        document.querySelector('.publish-form').appendChild(shareConDiv)
    }

    // facebook api
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}())

