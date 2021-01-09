import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Component({
  selector: 'app-teleg-test',
  templateUrl: './teleg-test.component.html',
  styleUrls: ['./teleg-test.component.scss']
})
export class TelegTestComponent implements OnInit {
  dialogs = this.telegAPIservice.dialogs;
  image: any;
  access_hash = "5938841401524493444" // test

  public phone_number: string = '+79643436010';
  private _phone_hash = null;
  public phone_code = '';
  
  public selectedDialog: any;

  constructor(
    public telegAPIservice: TelegramAPIService,
    public http: HttpClient) { }

  ngOnInit(): void {
  }

  public sendCode(): void {
    this.telegAPIservice.sendCode(this.phone_number);
  }

  public authIn(): void {
    this.telegAPIservice.authIn(this.phone_code, this.phone_number);
  }

  public getContacts(): void {
    this.telegAPIservice.getContacts();
  }

  public selectDialog(event: any): void {
    console.log(event);
    this.selectedDialog = event;
    this.telegAPIservice.getHistory(event.peer);
  }

  public sendMessage(event: any): void {
    switch(event.keyCode) {
      case 13: {
        console.log(event);
        console.log(event.target.value)
        this.telegAPIservice.sendMessage(this.selectedDialog.peer, event.target.value);
        //event.target.value = "";
        break;
      }
    }
  
  }
}
