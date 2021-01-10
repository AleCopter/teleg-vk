import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class VkAPIService {

  private _API_ROOT = 'https://api.vk.com/method/';
  private _PROXY_URL = 'https://cors.puvel.ru/';

  proxy = false;
  access_token = localStorage.getItem('VK_TOKEN');

  constructor(
    private http: HttpClient
  ) {
    this.getConversations().subscribe(
      (data: any) => {
        console.log(data);
      }
    );
  }

  public getProfileInfo(): Observable<any> {
    return this._apiRequest('account.getProfileInfo');
  }

  public getConversations(offset: number = 0, count: number = 20): Observable<any> {
    return this._apiRequest('messages.getConversations', `extended=1&offset=${offset}&count=${count}`);
  }

  public getMessages(peer_id: string, offset: number = 0, count: number = 20): Observable<any> {
    return this._apiRequest('messages.getHistory', `extended=1&peer_id=${peer_id}&offset=${offset}&count=${count}`);
  }

  public _apiRequest(method: string, params: string = ''): Observable<any> {
    const url = `${this.proxy ? this._PROXY_URL : ''}${this._API_ROOT}${method}?v=5.126&access_token=${this.access_token}&${params}`;
    return this.http.jsonp(url, 'callback');
  }
}
