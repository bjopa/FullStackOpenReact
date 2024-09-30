const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://bjopa:${password}@fullstacknotes.gyjpl.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=FullstackNotes`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const newNote = new Note({
  content: "This is the mongo.js note",
  important: true,
});

newNote.save().then((result) => {
  console.log("note saved!");
  //mongoose.connection.close();
});

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
