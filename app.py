from flask import Flask, jsonify
from flask_cors import CORS

import os, shutil

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


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

if __name__ == "__main__":
    app.run(debug=True)
