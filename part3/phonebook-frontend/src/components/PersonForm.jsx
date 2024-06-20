const PersonForm = ({ handleSubmit, handleNameInput, handleNumberInput }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameInput} />
      </div>
      <div>
        number: <input onChange={handleNumberInput} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
