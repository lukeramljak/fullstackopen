import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState({ content: null, type: null });

  useEffect(() => {
    personService.getAll().then((res) => setPersons(res));
  }, []);

  const showMessage = (messageObject) => {
    setMessage(messageObject);
    setTimeout(() => {
      setMessage({ content: null, type: null });
    }, 5000);
  };

  const handleFilter = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleNameInput = (e) => setNewName(e.target.value);
  const handleNumberInput = (e) => setNewNumber(e.target.value);

  const filteredPersons = searchQuery
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchQuery)
      )
    : persons;

  const updatePerson = (person) => {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      personService
        .update(person.id, { ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          );
        })
        .catch(() => {
          showMessage({
            content: `${person.name} has already been removed from server`,
            type: "error",
          });
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      updatePerson(existingPerson);
      return;
    }

    const personObject = {
      id: String(persons.length + 1),
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((res) => {
      setPersons(persons.concat(res));
      showMessage({ content: `Added ${res.name}`, type: "success" });
    });
  };

  const onDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        showMessage({ content: `Deleted ${name}`, type: "success" });
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.content} type={message.type} />
      <Filter handleFilter={handleFilter} />
      <h2>add a new</h2>
      <h2>Numbers</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
      />
      <Persons persons={filteredPersons} onDelete={onDelete} />
    </div>
  );
};

export default App;
