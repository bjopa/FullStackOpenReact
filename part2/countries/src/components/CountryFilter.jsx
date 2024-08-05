const CountryFilter = ({ filterText, handleFilterChange }) => {
  return (
    <form>
      <div>
        Find Countries <input value={filterText} onChange={handleFilterChange} />
      </div>
    </form>
  );
};

export default CountryFilter;
