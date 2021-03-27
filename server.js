const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const database = require("./db/db");

var PORT = process.env.PORT || 3000;

// Link to my assets!
app.use(express.static("public"));

//Parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Start API Endpoints.

app
  .route("/api/notes")

  .get(function (req, res) {
    res.json(database);
  })

  .post(function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;

    let highestId = 99;

    for (let i = 0; i < database.length; i++) {
      let individualNote = database[i];

      if (individualNote.id > highestId) {
        highestId = individualNote.id;
      }
    }
  });
