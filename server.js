const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
// var util = require("util");
// const database = require("./db/db");

const PORT = process.env.PORT || 3000;

// Link to my assets!
app.use(express.static(path.join(__dirname, "./public")));

//Parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// require("./routes/routes")(app);

//Routes
const util = require("util");
const writefileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let allNotes;

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function (req, res) {
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (
    data
  ) {
    return res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (
    data
  ) {
    allNotes = JSON.parse(data);
    if (newNote.id || newNote.id === 0) {
      let currNote = allNotes[newNote.id];
      currNote.title = newNote.title;
      currNote.text = newNote.text;
    } else {
      allNotes.push(newNote);
    }
    writefileAsync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(allNotes)
    ).then(function () {
      console.log("Wrote db.json");
    });
  });
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  var id = req.params.id;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8").then(function (
    data
  ) {
    allNotes = JSON.parse(data);
    allNotes.splice(id, 1);
    writefileAsync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(allNotes)
    ).then(function () {
      console.log("Deleted db.json");
    });
  });
  res.json(id);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
