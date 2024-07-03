const Persons = ({ persons, filter, deletePerson }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          <button
            style={{ width: 60, background: "red", color: "yellow" }}
            onClick={() => deletePerson(person.id, person.name)}
          >
            delete
          </button>
          {" "}{person.name} {person.number}
        </div>
      ))}
    </div>
  );
};

export default Persons;
