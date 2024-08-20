import axios from 'axios';
import fetch from 'node-fetch';

export interface HttpClient {
    post(url: string, data: any): Promise<any>;
    get(url: string): Promise<any>;
}

export class AxiosAdapter implements HttpClient {

    async post(url: string, data: any): Promise<any> {
        const response = await axios.post(url, data);
        return response.data;
    }

    async get(url: string): Promise<any> {
        const response = await axios.get(url);
        return response.data;
    }

}

export class FetchAdapter implements HttpClient {
    
    async post(url: string, data:any): Promise<any> {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    }

    async get(url: string): Promise<any> {
        const response = await fetch(url)
        return await response.json();
    }

}