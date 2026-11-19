import FilterButton from "../../../../../VM/pages/vulnerabilities/components/filter-button";
// import useStore from "../store";


function TableToolbar({ supportedFilters }) {

    // const setFilters = useStore((state) => state.setFilters);

    // const severityFilters = supportedFilters?.severity?.map(severity => ({ id: severity, label: severity, value: severity })) || [];
    // const assessmentFilters = supportedFilters?.assessments?.map(filter => ({ id: filter.id, label: filter.title, value: filter.title })) || [];
    // const ownerFilters = supportedFilters?.assignee?.map(owner => ({ id: owner, label: owner, value: owner })) || [];
    // const stateFilters = supportedFilters?.state?.map(owner => ({ id: owner, label: owner, value: owner })) || [];

    // const handleFilterChange = (key) => (checked, value) => {
    //     if (checked) setFilters(prev => ({ ...prev, [key]: value.value }));
    //     else setFilters(prev => Object.keys(prev).filter(k => k != key).reduce((f, k) => ({ ...f, [k]: prev[k] }), {}));
    // }


    return (
        <div className="flex gap-2 items-center">
            <FilterButton title="Severity" onChange={()=> console.log('xx')} />
            {/* <FilterButton title="Assessments" filters={assessmentFilters} onChange={handleFilterChange("assessmentTitle")} />
            <FilterButton title="Owners" filters={ownerFilters} onChange={handleFilterChange("assignee")} />
            <FilterButton title="State" filters={stateFilters} onChange={handleFilterChange("state")} /> */}
        </div>
    )
}


export default TableToolbar;