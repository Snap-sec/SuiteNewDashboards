

function useHandleFilterChange(setFilters) {

    const handleFilterChange = (key) => (checked, value) => {

        console.log(key, checked, value);

        setFilters?.(prev => {
            if (checked || (value?.length > 0)) {
                return { ...prev, [key]: value?.join(",") };
            } else {
                const { [key]: _, ...rest } = prev;
                return rest;
            }
        });
    };

    return { handleFilterChange }
}


export default useHandleFilterChange;