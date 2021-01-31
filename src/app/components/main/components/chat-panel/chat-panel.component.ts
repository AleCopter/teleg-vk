import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';
import { ChatService } from '../../service/chat.service';
import { DialogService } from '../../service/dialog.service';
import { UserStorageService } from '../../service/user-storage.service';

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
  private _querySubscription!: Subscription;

  constructor(
    public chatService: ChatService,
    public dialogService: DialogService,
    public telegAPIservice: TelegramAPIService,
    private _userStrorageService: UserStorageService,
    private _changeDetection: ChangeDetectorRef,
    private _route: ActivatedRoute,
  ) {
    this.chatService.updateMessage.subscribe((data: { mess: Array<any>, users: Array<any>, init: boolean }) => {
      if (!data.init) {

        console.log(data);

        this._setUsers(data.users);
        
        //this._changeDetection.detectChanges();

        this._lastScrollTop = this.scrollChat.nativeElement.scrollTop;
        if (data.mess.length === 0) {
          this.isEnd = true;
          this.chatService.load = false;
        } else {
          this.isEnd = false;

          data.mess = data.mess.reverse();
          let firstDate = data.mess[0].date;
          let firstId = data.mess[0].from_id ? data.mess[0].from_id.user_id : data.mess[0].peer_id.user_id
          data.mess.forEach((m: any, index: number) => {
            let currentId = m.from_id ? m.from_id.user_id : m.peer_id.user_id
            if (index === 0) {
              m.first = true;
            } else if (((m.date - firstDate) < 300) && (firstId === currentId)) {
              m.first = false;
            } else {
              m.first = true;
              firstDate = m.date;
              firstId = currentId;
            }
          });
          data.mess = data.mess.reverse();


          console.log('push')
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
    this._querySubscription = this._route.queryParams.subscribe(
      (queryParam: any) => {
        switch(queryParam.source) {
          case 'telegram': {
            const DIALOG = this.dialogService.dialogList.find(dialog => dialog.search_id === queryParam.search_id);
            if (DIALOG) {
              this.telegAPIservice.getHistory(DIALOG.peer);
            }
          }
        }
          console.log(queryParam.source);
          //console.log(queryParam.chat_id);
      }
  );
  }

  private _setUsers(users: Array<any>): void {
    console.log(users);
    console.log(this.dialogService.userStorage);
    users.forEach((user: any, index: number) => {
      let a;
      if (user.bot) {

      } else {

        a = this._userStrorageService.findUser('telegram', 'user', user.id)
      }

      if (a === undefined) {
        let image;
        if (user.photo) {
          image = { user_id: user.id, access_hash: user.access_hash, _: 'inputPeerUser', local_id: user.photo.photo_small.local_id, volume_id: user.photo.photo_small.volume_id };
        }
        this._userStrorageService.addUser({
          title: user.first_name,
          source: 'telegram',
          image: image,
          id: user.id
        });
      }
    })
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
  }

  public getUser(m: any): { image: any, name: string } {
    let user;
    //console.log(m)
    switch (m.peer_id._) {
      case 'peerUser': {
        let id = m.from_id?.user_id ? m.from_id.user_id : m.peer_id.user_id;
        user = this._userStrorageService.findUser('telegram', 'user', id)
        break;
      }
      case 'peerChannel': {
        let id = m.from_id?.user_id ? m.from_id.user_id : m.peer_id.channel_id;
        user = this._userStrorageService.findUser('telegram', m.from_id?.user_id ? 'user': 'channel', id)
        break;
      }
      case 'peerChat': {
        let id = m.from_id?.user_id ? m.from_id.user_id : m.peer_id.channel_id;
        user = this._userStrorageService.findUser('telegram', m.from_id?.user_id ? 'user': 'channel', id)
        break;
      }
    }
    //console.log(user)
    return { image: user.image$, name: user.name }
  }

}


