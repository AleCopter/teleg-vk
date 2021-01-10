import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TelegramAPIService } from './telegram-api.service';
import { VkAPIService } from './vk-api.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public status = {
    vk: {
      status: false,
      name: 'Требуется авторизация',
    },
    telegram: {
      status: true,
      name: 'Ctrayc',
    }
  }
  public isSend: boolean = false;
  private _teleg_phone_hash: string = '';
  private _teleg_phone_number: string = '';

  public updateAuth = new BehaviorSubject({
    media: -1,
    step: -1,
    err: null
  });

  constructor(
    public telegAPIservice: TelegramAPIService,
    public vkAPIService: VkAPIService,
    private http: HttpClient
  ) {
    console.log('auth');
    console.log(localStorage.getItem('VK_TOKEN'));

    this.vkAPIService.getProfileInfo().subscribe(
      (result: any) => {
        console.log(result)
        this.status.vk.name = result.response.first_name + ' ' + result.response.last_name;
        this.status.vk.status = true;
      }
    )
    this._getProfile();
  }


  private _getProfile(): void {
    this.telegAPIservice.getUser().then((result: any) => {
      this.status.telegram.status = true;
      this.status.telegram.name = result.user.first_name
      console.log(result);
    }).catch((err: any) => {
      this.status.telegram.status = false;
      this.status.telegram.name = 'Требуется авторизация';
      console.log(err);
    });
  }

  public telegGetCode(number: string): void {
    this.telegAPIservice.sendCode(number).then((result: any) => {
      this._teleg_phone_hash = result.phone_code_hash;
      this._teleg_phone_number = number;
      this.updateAuth.next({
        media: 1,
        step: 1,
        err: null
      })
    }).catch((err: any) => {
      console.log(err);
      this.updateAuth.next({
        media: 1,
        step: 0,
        err: err
      })
    });
  }

  public telegLogin(_code: number): void {
    this.telegAPIservice.login(_code, this._teleg_phone_number, this._teleg_phone_hash).then((result: any) => {
      this._getProfile();
      this.updateAuth.next({
        media: -1,
        step: -1,
        err: null
      })
      console.log(result);
    }).catch((err: any) => {
      console.log(err);
      this.updateAuth.next({
        media: 1,
        step: 1,
        err: err
      })
    });;
  }

  public telegLogout(): void {
    this.telegAPIservice.logout().then((result: any) => {
      this._getProfile();
      this.updateAuth.next({
        media: -1,
        step: -1,
        err: null
      })
      console.log(result);
    }).catch((err: any) => {
      this.updateAuth.next({
        media: -1,
        step: -1,
        err: err
      })
    });;
  }

  // -------------------- VK ------------------------

  private _API_ROOT = 'https://api.vk.com/method/';
  private _PROXY_URL = 'https://cors.puvel.ru/';
  access_token = '';

  public auth(username: string, password: string): void {
    const url = `${this._PROXY_URL}${this.getAuthLink(username, password)}`;
    this.http.get(url).subscribe((data: any) => {
      this.access_token = data.access_token;
      localStorage.setItem('VK_TOKEN', data.access_token);
    });
  }

  public openAuthTab(username: string, password: string): void {
    const win = window.open(this.getAuthLink(username, password), '_blank');
    if (win) {
      win.focus(); // Browser has allowed it to be opened
    } else {
      alert('Please allow popups for this website'); // Browser has blocked it
    }
  }

  public getAuthLink(username: string, password: string): string {
    return `https://oauth.vk.com/token?grant_type=password&client_id=2274003&scope=offline,messages&client_secret=hHbZxrka2uZ6jB1inYsH&username=${username}&password=${password}`;
  }

  public parseToken(data: string): string|undefined {
    return data.split('"').find(x => x.length === 85);
  }

  public tryAPI(): Promise<any> {
    const url = `${this._API_ROOT}messages.getConversations?v=5.126`;
    const obs = this.http.jsonp(url, 'callback');
    // obs.toPromise().then(() => console.log(`true`)).catch(() => console.log(`false`));
    return obs.toPromise();
  }

}
