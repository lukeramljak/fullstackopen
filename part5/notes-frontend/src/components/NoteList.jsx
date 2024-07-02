import Note from "./Note";

const NoteList = ({ notes, toggleImportanceOf }) => {
  return (
    <ul>
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
        />
      ))}
    </ul>
  );
};

export default NoteList;
