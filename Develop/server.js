const express = require('express');
const path = require("path");
const note = require('./db/db.json');
const fs = require('fs');

const uuid = require('../helpers/uuid');



const app = express();

const PORT = 3001;

//host static files
app.use(express.static("public"));

app.use(express.json());


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// make notes.html show when button is clicked
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//make stylesheet work properly



// read the db.json file
app.get ('/api/notes', (req, res) => 
    res.json(note)
),

//appends a new not to db.json
app.post ('/api/notes', (req, res) => {

const { title, text} = req.body;

if (title && text ) {
    // Variable for the Note object to be saved
    const newNote = {
      title,
      text,
      review_id: uuid(),
    };

    const noteString = JSON.stringify(newNote);

    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.title} has been written to JSON file`
          )
    );

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }


})

//make notes save to side menu when complete

//Listening for requests
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
