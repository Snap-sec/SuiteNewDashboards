import FilterButton from "./filter-button";


function FilterToolbar({ filters = [], onChange }) {


    return (
        <div>
            {
                filters.map(filter => {
                    return <FilterButton filters={filter} />
                })
            }
        </div>
    )
}


export default FilterToolbar;