import Forecast from "./Forecast";

const Country = ({ country }) => {
  const languages = Object.values(country.languages);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <div>
        <h3>Languages:</h3>
        <ul>
          {languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </div>
      <img src={country.flags.png} alt={country.flags.alt}></img>
      <Forecast country={country} />
    </div>
  );
};

export default Country;
