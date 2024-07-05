import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import { useEffect } from "react";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [noteAlertMessage, setNoteAlertMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialpersons) => {
      setPersons(initialpersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
    const fixedNewName = capitalizeFirstLetter(newName);

    if (!existingPerson) {
      const newPersonObject = {
        name: fixedNewName,
        number: newNumber,
      };

      personService.create(newPersonObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNoteAlertMessage(`Added '${newName}'`);
        setNewName("");
        setNewNumber("");
        setTimeout(() => {
          setNoteAlertMessage(null);
        }, 5000);
      });
    } else {
      if (window.confirm(`update '${fixedNewName}'?`)) {
        const updatePersonObject = { ...existingPerson, number: newNumber };
        personService
          .update(updatePersonObject.id, updatePersonObject)
          .then((returnedPerson) => {
            setNoteAlertMessage(`Updated '${returnedPerson.name}'`);
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            setTimeout(() => {
              setNoteAlertMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setNoteAlertMessage(`Information of '${fixedNewName}' has already been removed from server`)
          });
      }
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) {
      personService.deletePost(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setNoteAlertMessage(`Deleted '${name}'`);
        setTimeout(() => {
          setNoteAlertMessage(null);
        }, 5000);
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
      <div className="debug">
        <div>debugName: {newName}</div>
        <div>debugNumber: {newNumber}</div>
        <div>debugFilter: {filter}</div>
      </div>

      <h2>Phonebook</h2>
      <Notification message={noteAlertMessage} />
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
