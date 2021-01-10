import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VkAPIService {

    private _API_ROOT = 'https://api.vk.com/method/';
    private _PROXY_URL = 'https://cors.puvel.ru/';

    access_token = localStorage.getItem('VK_TOKEN');

    constructor(
        private http: HttpClient
    ) { 
        this.getConversations().subscribe(
            (data: any) => {
                console.log(data);
            }
        )
    }


    public getProfileInfo(): Observable<any> {
        const url = `${this._API_ROOT}account.getProfileInfo?v=5.126&access_token=${this.access_token}&`;
        return this.http.jsonp(url, 'callback');
    }

    public getConversations(): Observable<any> {
        return this._proxyRequest('messages.getConversations', '');
    }

    public _proxyRequest(method: string, params: string): Observable<any> {
        const url = `${this._PROXY_URL}${this._API_ROOT}${method}?v=5.126&access_token=${this.access_token}&${params}`;
        return this.http.get(url);
      }
}