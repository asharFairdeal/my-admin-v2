// src/services/RiderStore.ts
"use client";
import apiService from "./apiService";
import apiUrls from "./apiUrls";


class RiderStoreClass {
    async getList(queryParams: any) {
        const response:any = await apiService.get(apiUrls.riderUrl ,  queryParams, true);
        return  {
            data: response.data.data, // data should be an array
            total: response.data.total || response.headers['x-total-count'] || 0 
        };
    }

    // async getAllActiveRidersNearWarehouse(queryParams: any) {
    //     const response:any = await apiService.get(apiUrls.riderUrl + '/active-riders-near-warehouse',  queryParams, true);
    //     return  {
    //         data: response.data.data,
    //         total: response.data.total || response.headers['x-total-count'] || 0 
    //     };
    // }

    async getRider(id: string) {
        return apiService.get(`/riders/${id}`);
    }

    async createRider(data: any) {
        return apiService.post('/riders', data);
    }

    async updateRider(id: string, data: any) {
        return apiService.put(`/riders/${id}`, data);
    }

    async deleteRider(id: string) {
        return apiService.delete(`/riders/${id}`);
    }
}

export const RiderStore = new RiderStoreClass();
