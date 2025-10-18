flashcard = document.getElementById("flashcard");
var cardFlipTime = 150

flashcard.addEventListener("click", function(){
    if(flashcard.classList.contains("flipped")){
        flashcard.classList.remove("flipped")
        document.getElementById("flashcardAnswer").style.display = "none"
        setTimeout(function(){
            document.getElementById("flashcardQuestion").style.display = "block"
        }, cardFlipTime)
    }
    else{
        flashcard.classList.add("flipped")
        document.getElementById("flashcardQuestion").style.display = "none" 
        setTimeout(function(){
            document.getElementById("flashcardAnswer").style.display = "block"
        }, cardFlipTime)
    }
});

