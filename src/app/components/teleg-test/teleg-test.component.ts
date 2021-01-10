import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/service/auth.service';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Component({
  selector: 'app-teleg-test',
  templateUrl: './teleg-test.component.html',
  styleUrls: ['./teleg-test.component.scss']
})
export class TelegTestComponent implements OnInit {
  @ViewChild('scrollChat', { static: false }) scrollChat: any;

  dialogs = this.telegAPIservice.dialogs;
  image: any;
  access_hash = "5938841401524493444" // test

  public phone_number: string = '+79643436010';
  public phone_code = '';

  public selectedDialog: any;

  public messages: any = [{ message: 'dwdw', out: true }];


  private _load: boolean = false;

  constructor(
    public telegAPIservice: TelegramAPIService,
    public authService: AuthService,
    public http: HttpClient,
    private _changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.telegAPIservice.updateMessage.subscribe((next: any) => {
      if (next !== 0) {
        console.log(next)
        next.forEach((a: any) => {
          this.messages.unshift(a);
        });
        const scrollHeight = this.scrollChat.directiveRef.elementRef.nativeElement.scrollHeight;
        this._changeDetection.detectChanges();
        this.scrollChat.directiveRef.elementRef.nativeElement.scrollTop += this.scrollChat.directiveRef.elementRef.nativeElement.scrollHeight - scrollHeight;
        this._load = false;
        if (next.length !== 0 && this.scrollChat.directiveRef.elementRef.nativeElement.scrollTop === 0) {
          this.telegAPIservice.getHistory(this.selectedDialog.peer, this.messages.length);
        }
      }
    })
  }

  public getContacts(): void {
    this.telegAPIservice.getContacts();
  }

  public selectDialog(event: any): void {
    console.log('select dialog');
    this._load = true;
    this.messages = [];
    this._changeDetection.detectChanges();
    this.selectedDialog = event;
    this.telegAPIservice.getHistory(event.peer);
  }

  public sendMessage(event: any): void {
    switch (event.keyCode) {
      case 13: {
        //console.log(event);
        //console.log(event.target.value)
        this.telegAPIservice.sendMessage(this.selectedDialog.peer, event.target.value);
        //event.target.value = "";
        break;
      }
    }
  }

  public scrollUp(event: any): void {
    console.log('scroll');
    if (event.target.scrollTop < 500 && !this._load) {
      this._load = true;
      this.telegAPIservice.getHistory(this.selectedDialog.peer, this.messages.length);
    }
  }
}
