const Countries = ({ countries, filter }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  console.log("FC", filteredCountries);

  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches ({filteredCountries.length}). Please specify another
        filter.
      </div>
    );
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    const languages = Object.values(country.languages);
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <div>
          <h3>Languages:</h3>
          <ul>
            {languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        </div>
        <img src={country.flags.png} alt={country.flags.alt}></img>
      </div>
    );
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <>
          <div key={country.name.common}>
            {country.name.common} {" "} <button>Show</button>
          </div>
        </>
      ))}
    </div>
  );
};

export default Countries;
