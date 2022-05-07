const express = require('express');
const path = require("path");
const note = require('./db/db.json');
const fs = require('fs');

const uuid = require('../helpers/uuid');

const app = express();
////////////////////////////////////////////////////////////////
//assigning port number to listen on 
const PORT = 3001;
//////////////////////////////////////////////////////////////
//middle ware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//////////////////////////////////////////////////////////////
//get route for index.html file
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

///////////////////////////////////////////////////////////
// read the db.json file
app.get ('/api/notes', (req, res) => 
    res.json(note)
),

/////////////////////////////////////////////////////////
//get route for notes.html 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

///////////////////////////////////////////////////////
//Post route for new notes
app.post("/api/notes", function (req, res) {
  // Save new note to the request body, add it to the db.json file
  const { title, text} = req.body;

  if (title && text ) {
      // Variable for the Note object to be saved
      const newNote = {
        title,
        text,
        review_id: uuid(),
      };
   note.push(newNote);
      }
  // Return the new note
  fs.writeFile("./db/db.json", JSON.stringify(note, null, 4), function () {
    res.json(note);
  });
});

//////////////////////////////////////////////////////
//view previous notes when clicked



//////////////////////////////////////////////////////
//delete funtion


////////////////////////////////////////////////
 // If route is not found, re-route to home page
 app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});



//Listening for requests on port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

module.exports = app;