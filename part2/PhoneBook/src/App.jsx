import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Björn Palm", number: "011-182482", id: 1 },
    { name: "Kalle Anka", number: "39-44-5323523", id: 2 },
    { name: "Jürgen Klopp", number: "12-43-234345", id: 3 },
    { name: "Franz Ferdinand", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("Palm");

  const addName = (event) => {
    event.preventDefault();

    const isInArray = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const fixedNewName = capitalizeFirstLetter(newName);

    if (!isInArray) {
      setPersons(persons.concat({ name: fixedNewName, number: newNumber }));
      setNewName("");
      setNewNumber("");
    } else {
      alert(`${fixedNewName} is already added to phonebook`);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <div className="debug" style={{ background: "red", color: "whitesmoke" }}>
        <div>debugName: {newName}</div>
        <div>debugNumber: {newNumber}</div>
        <div>debugFilter: {filter}</div>
      </div>

      <h2>Phonebook</h2>
      <Filter filter={filter} onChangeFilter={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
