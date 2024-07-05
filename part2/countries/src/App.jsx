import { useEffect, useState } from "react";
import countryService from "./services/countries";
import Countries from "./components/Countries";

function App() {
const [countries, setCountries] = useState([]);
const [filter, setFilter] = useState("");


useEffect(() => {
  countryService.getAll().then((initialCountries) => {
    setCountries(initialCountries);
  })
  .catch((error) => {
    console.log("Error", error);
  })
}, [])

if(!countries) {
  return null;
}

const handleFilterChange = (event) => {
  setFilter(event.target.value);
}

  return (
    <>
      <form>
        <div>
          Find Countries <input value={filter} onChange={handleFilterChange} />
        </div>
      </form>
      <Countries countries={countries} filter={filter} />
    </>
  );
}

export default App;
