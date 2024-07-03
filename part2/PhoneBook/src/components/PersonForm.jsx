const PersonForm = ({addName, newName, newNumber, onChangeName, onChangeNumber}) => {
  return (
    <form onSubmit={addName}>
      <div>
        Name: <input value={newName} onChange={onChangeName} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
