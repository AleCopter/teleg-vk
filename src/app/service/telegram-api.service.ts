import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MTProto } from '@mtproto/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TelegramAPIService {
  private _mtProto: MTProto;

  private _API_ID: number = 2942669;
  private _API_HASH: string = '29ffc2827385ddfd656ce969adb48f5e';

  public dialogs: any;
  public dialogList: any;

  public messages: any;

  private _currentUser: any;

  public updateMessage = new BehaviorSubject(0);

  constructor(
    private sanitization: DomSanitizer,
  ) {
    console.log('teleg');
    this._mtProto = new MTProto({ api_hash: this._API_HASH, api_id: this._API_ID });
    //this.getUser();
  }

  public getUser(): any {
    return this._mtProto.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });
  }

  // Отправка кода для авторизации

  public sendCode(phoneNumber: string): any {
    return this._mtProto.call('auth.sendCode', {
      phone_number: phoneNumber, settings: {
        _: 'codeSettings',
      },
    })
  }

  public login(_phone_code: any, _phone_number: string, _phone_hash: string): any {
    return this._mtProto.call('auth.signIn', {
      phone_code: _phone_code,
      phone_number: _phone_number,
      phone_code_hash: _phone_hash,
    })
  }

  public logout(): any {
    return this._mtProto.call('auth.logOut', {
    })
  }


  public getConversations(): Promise<any> {
    return this._mtProto.call('messages.getDialogs', {
      offset: 0,
      max_id: 0,
      limit: 100,
      offset_peer: {
        _: 'inputPeerEmpty',
      }
    })
}

  public getContacts(): any {
    let dialogList: any = [];
    console.log(this._mtProto);
    this._mtProto.call('messages.getDialogs', {
      offset: 0,
      max_id: 0,
      limit: 100,
      offset_peer: {
        _: 'inputPeerEmpty',
      }
    }).then((result: any) => {

      this.dialogs = result;
      console.log(this.dialogs);

      result.messages.forEach((mess: any, index: number) => {
        console.log(mess)
        switch (mess.peer_id._) {
          case 'peerUser': {
            result.users.forEach((user: any) => {

              if (user.id === mess.peer_id.user_id) {
                console.log(user)
                dialogList.push({
                  type: 'user',
                  title: user.first_name,
                  image: user.photo ? this._getImage(dialogList, index, mess.peer_id.user_id, user.access_hash, user.photo.photo_small.local_id, user.photo.photo_small.volume_id) : '',
                  out: mess.out,
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
                  date: mess.date,
                  peer: {
                    _: 'inputPeerUser',
                    user_id: mess.peer_id.user_id,
                    access_hash: user.access_hash
                  }
                });
              }
            });
            break;
          }
          case 'peerChat': {
            result.chats.forEach((chat: any) => {
              if (chat.id === mess.peer_id.chat_id) {
                dialogList.push({
                  type: 'chat',
                  title: chat.title,
                  image: '',
                  out: mess.out,
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
                  date: mess.date,
                  peer: {
                    _: 'inputPeerChat',
                    chat_id: result.dialogs[index].peer.chat_id,
                  }
                });
              }
            });
            break;
          }
          //channel_id
          case 'peerChannel': {
            result.chats.forEach((channel: any) => {
              if (channel.id === mess.peer_id.channel_id) {
                dialogList.push({
                  type: 'channel',
                  title: channel.title,
                  image: '',
                  out: mess.out,
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
                  date: mess.date,
                  peer: {
                    _: 'inputPeerChannel',
                    channel_id: result.dialogs[index].peer.channel_id,
                    access_hash: channel.access_hash
                  }
                });
              }
            });
            break;
          }
        }

      });
      this.dialogList = dialogList;
      console.log(dialogList)
    });
  }

  public getHistory(_peer: any, _add_offset?: number): void {
    //console.log(_peer)
    this._mtProto.call('messages.getHistory', {
      limit: 20,
      add_offset: _add_offset ? _add_offset : 0,
      peer: _peer,
    }).then((result: any) => {
      //console.log(result)
      /*
      let newMess = [];
      result.messages.forEach((mess: any) => {
        newMess.push({
          text: mess,
          owner: 
        })
      });
      */
     console.log('ssss');
      this.updateMessage.next(result.messages);
    })
  }

  // message

  public sendMessage(_peer: any, _message: string): void {
    this._mtProto.call('messages.sendMessage', {
      peer: _peer,
      message: _message,
      random_id: Math.floor(Math.random() * 1000)
    }).then((result: any) => {
      console.log(result)
    })

  }

  public _getImage(dialogs: any, index: number, userID: number, accessHash: string, localID: number, volumeID: number) {
    const reader = new FileReader()

    this._mtProto.call('upload.getFile', {
      limit: 524288,
      location: {
        _: 'inputPeerPhotoFileLocation',
        peer: {
          _: 'inputPeerUser',
          user_id: userID,
          access_hash: accessHash
        },
        local_id: localID,
        volume_id: volumeID
      }

    }).then((result: any) => {
      console.log(result);

      reader.onload = (e: any) => {
        let objectURL = 'data:image/jpeg;base64,' + e.target.result;
        dialogs[index].image = this.sanitization.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(new Blob([result.bytes], { type: 'image/jpeg' }))

    }, err => { console.log(err) });

  }

}