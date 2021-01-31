import { Injectable, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MTProto } from '@mtproto/core';
import { promise } from 'protractor';
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

  public updateMessage = new BehaviorSubject({ mess: [], users: [], init: true });
  public updateDialogStatus = new BehaviorSubject({ id: 0, source: 'none', online: false });
  public updateDialogMessage = new BehaviorSubject({ id: 0, source: 'none', message: '', date: 0 })


  private _typeFileDow: any = {
    m: 'm',
    mp4: 'video/mp4',
    mp3: 'audio/mp3'
  }

  private _typeFileBlob: any = {
    m: 'image/jpeg',
    mp4: 'video/mp4'
  }

  constructor(
    private sanitization: DomSanitizer,
  ) {
    console.log('teleg');
    this._mtProto = new MTProto({ api_hash: this._API_HASH, api_id: this._API_ID });

    this._mtProto.updates.on('updateShort', (message: any) => {
      const { update } = message;

      if (update._ === 'updateUserStatus') {
        const { user_id, status } = update;

        console.log(`User with id ${user_id} change status to ${status}`);
        console.log(status)

        switch (status._) {
          case 'userStatusOnline': {
            this.updateDialogStatus.next({ id: user_id, source: "telegram", online: true })
            break;
          }
          default: {
            this.updateDialogStatus.next({ id: user_id, source: "telegram", online: false })
            break;
          }
        }
      }
    });


    this._mtProto.updates.on('updateShortChatMessage', (data: any) => {
      console.log(data)
      this.updateDialogMessage.next({ id: data.chat_id, source: "telegram", message: data.message, date: data.date });
    });



    this._mtProto.updates.on('updateShortMessage', (data: any) => {
      this.updateDialogMessage.next({ id: data.user_id, source: "telegram", message: data.message, date: data.date });
    });

    this._mtProto.updates.on('updates', (data: any) => {
      console.log(data)
      data.updates.forEach((up: any) => {
        switch (up._) {
          case 'updateNewMessage': {
            this.updateDialogMessage.next({ id: up.message.peer_id.user_id, source: "telegram", message: up.message.message, date: up.message.date })
            break;
          }
          case 'updateNewChannelMessage': {
            this.updateDialogMessage.next({ id: up.message.peer_id.channel_id, source: "telegram", message: up.message.message, date: up.message.date });
            break;
          }
        }
      });
    });

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
                  image: user.photo ? this.getImage(dialogList, user.photo.dc_id, index, mess.peer_id.user_id, user.access_hash, '', user.photo.photo_small.local_id, user.photo.photo_small.volume_id) : '',
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
    console.log('getHistory')
    this._mtProto.call('messages.getHistory', {
      limit: 20,
      add_offset: _add_offset ? _add_offset : 0,
      peer: _peer,
    }).then((result: any) => {
      console.log(result)
      console.log('ssss');

      result.messages.forEach((element: any, index: number) => {
        if (element.media) {
          if (element.media.photo) {
            this.getMediaPhoto(result.messages, index, 'photo', element.media.photo.id, element.media.photo.access_hash, element.media.photo.file_reference, element.media.photo.sizes[1])
          }
        }
      });

      result.messages.forEach((element: any, index: number) => {
        if (element.media) {
          if (element.media.document) {
            //console.log(element.media.document);
            switch (element.media.document.mime_type) {
              case 'video/mp4':
                this.getMediaDocument(result.messages, element.media.document.dc_id, index, 'preview', element.media.document.id, 'm', element.media.document.access_hash, element.media.document.file_reference, element.media.document.thumbs[1])
                break;
              case 'audio/ogg':
                break;
            }
          }
        }
      });

      this.updateMessage.next({ mess: result.messages, users: result.users, init: false });
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

  public getPreview(array: any, index: number, bytes: any) {
    console.log(bytes);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      array[index].preview = this.sanitization.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(new Blob([bytes]))
  }

  public getMediaVideo(id: number, dcId: number, thumbType: string, accessHash: string, fileReference: any, offset: number): Promise<Object> {
    return this._mtProto.call('upload.getFile', {
      //precise: true,
      limit: 1048576,
      offset: offset ? offset : 0,
      location: {
        _: 'inputDocumentFileLocation',
        id: id,
        access_hash: accessHash,
        file_reference: fileReference,
        thumb_size: this._typeFileDow[thumbType],
      },
    },
      {
        dcId: dcId,
      })
  }

  public getMediaDocument(array: any, dcId: number, index: number, name: string, id: number, thumbType: string, accessHash: string, fileReference: any, thumbSize: string, bytes?: any, offset?: number): void {
    this._mtProto.call('upload.getFile', {
      limit: 524288,
      offset: offset ? offset : 0,
      location: {
        _: 'inputDocumentFileLocation',
        id: id,
        access_hash: accessHash,
        file_reference: fileReference,
        thumb_size: this._typeFileDow[thumbType],
      },
    },
      {
        dcId: dcId,
      }).then((result: any) => {
        console.log(result)
        if (result.bytes.length === 524288) {
          console.log(bytes)
          var c;
          if (bytes) {
            c = new Int8Array(bytes.length + result.bytes.length);
            c.set(bytes);
            c.set(result.bytes, bytes.length);
          } else {
            c = result.bytes;
          }
          let o = offset ? offset + 524288 : 524288;
          this.getMediaDocument(array, dcId, index, name, id, thumbType, accessHash, fileReference, thumbSize, c, o)
        }

        var c;
        if (bytes) {
          c = new Int8Array(bytes.length + result.bytes.length);
          c.set(bytes);
          c.set(result.bytes, bytes.length);
          console.log(c)
        } else {
          c = result.bytes;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          let objectURL = 'data:image/jpeg;base64,' + e.target.result;
          array[index][name] = this.sanitization.bypassSecurityTrustUrl(e.target.result);
        };
        reader.readAsDataURL(new Blob([c], { type: this._typeFileBlob[thumbType] }),)
      }).catch(res => {
        console.log(res)
      })
  }

  public getMediaPhoto(array: any, index: number, name: string, id: number, accessHash: string, fileReference: any, thumbSize: string): void {
    console.log(id);
    console.log(accessHash);
    console.log(fileReference);

    const reader = new FileReader();
    this._mtProto.call('upload.getFile', {
      limit: 524288,
      location: {
        _: 'inputPhotoFileLocation',
        id: id,
        access_hash: accessHash,
        file_reference: fileReference,
        thumb_size: 'm',
      }
    }).then((result: any) => {
      console.log(result.bytes);
      reader.onload = (e: any) => {
        let objectURL = 'data:image/jpeg;base64,' + e.target.result;
        array[index][name] = this.sanitization.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(new Blob([result.bytes], { type: 'image/jpeg' }))
    }).catch(res => {
      console.log(res)
    })
  }

  public getUserProfileIcon(dcId: number, userID: number, accessHash: string, typePeer: string, localID: number, volumeID: number): Observable<any>{
    const subj = new Subject();
    /*
    console.log(userID)
    */
    this._mtProto.call('upload.getFile', {
      limit: 524288,
      location: {
        _: 'inputPeerPhotoFileLocation',
        peer: {
          _: typePeer,
          user_id: userID,
          channel_id: userID,
          access_hash: accessHash
        },
        local_id: localID,
        volume_id: volumeID
      }
    },
      {
        dcId: dcId,
      }).then((result: any) => {
        const READER = new FileReader()
        READER.onload = (e: any) => {
          subj.next(this.sanitization.bypassSecurityTrustUrl(e.target.result));
          subj.complete();
        };
        READER.readAsDataURL(new Blob([result.bytes], { type: 'image/jpeg' }))

      }, err => {
        console.log(err);
        subj.next(null);
        subj.complete();
     
      });

      return subj;
  }

  public getImage(array: any, dcId: number, index: number, userID: number, accessHash: string, typePeer: string, localID: number, volumeID: number) {
    const reader = new FileReader()


    this._mtProto.call('upload.getFile', {
      limit: 524288,
      location: {
        _: 'inputPeerPhotoFileLocation',
        peer: {
          _: typePeer,
          user_id: userID,
          channel_id: userID,
          access_hash: accessHash
        },
        local_id: localID,
        volume_id: volumeID
      }
    },
      {
        dcId: dcId,
      }).then((result: any) => {
        console.log(result);

        reader.onload = (e: any) => {
          let objectURL = 'data:image/jpeg;base64,' + e.target.result;
          array[index].image = this.sanitization.bypassSecurityTrustUrl(e.target.result);
        };
        reader.readAsDataURL(new Blob([result.bytes], { type: 'image/jpeg' }))

      }, err => {

        console.log(err);
        console.log(userID)
      });

  }

}

enum Obe {
  mp4 = 'video/mp4',
  m = 'm'
}

enum TypeFileBlob {
  m = 'image/jpeg',
  mp4 = 'video/mp4'
}