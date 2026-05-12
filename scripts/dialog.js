


let indexNumber = null;
let nextIndex = null;
let imageFile = './img/';
let dialogRef = document.getElementById('imgDialog');
let dialog = document.getElementById("imgDialog");
// let hero = dialog.querySelector(".heroDialog");


// function init() {
//     let NewImages = document.getElementById('import-image');
//     NewImages.innerHTML = ' ';
//     for (let index = 0; index < images.length; index++) {
//        NewImages.innerHTML += `<img src="./img/${images[index]}" onclick="dialogOpen(); dialogImgImport(this);" tabindex="0" class="mainImg" alt="Images">`;
//     }
//     setEventListener ()
// }


function dialogImgImport(clickedImage) {
    let srcValue = clickedImage.getAttribute("src");
    let imageName = srcValue.split('/').pop();
    indexNumber = images.indexOf(imageName);
    document.getElementById("imageNumber").innerText = `${indexNumber + 1} / ${images.length} `;
    let dialogImg = document.getElementById("dialogImportImage");
    dialogImg.src = srcValue;
}


function numberEdit (nextImage) {
    let nextDialogImg = document.getElementById("dialogImportImage");
    nextDialogImg.src = imageFile + nextImage;
    document.getElementById("imageNumber").innerText = `${indexNumber + 1} / ${images.length} `; 
}


function imageBefore () {
    if ( indexNumber >= images.length - 1) {
        indexNumber = -1;
        }
    indexNumber = indexNumber + 1;
    let nextImage = images[indexNumber];
    numberEdit (nextImage);
}


function imageBack () {
    if ( indexNumber <= 0) {
        indexNumber = images.length;
        }
    indexNumber = indexNumber - 1; 
    let nextImage = images[indexNumber];
    numberEdit (nextImage);
}

    
function dialogOpen() {
    dialogRef.showModal();        
    dialogRef.classList.add('opened');
}


function dialogClose() {
    dialogRef.close();                
    dialogRef.classList.remove('opened'); 
}


function setEventListener () {
    hero.addEventListener("click", function(event) {
        event.stopPropagation();
    });
    dialog.addEventListener("click", function(event) {
        dialog.close();
    });
    document.addEventListener("keydown", dialogHandleKeys)
}


function dialogHandleKeys (event) {
    if (dialogOpen === false)  {
        return;
    }
    if (event.key === "Escape") {
        dialogClose()
    }
    if (event.key === "ArrowRight") {
        imageBefore () 
    }
    if (event.key === "ArrowLeft") {
        imageBack ()
    }
}
