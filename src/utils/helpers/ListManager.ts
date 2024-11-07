// src/helpers/ListManager.ts
interface QueryParams {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    search?: string; // Optional search parameter
    [key: string]: any;
}

// src/utils/helpers/ListManager.ts
export class ListManager<T> {
    data: T[] = [];
    total: number = 0;
    query: QueryParams;
    store: { 
        getList: (queryParams: QueryParams) => Promise<{ data: T[], total: number }> 
    };

    constructor(store: { getList: (queryParams: QueryParams) => Promise<{ data: T[], total: number }> }) {
        this.store = store;
        this.query = {
            page: 1,
            limit: 15,
            sort: 'createdAt',
            order: 'desc',
        };
    }

    async fetchData(signal?: AbortSignal) {
        const response = await this.store.getList({ ...this.query, signal });
        this.data = response.data;
        this.total = response.total;
        return response; // Return response to include total for pagination
    }

    async setPage(page: number) {
        this.query.page = page;
        return this.fetchData(); // Fetch new data on page change
    }

    async setLimit(limit: number) {
        this.query.limit = limit;
        this.query.page = 1; // Reset to first page when limit changes
        return this.fetchData();
    }

    async setSort(sort: string, order: 'asc' | 'desc') {
        this.query.sort = sort;
        this.query.order = order;
    
        // Custom sorting logic for booleans
        if (sort === 'available') {
            this.data.sort((a: any, b: any) => {
                // Prioritize true over false if sorting is 'asc', reverse if 'desc'
                const comparison = a[sort] === b[sort] ? 0 : a[sort] ? -1 : 1;
                return order === 'asc' ? comparison : -comparison;
            });
            return { data: this.data, total: this.total }; // Return sorted data
        }
    
        // Default fetch and sort for non-boolean fields
        return this.fetchData();
    }
    

    async setFilter(filter: Record<string, any>) {
        Object.assign(this.query, filter);
        return this.fetchData(); // Fetch new data on filter change
    }

    async setSearch(search: string) {
        this.query.search = search || ''; // Reset to empty string if undefined
        this.query.page = 1; // Reset to first page on search
        return this.fetchData(); // Fetch new data on search change
    }

    isFirstPage() {
        return this.query.page === 1;
    }

    isLastPage(total: number) {
        return this.query.page >= Math.ceil(total / this.query.limit);
    }

    async reset() {
        this.query.page = 1;
        this.query.search = '';
        // Reset other parameters as needed
        return this.fetchData(); // Refresh data
    }

    async refresh() {
        return this.fetchData();
    }
}


export default ListManager;
