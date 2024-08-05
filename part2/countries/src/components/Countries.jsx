import Country from "./Country";

const Countries = ({ countries, filterText, handleCountryClick }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches ({filteredCountries.length}). Please specify another
        filter.
      </div>
    );
  }

  if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return (
      <div>
        {filteredCountries.map((country) => (
          <div key={country.name.official}>
            {country.name.common}{" "}
            <button onClick={() => handleCountryClick(country.name.common)}>
              Show
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  }
};

export default Countries;
