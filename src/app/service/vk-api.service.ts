import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VkAPIService {

    private _API_ROOT = 'https://api.vk.com/method/';
    access_token = localStorage.getItem('VK_TOKEN');

    constructor(
        private http: HttpClient
    ) { }


    public getProfileInfo(): Observable<any> {
        const url = `${this._API_ROOT}account.getProfileInfo?v=5.126&access_token=${this.access_token}&`;
        return this.http.jsonp(url, 'callback');
    }
}