import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import { useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialpersons) => {
      setPersons(initialpersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const isInArray = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const fixedNewName = capitalizeFirstLetter(newName);

    if (!isInArray) {
      const newPersonObject = {
        name: fixedNewName,
        number: newNumber,
      };

      personService.create(newPersonObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    } else {
      alert(`${fixedNewName} is already added to phonebook`);
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) {
      personService.deletePost(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
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
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
