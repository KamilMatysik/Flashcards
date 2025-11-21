var cardFlipTime = 150

let mistakesFile = "currentMistakes.json"

let correctCards = 0
let incorrectCards = 0

noNext = false
dontCreateNew = false
tick = document.getElementById("tick");
ex = document.getElementById("ex");

//Async function to read json
async function loadFlashcards(fileName){
    if (fileName === mistakesFile){
        FFN = fileName
    }
    else{
        FFN = "flashcardJSON/" + fileName 
    }
    response = await fetch(FFN)
    data = await response.json()
    flashcardSet = data.flashcardSet
    current = 0


    if(document.getElementById("endScreen").style.opacity !== "1"){
        document.getElementById("mainFlashcardQuestion").textContent = flashcardSet[current].question
        document.getElementById("mainFlashcardAnswer").textContent = flashcardSet[current].answer
    }

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
    wrongQuestions = []
    wrongAnswers = []
    tickAndExClicking()
    addClicksEndPage()
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
        /* Everytime X is clicked, add the question and answer to an array */
        wrongQuestions.push(flashcardSet[current].question)
        wrongAnswers.push(flashcardSet[current].answer)

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
    if(!dontCreateNew){
        flashcard.remove();
    }
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
    if(document.getElementById("endScreen").style.opacity !== "1"){
        document.getElementById("nextFlashcardQuestion").textContent = flashcardSet[current+1].question
        document.getElementById("nextFlashcardAnswer").textContent = flashcardSet[current+1].answer
    }
}

//Counts which flashcard its on
function flashcardCounter(){
    document.querySelector(".flashcardCounter").textContent = `- ${current+1} / ${flashcardSet.length} -`
}

//Checks if current flashcard is the last one
function checkForLast(){
    if(current == flashcardSet.length){
        noNext = true
    }
    if(current == flashcardSet.length){
        dontCreateNew = true
    }
}

//Controls screen at the end of flashcards
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

//Lists flashcards in folder
function addFlashcardsToList(data){
    for (let i = 0; i < 5; i++){
        currentFile = data["index"+String(i+1)]
        currentFileName = currentFile.split(".")[0]

        //After this, we have the name of the file ready to be put into html
        flashcardList = document.getElementById("chooseFlashcardList")
        flashcardList.innerHTML +=`<p id="flashcardID${i}">${currentFileName}</p>`
    }
}
//Lets user choose a flashcard file
if (window.location.pathname === "/index.html"){
    document.getElementById("chooseFlashcardList").addEventListener("click", function(event){
        let fileToOpen = event.target.id
        let fullFileName = document.getElementById(fileToOpen).textContent + ".json"
        window.location.href = "flashcards.html?file=" + fullFileName + "&main="+fullFileName
    })
}

//This controls the choices on the end screen
function addClicksEndPage(){
    document.getElementById("changeSet").addEventListener("click", function(){
        window.location.href = "index.html"
    })
    document.getElementById("resetCards").addEventListener("click", function(){
        const refreshToMain = new URLSearchParams(window.location.search)
        const mainFile = refreshToMain.get("main")
        window.location.href = "flashcards.html?file=" + mainFile + "&main=" + mainFile
    })
    document.getElementById("continueWithFalse").addEventListener("click", async (event) => {
        event.stopPropagation()
        event.preventDefault()

        try{
            const res = await fetch("http://127.0.0.1:5000/receiveArrays", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //this sends the data to flask
            body: JSON.stringify({ questionArray: wrongQuestions, answerArray: wrongAnswers})
       })


        let emptyCheck = ""
    try {
        emptyCheck = await res.json()
    } catch (error) {
        console.log("Error:", error)
    }
    if(emptyCheck.empty === "true"){
        noMistakes()
        return
    }

        if (!res.ok) throw new Error("Response error")

        const getMain = new URLSearchParams(window.location.search)
        const mainFile = getMain.get("main")
        window.location.href = "flashcards.html?file=" + mistakesFile + "&main=" + mainFile
    } catch(error){
        console.log("error: ", error)
    }
    })
}
//Quick custom pop-up for when user has no mistakes but wants to continue with mistakes
function noMistakes(){
    document.getElementById("noMistakesPopup").style.transform = "translateX(0%)"
    setTimeout(noMistakesReturn, 2000)
}

function noMistakesReturn(){
    document.getElementById("noMistakesPopup").style.transform = "translateX(120%)"
}