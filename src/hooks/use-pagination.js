import { useState } from 'react';

const usePagination = (pageSize = 10) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    return {
        pagination,
        setPagination
    }
}

export default usePagination; 