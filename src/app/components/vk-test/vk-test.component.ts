import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

import { Injectable } from '@angular/core';
// Import HttpClient class
import { HttpClient } from '@angular/common/http';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-vk-test',
  templateUrl: './vk-test.component.html',
  styleUrls: ['./vk-test.component.scss']
})
export class VkTestComponent implements OnInit {
  private API_ROOT = 'https://api.vk.com/method/';
  private PROXY_URL = 'https://cors.puvel.ru/';

  access_token = localStorage.getItem('VK_TOKEN');
  dialogs: any;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.getConversations();
  }

  public test(): void {
    this.getConversations().subscribe((data: any) => {
      const peer_id = data.response.items[0].conversation.peer.id;
      this.getMessages(peer_id).subscribe((data: any) => {
        this.dialogs = data.response;
      });
    });
  }

  public getMessages(peer_id: string): Observable<any> {
    return this.proxyRequest('messages.getHistory', `peer_id=${peer_id}`);
  }

  public getConversations(): Observable<any> {
    return this.proxyRequest('messages.getConversations', '');
  }

  public requestAsync(method: string, params: string): Observable<any> {
    const url = `${this.API_ROOT}${method}?v=5.126&access_token=${this.access_token}&${params}`;
    return this.http.jsonp(url, 'callback');
  }

  public proxyRequest(method: string, params: string): Observable<any> {
    const url = `${this.PROXY_URL}${this.API_ROOT}${method}?v=5.126&access_token=${this.access_token}&${params}`;
    return this.http.get(url);
  }

  public username = '';
  public password = '';

  public login(): void {
    this.auth(this.username, this.password);
  }

  public auth(username: string, password: string): void {
    const url = `${this.PROXY_URL}https://oauth.vk.com/token?grant_type=password&client_id=2274003&scope=offline,messages&client_secret=hHbZxrka2uZ6jB1inYsH&username=${username}&password=${password}`;
    this.http.get(url).subscribe((data: any) => {
      this.access_token = data.access_token;
      localStorage.setItem('VK_TOKEN', this.access_token);
    });
  }

  // public request(method: string, params: string): any {
  //   const asyncRequest = this.requestAsync(method, params);
  //   let data: any;
  //   asyncRequest
  //     .pipe(take(1))
  //     .subscribe((d: any) => {
  //     console.log(`method: ${method}, response:`);
  //     console.log(d);
  //     data = d.response;
  //   });
  //   return data;
  //   // return await asyncRequest.toPromise();
  // }

}
