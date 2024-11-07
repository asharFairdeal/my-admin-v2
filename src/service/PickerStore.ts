// src/services/RiderStore.ts
"use client";
import apiService from "./apiService";
import apiUrls from "./apiUrls";


class PickerStoreClass {
    async getList(queryParams: any) {
        const response:any = await apiService.get(apiUrls.pickerUrl + '/get-all-picker' ,  queryParams, true);
        return  {
            data: response.data.data, // data should be an array
            total: response.data.total || response.headers['x-total-count'] || 0 
        };
    }
    async get(id: string) {
        return apiService.get(`/riders/${id}`);
    }

    async updateStatus(data : any) {
        return apiService.put(apiUrls.pickerUrl + '/update-picker-status' , data)
    }

    async updateAvailable(data : any) {
        return apiService.put(apiUrls.pickerUrl + '/update-picker-available' , data)
    }

    async updateApproved(data : any) {
        return apiService.put(apiUrls.pickerUrl + '/update-picker-approved' , data)
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

export const PickerStore = new PickerStoreClass();
