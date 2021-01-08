import { Injectable } from '@angular/core';
import { MTProto } from '@mtproto/core';

@Injectable({ providedIn: 'root' })
export class TelegramAPIService {
  private _mtProto: MTProto;

  private _API_ID: number = 2942669;
  private _API_HASH: string = '29ffc2827385ddfd656ce969adb48f5e';

  private _phone_hash = null;

  public dialogs: any;
  public dialogList: any;

  constructor() {
    this._mtProto = new MTProto({ api_hash: this._API_HASH, api_id: this._API_ID });
  }

  // Отправка кода для авторизации

  public sendCode(phoneNumber: string): void {
    this._mtProto.call('auth.sendCode', {
      phone_number: phoneNumber, settings: {
        _: 'codeSettings',
      },
    }).then((result: any) => {
      console.log(result);
      this._phone_hash = result.phone_code_hash;
    });
  }

  public authIn(phoneCode: any, phoneNumber: string): void {
    this._mtProto.call('auth.signIn', {
      phone_code: phoneCode,
      phone_number: phoneNumber,
      phone_code_hash: this._phone_hash,
    }).then((result: any) => {
      console.log(result);
    });
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
                dialogList.push({
                  type: 'user',
                  title: user.first_name,
                  image: '',
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
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
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
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
                  message: mess.message,
                  count: result.dialogs[index].unread_count,
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
    const reader = new FileReader()

    /*
    this._mtProto.call('upload.getFile', {
      limit: 524288,
      location: {
        _: 'inputPeerPhotoFileLocation',
        peer: {
          _: 'inputPeerUser',
          user_id: 116002469,
          access_hash: "4655148954168406044"
        },
        local_id: 26635,
        volume_id: "200041200708"
      }
 
    }).then((result: any) => {
      console.log(result);
      
      reader.onload = (e: any) => {  let objectURL = 'data:image/jpeg;base64,' + e.target.result;
      this.image = this.sanitization.bypassSecurityTrustUrl(e.target.result);};
      reader.readAsDataURL(new Blob([result.bytes], {type : 'image/jpeg'}))
      
    });
    */
  }

}