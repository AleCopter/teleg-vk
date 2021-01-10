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

  public login(username: string, password: string): Observable<any> {
    const url = `${this._PROXY_URL}${this._getAuthLink(username, password)}`;
    return this.http.get(url);
  }

  public openAuthTab(username: string, password: string): void {
    const win = window.open(this._getAuthLink(username, password), '_blank');
    if (win) {
      win.focus(); // Browser has allowed it to be opened
    } else {
      alert('Please allow popups for this website'); // Browser has blocked it
    }
  }

  private _getAuthLink(username: string, password: string): string {
    return `https://oauth.vk.com/token?grant_type=password&client_id=2274003&scope=offline,messages&client_secret=hHbZxrka2uZ6jB1inYsH&username=${username}&password=${password}`;
  }

  public getProfileInfo(): Observable<any> {
    return this._apiRequest('account.getProfileInfo');
  }

  public getConversations(page: number = 0, count: number = 50): Observable<any> {
    return this._apiRequest('messages.getConversations', `extended=1&offset=${page * count}&count=${count}`);
  }

  public getMessagesFirst(peer_id: string): Observable<any> {
    return this.getMessages(peer_id); // return first N messages from dialog
  }

  public getMessagesContinue(peer_id: string, start_message_id: number, page: number = 0): Observable<any> {
    return this.getMessages(peer_id, start_message_id, page, true); // return next N messages from dialog after message_id, pageable
  }

  public getMessages(peer_id: string,
                     start_message_id: number = 0, page: number = 0, shift: boolean = false, count: number = 50): Observable<any> {
    // shift = skip message with start_message_id (dont return itself)
    const offset = page * count + (shift ? 1 : 0);
    const smi = start_message_id !== 0 ? ('&start_message_id=' + start_message_id) : '';
    return this._apiRequest('messages.getHistory',
      `extended=1&peer_id=${peer_id}&offset=${offset}&count=${count}${smi}`);
  }

  private _apiRequest(method: string, params: string = ''): Observable<any> {
    const url = `${this.proxy ? this._PROXY_URL : ''}${this._API_ROOT}${method}?v=5.126&access_token=${this.access_token}&${params}`;
    return this.http.jsonp(url, 'callback');
  }
}
