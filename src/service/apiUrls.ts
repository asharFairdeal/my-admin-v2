import { environment } from '../environment';
export class APIUrls {
    readonly socketUrl = environment.socketUrl;
    readonly baseUrl = environment.apiUrl;
    readonly adminUrl = environment.apiUrl + 'admin/';
    readonly webhookWhatsappUrl = environment.apiUrl + 'webhook_endpoint/';

    // Define other URLs similarly
    readonly authUrl = this.baseUrl + 'auth/admin/';
    readonly categoryUrl = this.adminUrl + 'categories/';
    readonly customerUrl = this.adminUrl + 'customer/';
    readonly productsUrl = this.adminUrl + 'products/';
    readonly notificationUrl = this.adminUrl + 'notifications/';
    readonly ordersUrl = this.adminUrl + 'orders/';
    readonly invoicesUrl = this.adminUrl + 'invoices/';
    readonly appCustomizationUrl = this.adminUrl + 'app-customization/';
    readonly salesmanUrl = this.adminUrl + 'salesman/';
    readonly riderUrl = this.adminUrl + 'rider';
    readonly pickerUrl = this.adminUrl + 'picker';
    readonly picklistUrl = this.adminUrl + 'picklist';
}

const apiUrls = new APIUrls();
export default apiUrls;
