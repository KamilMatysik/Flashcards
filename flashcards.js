var cardFlipTime = 150


let correctCards = 0
let incorrectCards = 0

noNext = false
dontCreateNew = false
tick = document.getElementById("tick");
ex = document.getElementById("ex");

//Async function to read json
async function loadFlashcards(fileName){
    FFN = "flashcardJSON/" + fileName 
    response = await fetch(FFN)
    data = await response.json()
    flashcardSet = data.flashcardSet
    current = 0
    document.getElementById("mainFlashcardQuestion").textContent = flashcardSet[current].question
    document.getElementById("mainFlashcardAnswer").textContent = flashcardSet[current].answer
    assignQA()
    flashcardCounter()
}

//This is done on load of flashcards file
function onLoadFunction(){
    
    const path = window.location.pathname;
    const file = path.split("/").pop();


    if (file === "flashcards.html") {
        const params = new URLSearchParams(window.location.search)
        const fileName = params.get("file")
    if (fileName) {
      loadFlashcards(fileName)
    }
    }
    
    
    flashcard = document.getElementById("mainFlashcard")
    tickAndExClicking()
    addFlashcardClick()
    nextFlashcard = document.getElementById("nextFlashcard")
    nextFlashcard.style.transition = "none"
    setTimeout(returnTransition,200)
}

//Returns transition animation to next flashcard on start
function returnTransition(){
    nextFlashcard.style.transition = "transform 0.25s linear"
}

//This handles when flashcards are clicked
function addFlashcardClick(){
    flashcard.addEventListener("click", function(){
    document.querySelector(".flashcardCounter").style.display = "none"
    if(flashcard.classList.contains("flipped")){
        flashcard.classList.remove("flipped")
        document.getElementById("mainFlashcardAnswer").style.display = "none"
        setTimeout(function(){
            document.getElementById("mainFlashcardQuestion").style.display = "block"
            document.querySelector(".flashcardCounter").style.display = "block"
        }, cardFlipTime)
    }
    else{
        flashcard.classList.add("flipped")
        document.getElementById("mainFlashcardQuestion").style.display = "none" 
        setTimeout(function(){
            document.getElementById("mainFlashcardAnswer").style.display = "block"
            document.querySelector(".flashcardCounter").style.display = "block"
        }, cardFlipTime)
    }
    });
}

function tickAndExClicking(){
    //Clicking the tick
    tick.addEventListener("click", function(){
        flashcard.style.transform = "translateX(-200%)";
        correctCards++
        document.getElementById("leftCounter").textContent = correctCards   
        setTimeout(() => {
            removeCard();
            lowerCard();
        }, 250);
    });

    //Clicking the X
    ex.addEventListener("click", function(){
        flashcard.style.transform = "translateX(200%)";
        incorrectCards++
        document.getElementById("rightCounter").textContent = incorrectCards
        setTimeout(() => {
            removeCard();
            lowerCard();
        }, 250);
    });
}

//Delete card
function removeCard(){
    flashcard.remove();
}

//Lowers next card plus makes it the main card
function lowerCard(){
    current++
    checkForLast()

    if(noNext){
        endScreen()
        return
    }

    document.getElementById("nextFlashcard").id = "mainFlashcard"
    document.getElementById("nextFlashcardAnswer").id = "mainFlashcardAnswer"
    document.getElementById("nextFlashcardQuestion").id = "mainFlashcardQuestion"
    
    
    
    flashcard = document.getElementById("mainFlashcard");
    flashcard.style.transform = "translateY(0%)"
    flashcard.style.removeProperty("transform");
    flashcard.style.transition = "transform 0.25s linear";
    flashcardCounter()
    addFlashcardClick()
    if(!dontCreateNew){
        createNextCard()
        assignQA()
    }
        
}

//Creates the next card that will come down
function createNextCard(){
    newFlashcard = document.createElement("div")
    dontCreateNew = false

    newFlashcard.id = "nextFlashcard"
    newFlashcard.classList.add("flashcard")
    newFlashcard.innerHTML = `
        <div>
            <p class="flashcardCounter"></p>
            <p id="nextFlashcardQuestion" class="flashcardText"></p>
            <p id="nextFlashcardAnswer" class="flashcardText"></p>
        </div>`

    document.body.append(newFlashcard)
}

//Assigns question and answer to flashcard
function assignQA(){
    document.getElementById("nextFlashcardQuestion").textContent = flashcardSet[current+1].question
    document.getElementById("nextFlashcardAnswer").textContent = flashcardSet[current+1].answer
}

function flashcardCounter(){
    document.querySelector(".flashcardCounter").textContent = `- ${current+1} / ${flashcardSet.length} -`
}

function checkForLast(){
    if(current == flashcardSet.length){
        noNext = true
    }
    if(current == flashcardSet.length){
        dontCreateNew = true
    }
}

function endScreen(){
    document.getElementById("choices").style.opacity = "0%"
    document.getElementById("leftRightCounters").style.opacity = "0%"
    let endScreen = document.getElementById("endScreen")
    endScreen.style.opacity = "100%"
    endScreen.style.pointerEvents = "all"
}



//Code For Choosing Flashcard File
async function chooseFlashcardLoad(){
    try{
        const response = await fetch("http://127.0.0.1:5000/data")
        if (!response.ok) throw new Error("Response Error")
        const jsonData = await response.json()
        addFlashcardsToList(jsonData)
    } catch (error) {
        
    }

}

function addFlashcardsToList(data){
    for (let i = 0; i < 5; i++){
        currentFile = data["index"+String(i+1)]
        currentFileName = currentFile.split(".")[0]

        //After this, we have the name of the file ready to be put into html
        flashcardList = document.getElementById("chooseFlashcardList")
        flashcardList.innerHTML +=`<p id="flashcardID${i}">${currentFileName}</p>`
    }
}
document.getElementById("chooseFlashcardList").addEventListener("click", function(){
    let fileToOpen = event.target.id
    let fullFileName = document.getElementById(fileToOpen).textContent + ".json"
    window.location.href = "flashcards.html?file=" + fullFileName
})