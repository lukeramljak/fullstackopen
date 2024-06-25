const Note = require("../models/note");
const User = require("../models/user");

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
    userId: "667aa7cc621c5664b90201f8",
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
    userId: "667aa7cc621c5664b90201f8",
  },
];

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
