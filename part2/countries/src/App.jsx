import { useEffect, useState } from "react";
import countryService from "./services/countries";
import Countries from "./components/Countries";
import CountryFilter from "./components/CountryFilter";

function App() {
  const [countries, setCountries] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    countryService
      .getAll()
      .then((initialCountries) => {
        setCountries(initialCountries);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  if (!countries) {
    return null;
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleCountryClick = (countryName) => {
    setFilterText(countryName)
  }

  return (
    <>
      <CountryFilter
        filterText={filterText}
        handleFilterChange={handleFilterChange}
      />
      <Countries
        countries={countries}
        filterText={filterText}
        handleCountryClick={handleCountryClick}
      />
    </>
  );
}

export default App;
