const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li>
      {note.content}{" "}
      <button style={{width: 150}} onClick={toggleImportance}>{label}</button></li>
  );
};

export default Note;
