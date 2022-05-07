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
        id: uuid(),
      };
   note.push(newNote);
      }
  // Return the new note
  fs.writeFile("./db/db.json", JSON.stringify(note, null, 4), function () {
    res.json(note);
  });
});

///////////////////////////////////////////////////////////////////////////////
//view previous notes when selected by using the id as a query parameter

app.get('/api/notes', (req, res) => res.json(note));

// GET route that returns any specific note
app.get('/api/notes/:id', (req, res) => {
  // Change the search id to lowercase
  const requestedTerm = req.params.note.toLowerCase();
  // Iterate through the note ids to check if it matches any exsisting ids
  for (let i = 0; i < note.length; i++) {
    if (requestedTerm === note[i].id.toLowerCase()) {
      return res.json(note[i]);
    }
  }
  // Return a message if the note doesn't exist in our DB
  return res.json('No match found');
});


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