from flask import Flask, jsonify, request
from flask_cors import CORS
import json

import os, shutil

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
dt = {}


if not os.path.isdir("nonJSONWaste"):
    os.mkdir("nonJSONWaste")

flashcardDict  = {}

if os.path.isdir("flashcardJSON"):
    jsonFileCount = 0
    for root, dirs, files in os.walk("flashcardJSON/"):
        for f in files:
            nameList = f.split(".")
            if nameList[-1] =="json":
                jsonFileCount += 1

                flashcardDict.update({f"index{jsonFileCount}": f})

            else:
                fromPath = os.path.join(root, f)
                toPath = os.path.join("nonJSONWaste", f)

                shutil.move(fromPath, toPath)

else:
    os.mkdir("flashcardJSON")
    jsonFileCount = 0










@app.route("/data")
def data():
    return jsonify(flashcardDict)

@app.route("/receiveArrays", methods=["GET", "POST"])
def receiveArrays():
    arrayData = request.get_json()
    questionArray = arrayData.get("questionArray", [])
    answerArray = arrayData.get("answerArray", [])

    #This resets the folder if it exists, or creates it if not
    if not os.path.isdir("continueMistakes"):
        os.mkdir("continueMistakes")
    else:
        for root, dirs, files in os.walk("continueMistakes/"):
            for f in files:
                os.remove(os.path.join(root, f))
            for d in dirs:
                shutil.rmtree(os.path.join(root, d))
        
    #check to ensure atleast 1 thing is in json
    if len(questionArray) == 0 or len(answerArray) == 0:
        return jsonify({})
    
    cards = [{"question": q, "answer": a} for q, a in zip(questionArray, answerArray)]

    dt = {"flashcardSet": cards}


    #need to create new json file here
    with open("currentMistakes.json", "w") as fp:
        json.dump(dt, fp, indent=2)
        

    #return new json file here
    return jsonify(filename="currentMistakes.json")

if __name__ == "__main__":
    app.run(debug=False)
