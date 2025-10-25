flashcard = document.getElementById("mainFlashcard");
var cardFlipTime = 150
addFlashcardClick()

tick = document.getElementById("tick");
ex = document.getElementById("ex");

function onLoadFunction(){
    nextFlashcard = document.getElementById("nextFlashcard")
    nextFlashcard.style.transition = "none"
    setTimeout(returnTransition,200)
}

function returnTransition(){
    nextFlashcard.style.transition = "transform 0.25s linear"
}

function addFlashcardClick(){
    flashcard.addEventListener("click", function(){
    if(flashcard.classList.contains("flipped")){
        flashcard.classList.remove("flipped")
        document.getElementById("mainFlashcardAnswer").style.display = "none"
        setTimeout(function(){
            document.getElementById("mainFlashcardQuestion").style.display = "block"
        }, cardFlipTime)
    }
    else{
        flashcard.classList.add("flipped")
        document.getElementById("mainFlashcardQuestion").style.display = "none" 
        setTimeout(function(){
            document.getElementById("mainFlashcardAnswer").style.display = "block"
        }, cardFlipTime)
    }
    });
}

tick.addEventListener("click", function(){
    flashcard.style.transform = "translateX(-200%)";
    setTimeout(() => {
        removeCard();
        lowerCard();
    }, 250);
});

ex.addEventListener("click", function(){
    flashcard.style.transform = "translateX(200%)";
    setTimeout(() => {
        removeCard();
        lowerCard();
    }, 250);
});

function removeCard(){
    flashcard.remove();
}

function lowerCard(){
    document.getElementById("nextFlashcard").id = "mainFlashcard"
    document.getElementById("nextFlashcardAnswer").id = "mainFlashcardAnswer"
    document.getElementById("nextFlashcardQuestion").id = "mainFlashcardQuestion"
    flashcard = document.getElementById("mainFlashcard");
    flashcard.style.transform = "translateY(0%)"

    flashcard.style.removeProperty("transform");
    flashcard.style.transition = "transform 0.25s linear";

    addFlashcardClick()
    createNextCard()
}

function createNextCard(){
    newFlashcard = document.createElement("div")

    newFlashcard.id = "nextFlashcard"
    newFlashcard.classList.add("flashcard")
    newFlashcard.innerHTML = `
        <div>
            <p id="nextFlashcardQuestion" class="flashcardText">Extra q</p>
            <p id="nextFlashcardAnswer" class="flashcardText">extra a</p>
        </div>`

    document.body.append(newFlashcard)
}
