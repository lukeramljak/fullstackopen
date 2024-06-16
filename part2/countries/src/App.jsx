import { useEffect, useState } from "react";
import Country from "./components/Country";
import CountryList from "./components/CountryList";
import Search from "./components/Search";
import Weather from "./components/Weather";
import countriesService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);

  useEffect(() => {
    countriesService.getAll().then((response) => {
      setCountries(response);
    });
  }, []);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCurrentCountry(filteredCountries[0]);
    } else {
      setCurrentCountry(null);
    }
  }, [filteredCountries]);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setFilteredCountries([]);
    } else {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleCountrySelect = (country) => {
    setCurrentCountry(country);
  };

  return (
    <div>
      <Search handleSearch={handleSearch} />
      <CountryList
        countries={filteredCountries}
        handleSelect={handleCountrySelect}
      />
      {currentCountry && (
        <>
          <Country country={currentCountry} />
          <Weather country={currentCountry} />
        </>
      )}
    </div>
  );
};

export default App;
