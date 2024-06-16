const CountryList = ({ countries, handleSelect }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length <= 1) {
    return null;
  }

  return countries.map((country) => (
    <div key={country.name.common}>
      <span>{country.name.common}</span>
      <button onClick={() => handleSelect(country)}>show</button>
    </div>
  ));
};

export default CountryList;
