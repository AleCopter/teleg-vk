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

  //private _load: boolean = false;

  public isEnd: boolean = false;

  private _lastScrollTop: any;

  constructor(
    public chatService: ChatService,
    public telegAPIservice: TelegramAPIService,
    private _changeDetection: ChangeDetectorRef
  ) {
    this.chatService.updateMessage.subscribe((data: { mess: Array<any>, users: Array<any>, init: boolean }) => {
      if (!data.init) {

        console.log(data);

        this._setUsers(data.users);


        this._lastScrollTop = this.scrollChat.nativeElement.scrollTop;
        if (data.mess.length === 0) {
          this.isEnd = true;
          this.chatService.load = false;
        } else {
          this.isEnd = false;

          data.mess = data.mess.reverse();
          let firstDate = data.mess[0].date;
          let firstId = data.mess[0].from_id ? data.mess[0].from_id.user_id :  data.mess[0].peer_id.user_id
          data.mess.forEach((m: any, index: number) => {
            let currentId = m.from_id ? m.from_id.user_id : m.peer_id.user_id
            if (index === 0) {
              m.first = true;
            } else if ((( m.date - firstDate) < 300) && (firstId === currentId)) {
              m.first = false;
            } else {
              m.first = true;
              firstDate = m.date;
              firstId = currentId;
            }
          });
          data.mess = data.mess.reverse();
          

          data.mess.forEach((m: any) => {
            this.chatService.messages.unshift(m);
          });

          //console.log(this.chatService.messages)

          const scrollHeight = this.scrollChat.nativeElement.scrollHeight;
          this._changeDetection.detectChanges();

          const scrollTop = this.scrollChat.nativeElement.scrollTop + this.scrollChat.nativeElement.scrollHeight - scrollHeight - this.spaceEl.nativeElement.clientHeight;
          this.scrollChat.nativeElement.scrollTop += this.scrollChat.nativeElement.scrollHeight - scrollHeight;

          if (data.mess.length !== 0 && scrollTop < 0) {
            this.telegAPIservice.getHistory(this.chatService.selectedDialog.peer, this.chatService.messages.length);
          } else {
            this.chatService.load = false;
          }

        }

      }
    })
  }

  ngOnInit(): void {
  }

  private _setUsers(users: Array<any>): void {
    users.forEach((user: any, index: number) => {
      let a = this.chatService.users.find((u: any) => u.id === user.id)
      if (a === undefined) {
        this.chatService.users.push(
          {
            id: user.id,
            name: user.first_name,
            image: user.photo ? this.telegAPIservice.getImage(this.chatService.users, index, user.id, user.access_hash, user.photo.photo_small.local_id, user.photo.photo_small.volume_id) : '',
          }
        )
      }
      //console.log(user);
    })
    //console.log(this.chatService.users);
  }

  public scrollUp(event: any): void {

    let st = event.target.scrollTop;
    if (st < this._lastScrollTop) {
      if (event.target.scrollTop <= this.spaceEl.nativeElement.clientHeight && !this.chatService.load && !this.isEnd) {
        console.log('scroll')
        this.chatService.load = true;
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

  public getUser(m: any): { image: any, name: string } {
    //console.log(m)
    const USER = this.chatService.users.find((user: any) => user.id === m.from_id?.user_id)
    return USER !== undefined ? USER : this.chatService.users.find((user: any) => user.id === m.peer_id?.user_id);
  }

  public sendMessage(event: any): void { };


}


