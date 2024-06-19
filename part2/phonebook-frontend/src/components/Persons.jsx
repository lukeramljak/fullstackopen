const Persons = ({ persons, onDelete }) => {
  return persons.map((person) => (
    <div>
      <span key={person.id}>
        {person.name} {person.number}
      </span>
      <button onClick={() => onDelete(person.id, person.name)}>delete</button>
    </div>
  ));
};

export default Persons;
