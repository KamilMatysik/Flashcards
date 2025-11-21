from flask import Flask, jsonify, request
from flask_cors import CORS
import json

import os, shutil

app = Flask(__name__)
#Setting up CORS due to errors without it
CORS(app, resources={r"/*": {"origins": "*"}})
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









#This returns the list of files in dir gotten earlier
@app.route("/data")
def data():
    return jsonify(flashcardDict)

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
