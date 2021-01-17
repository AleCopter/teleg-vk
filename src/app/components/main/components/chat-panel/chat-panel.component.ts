import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';
import { ChatService } from '../../service/chat.service';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent implements OnInit {
  @ViewChild('scrollChat', { static: false }) scrollChat: any;
  @ViewChild('spaceEl', { static: false }) spaceEl: any;

  private _load: boolean = false;

  public isEnd: boolean = false;

  private _lastScrollTop: any;

  constructor(
    public chatService: ChatService,
    public telegAPIservice: TelegramAPIService,
    private _changeDetection: ChangeDetectorRef
  ) {
    this.chatService.updateMessage.subscribe((next: any) => {
      if (next !== 0) {
        //console.log(next)
        this._lastScrollTop = this.scrollChat.nativeElement.scrollTop;
        if (next.length === 0) {
          this.isEnd = true;
          this._load = false;
        } else {
          this.isEnd = false;
          next.forEach((a: any) => {
            this.chatService.messages.unshift(a);
          });

          const scrollHeight = this.scrollChat.nativeElement.scrollHeight;
          this._changeDetection.detectChanges();

          const scrollTop = this.scrollChat.nativeElement.scrollTop + this.scrollChat.nativeElement.scrollHeight - scrollHeight - this.spaceEl.nativeElement.clientHeight;
          this.scrollChat.nativeElement.scrollTop += this.scrollChat.nativeElement.scrollHeight - scrollHeight;

          this._load = false;
          if (next.length !== 0 && scrollTop < 0) {
            this.telegAPIservice.getHistory(this.chatService.selectedDialog.peer, this.chatService.messages.length);
          }
  
        }

      }
    })
  }

  ngOnInit(): void {
  }

  public scrollUp(event: any): void {
    let st = event.target.scrollTop;
    if (st < this._lastScrollTop) {
      if (event.target.scrollTop <= this.spaceEl.nativeElement.clientHeight && !this._load && !this.isEnd) {
        this._load = true;
        this.telegAPIservice.getHistory(this.chatService.selectedDialog.peer, this.chatService.messages.length);
      }
    }
    else {
    }
    this._lastScrollTop = st;
    /*
    if (event.target.scrollTop < 500 && !this._load && !this.isEnd) {
      this._load = true;
      this.telegAPIservice.getHistory(this.chatService.selectedDialog.peer, this.messages.length);
    }
    */
  }

  public sendMessage(event: any): void { };


}


