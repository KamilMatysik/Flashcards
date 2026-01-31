from flask import Flask, jsonify, request
from flask_cors import CORS
import json

import os, shutil

app = Flask(__name__)
#Setting up CORS due to errors without it
CORS(app, resources={r"/*": {"origins": "*"}})

def fileCheck():
    #Init var for storing data
    dt = {}

    #Creating dir for files in wrong dir so that they aren't deleted instead
    if not os.path.isdir("nonJSONWaste"):
        os.mkdir("nonJSONWaste")

    flashcardDict  = {}

    if os.path.isdir("flashcardJSON"):
        jsonFileCount = 0
        for root, dirs, files in os.walk("flashcardJSON/"):
            #For each file in the dir, add JSON ones to the count...
            for f in files:
                nameList = f.split(".")
                if nameList[-1] =="json":
                    jsonFileCount += 1

                    flashcardDict.update({f"index{jsonFileCount}": f})
            #...and move all the ones that shouldn't be there
                else:
                    fromPath = os.path.join(root, f)
                    toPath = os.path.join("nonJSONWaste", f)

                    shutil.move(fromPath, toPath)
    #If a dir with flashcards does not exist, then create a new one
    else:
        os.mkdir("flashcardJSON")
        jsonFileCount = 0
    return flashcardDict

#When file name is brought in from js, make a file with that name
def createNewFile(fileJSON):
    fileName = fileJSON["nameForFile"]
    path = "flashcardJSON/"
    
    for root, dirs, files in os.walk("flashcardJSON/"):
        for f in files:
            names = f.split(".")
            if names[0] == fileName:
                fileName = fileName + " (1)"
    
                while (fileName+".json") in files:
                    aftB = fileName.split("(")
                    num = aftB[-1].split(")")
                    num = int(num[0])
                    num+=1
                    num = str(num)
                    fileName = aftB[0] + "(" + num + ")"
                

            fullFileName = fileName + ".json"
            with open(os.path.join(path, fullFileName), 'w') as fp:
                pass


    





#This returns the list of files in dir gotten earlier
@app.route("/data")
def data():
    return jsonify(fileCheck())

@app.route("/edit", methods=["GET", "POST"])
def edit():
    # search for file
    sentData = request.get_json()
    fileName = sentData.get("fileName", [])
    toOpen = "flashcardJSON/"+fileName
    editData = ""
    
    try:
        with open(toOpen, "r") as file:
            editData = json.load(file)
    except FileNotFoundError:
        print(f"Error, file not found: {toOpen}")

    
    
    return editData;

@app.route("/saveEdits", methods=["POST", "GET"])
def saveEdits():
    data = request.get_json()
    questionArray = data.get("saveQ")
    answerArray = data.get("saveA")
    cards = [{"question": q, "answer": a} for q, a in zip(questionArray, answerArray)]
    dt = {"flashcardSet": cards}


    #need to create new json file here
    with open("flashcardJSON/" + data.get("fileName"), "w") as fp:
        json.dump(dt, fp, indent=2)
    return "", 200


@app.route("/makeNewFile", methods=["POST"])
def makeNewFile():
    fileName = request.get_json()
    createNewFile(fileName)
    return "", 200

#This first receives 2 arrays of data from JS (users' incorrect answers)
@app.route("/receiveArrays", methods=["GET", "POST"])
def receiveArrays():
    arrayData = request.get_json()
    questionArray = arrayData.get("questionArray", [])
    answerArray = arrayData.get("answerArray", [])

        
    #check to ensure atleast 1 thing is in json
    if len(questionArray) == 0 or len(answerArray) == 0:
        return jsonify({"empty":"true"})
    #It takes the data received from JS and formats it for JSON file
    cards = [{"question": q, "answer": a} for q, a in zip(questionArray, answerArray)]

    dt = {"flashcardSet": cards}


    #need to create new json file here
    with open("currentMistakes.json", "w") as fp:
        json.dump(dt, fp, indent=2)
        

    return jsonify({"empty":"false"})

if __name__ == "__main__":
    app.run(debug=False)
