This Web App allows the user to create, edit and use flashcards locally without internet connection.
To begin, open app.py (ensure flask is installed) and run it.
While that runs in the background you should open index.html and open it in localhost:3000.
This brings you to the homepage where if you have no prior sets, you can create one and the program is fairly self explanatory.
Once one is created then it can be opened/edited to use from that same page. 
The program uses .json files that are sent between JS and Python in order to be put into the flashcards. 
Safety check are made along runtime in the case that the files are changed during/between uses of the program.
The flashcards are loaded on launch so refreshing is needed to update any details.
The user can skip the editor in the website and edit the files directly and when the template is followed, it will allowed them to still be viewed and used as flashcards by the user.
.json files can be shared and when stored in the correct directory they will function as expected.
