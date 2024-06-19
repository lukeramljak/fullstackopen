import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleFilter = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleNameInput = (e) => setNewName(e.target.value);
  const handleNumberInput = (e) => setNewNumber(e.target.value);

  const filteredPersons = searchQuery
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchQuery)
      )
    : persons;

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameExists = persons.find((person) => person.name === newName);
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(personObject));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />
      <h2>add a new</h2>
      <h2>Numbers</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
      />
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
