const CountryFilter = ({ filterText, filterCallback }) => {
  return (
    <form>
      <div>
        Find Countries <input value={filterText} onChange={filterCallback} />
      </div>
    </form>
  );
};

export default CountryFilter;
