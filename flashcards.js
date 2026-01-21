//Declaring some global variables
var cardFlipTime = 150
let mistakesFile = "currentMistakes.json"
let correctCards = 0
let incorrectCards = 0
noNext = false
dontCreateNew = false
tick = document.getElementById("tick");
ex = document.getElementById("ex");
let makeCardCounter = 1

let fileSaved = true

const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const numbers = ['1','2','3','4','5','6','7','8','9','0'];
const symbols = ['.','_','-'];


//Async function to read json
async function loadFlashcards(fileName){
    /* Since the mistakes file is held in a different folder, if it is the file being accessed then the path needs to be different */
    if (fileName === mistakesFile){
        FFN = fileName
    }
    else{
        FFN = "flashcardJSON/" + fileName 
    }
    //Fetches the JSON file
    response = await fetch(FFN)
    data = await response.json()
    //FlashcardSet now holds the data from the JSON
    flashcardSet = data.flashcardSet
    current = 0

    //If the end screen is up, then assigning these creates errors since the flashcards are gone by then
    if(document.getElementById("endScreen").style.opacity !== "1"){
        document.getElementById("mainFlashcardQuestion").textContent = flashcardSet[current].question
        document.getElementById("mainFlashcardAnswer").textContent = flashcardSet[current].answer
    }

    assignQA()
    flashcardCounter()
}

//This is done on load of flashcards file
function onLoadFunction(){
    //Getting the name of current html file open since multiple share same script file
    const path = window.location.pathname;
    const file = path.split("/").pop();


    if (file === "flashcards.html") {
        //Current file being used is stored in URL so this checks that
        const params = new URLSearchParams(window.location.search)
        const fileName = params.get("file")
    if (fileName) {
        //This takes the fileName gotten previously and loads it through this function
      loadFlashcards(fileName)
    }
    }
    
    //Assigning some variables once the file loads
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
    //All flipping of flashcards is handled in here
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
        tick.style.pointerEvents = "none"   
        ex.style.pointerEvents = "none"
        setTimeout(() => {
            removeCard();
            lowerCard();
        }, 250);
        setTimeout(returnExAndTickClick, 450)
    });

    //Clicking the X
    ex.addEventListener("click", function(){
        /* Everytime X is clicked, add the question and answer to an array */
        wrongQuestions.push(flashcardSet[current].question)
        wrongAnswers.push(flashcardSet[current].answer)

        flashcard.style.transform = "translateX(200%)";
        incorrectCards++
        document.getElementById("rightCounter").textContent = incorrectCards
        tick.style.pointerEvents = "none"
        ex.style.pointerEvents = "none"
        setTimeout(() => {
            removeCard();
            lowerCard();
        }, 250);
        setTimeout(returnExAndTickClick, 450)
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

//Returns clicking to tick and ex
function returnExAndTickClick(){
    tick.style.pointerEvents = "all"
    ex.style.pointerEvents = "all"
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
        //Uses the data from JSON to assign questions and answers to the next flashcard in line
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
    //Receives list of file names of available flashcards from flask and then loads them into a function that will list them
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
    //For each file in the folder of flashcard files, it gets its name so that it can input it into html
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
    //This uses the URl to store the name of the JSON file
    document.getElementById("chooseFlashcardList").addEventListener("click", function(event){
        let fileToOpen = event.target.id
        let fullFileName = document.getElementById(fileToOpen).textContent + ".json"
        //It stores it twice as 'file' will change, but the original should be remembered
        window.location.href = "flashcards.html?file=" + fullFileName + "&main="+fullFileName
    })
    document.getElementById("makeSetButton").addEventListener("click", function(){
        document.getElementById("nameFilePopup").style.opacity = 100
        document.getElementById("midBackground").style.opacity = 100

        document.getElementById("nameFilePopup").style.pointerEvents = "all"
        document.getElementById("chooseFlashcardList").style.pointerEvents = "none"

        enablePopupButtons()
    })
}
//This allows user to press buttons accept and reject on the popup
function enablePopupButtons(){
    document.getElementById("rejectButton").addEventListener("click", function(){
        document.getElementById("nameFilePopup").style.opacity = 0
        document.getElementById("midBackground").style.opacity = 0

        document.getElementById("nameFilePopup").style.pointerEvents = "none"
        document.getElementById("chooseFlashcardList").style.pointerEvents = "all"
        document.getElementById("fileName").value = ""
    })
    //Needs to check if file name is ok (no special symbols, not too many characters, enough character tho)
    document.getElementById("acceptButton").addEventListener("click", function(){
        let inputtedName = document.getElementById("fileName").value
        let errorField = document.getElementById("nameErrorPopup")
        let invalidFileName = 0
        let containsACharacter = 0

        //Ensuring name isnt too short
        if(inputtedName.length < 4){
            errorField.innerHTML = "File name needs to be atleast 4 characters"
            errorField.style.opacity = 100
            setTimeout(resetText, 4000)
            return
        }
        //Ensuring name isnt too long
        else if(inputtedName.length > 20){
            errorField.innerHTML = "File name cannot be longer than 20 characters"
            errorField.style.opacity = 100
            setTimeout(resetText, 4000)
            return
        }
        //Ensuring name doesnt contain illegal symbols
        for(let i = 0; i < inputtedName.length; i++){
            let wordToCheck = inputtedName[i].toLowerCase()
            if(numbers.includes(wordToCheck) || alphabet.includes(wordToCheck) || symbols.includes(wordToCheck)){
                continue
            }
            else{
                invalidFileName = 1
                break
            }
        }
        if(invalidFileName){
            errorField.innerHTML = `File can only include no spaces and only the following symbols: .  _  -`
            errorField.style.opacity = 100
            setTimeout(resetText, 4000)
            return
        }
        //Ensuring name doesnt end in period or space
        if((inputtedName[inputtedName.length -1]) == '.'){
            errorField.innerHTML = "Cannot end file name with a period"
            errorField.style.opacity = 100
            setTimeout(resetText, 4000)
            return
        }
        //Ensuring name has atleast one legal character
        for(let i = 0; i < inputtedName.length; i++){
            let wordToCheck = inputtedName[i].toLowerCase()
            if(numbers.includes(wordToCheck) || alphabet.includes(wordToCheck)){
                break
            }
            if(i == inputtedName.length){
                errorField.innerHTML = "File name must contain atleast one alphanumeric character"
                errorField.style.opacity = 100
                setTimeout(resetText, 4000)
                return
            }

        }
        
        //IF MORE CHECKS ARE NEEDED, ADD ABOVE THIS
        //AT THIS POINT, ASSUMED FILE NAME IS VALID
        createNewFile()
    })
}

function resetText(){
    document.getElementById("nameErrorPopup").style.opacity = 0
}

//This controls the choices on the end screen
function addClicksEndPage(){
    //If user wants to change flashcard sets, it brings them back to where that is possible
    document.getElementById("changeSet").addEventListener("click", function(){
        window.location.href = "index.html"
    })
    //If user wants to reset the current set, it uses the previously saved main file name and opens it
    document.getElementById("resetCards").addEventListener("click", function(){
        const refreshToMain = new URLSearchParams(window.location.search)
        const mainFile = refreshToMain.get("main")
        window.location.href = "flashcards.html?file=" + mainFile + "&main=" + mainFile
    })
    //If the user wants to continue with their mistakes, it sends the data of the mistakes made to flask...
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

    //.., flask then formats this into a JSON file which can be accessed here, but first program needs to be sure that mistakes exist in the first place
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
        //Once again using the URL to store current file, but ensuring to still keep main file for when user wants to reset the set
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
//And this just makes it disappear after a small cooldown
function noMistakesReturn(){
    document.getElementById("noMistakesPopup").style.transform = "translateX(120%)"
}

//Functions for making flashcards

//This is called when making flashcard page launches
function makeFlashcardPageLaunch(){
    createNewCard()
    document.getElementById("saveChanges").addEventListener("click", saveChanges)
    document.getElementById("discardChanges").addEventListener("click", discardChanges)

    document.addEventListener("keypress", function(){
        fileSaved = false
    })
}
//When + is clicked, create new flashcard
function createNewCard(){
    document.getElementById("moreQuestions").addEventListener("click", function(){
        newCard = document.createElement("div")
        newCard.classList.add("makeFlashcard")
        newCard.id = `makeFlashcard${makeCardCounter}`
        newCard.innerHTML = `
            <div class="inputDiv">
                <textarea placeholder="Enter Question Here:" class="makeQuestion inputFields" id="makeQuestion${makeCardCounter}"></textarea>
                <textarea placeholder="Enter Answer Here:" class="makeAnswer inputFields" id="makeAnswer${makeCardCounter}"></textarea>
            </div>
            <div class="binIcon" id="binIcon${makeCardCounter}">
                    <svg id="don${makeCardCounter}" class="toBinClick" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path id="bon${makeCardCounter}" class="toBinClick" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </div>`

        document.getElementById("makeFlashcardHolder").append(newCard)
        makeCardCounter++
    })
    document.getElementById("makeFlashcardHolder").addEventListener("click", function(event){

        if(event.target.classList.contains("binIcon") || event.target.classList.contains("toBinClick")){
            let cardNumber = event.target.id.split("on").at(-1)
            let cardToDelete = `makeFlashcard${cardNumber}`
            //Make sure atleast 1 card exists
            let chilNum = document.getElementById("makeFlashcardHolder").childElementCount
            if(chilNum > 1){
                document.getElementById(cardToDelete).remove()
            }
            else{
                //ADD SMALL ERROR EXPLAINER
                noMistakes()
            }
        }
    })
}

//Save changes
function saveChanges(){
    //NEED CODE TO THIS
    fileSaved = true
}

//Discard Changes
function discardChanges(){
    
}


//Create file
async function createNewFile(){
    let nameForNewFile = document.getElementById("fileName").value
    
    try{
            await fetch("http://127.0.0.1:5000/makeNewFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //this sends the data to flask
            body: JSON.stringify({ nameForFile: nameForNewFile})
       })

}catch (error){
    console.error(error)
}}
