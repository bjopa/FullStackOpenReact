const Filter = ({ filter, onChangeFilter }) => {
    return (
        <div>
            Filter: <input value={filter} onChange={onChangeFilter}></input>
        </div>
    )
}

export default Filter;