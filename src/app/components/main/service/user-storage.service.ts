import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

interface UserStorage {
  id: number,
  image$: BehaviorSubject<any>,
  type: string,
  source: string,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  private _userStorage: UserStorage[] = [];

  constructor(
    private _telegramService: TelegramAPIService,
  ) {

  }

  public findUser(source: string, type: string, id: number ): any {
    //console.log(this._userStorage)
    //console.log(source + ' ' + type + ' ' + id)
    return this._userStorage.find(user => user.id === id && user.source === source && user.type === type);
  }

  public addUser(dialog: any): any {
    let index = this._userStorage.push({
      id: -1,
      image$: new BehaviorSubject(null),
      type: '',
      source: dialog.source,
      name: dialog.title,
    })
    if (dialog.image) {
      this._loadImage(dialog, this._userStorage[index - 1]);
    } else {
      this._userStorage[index - 1].id = dialog.id;
      this._userStorage[index - 1].type = 'user';
    }
    return this._userStorage[index - 1];
  }

  private _loadImage(dialog: any, user: UserStorage) {
    if (dialog.source === 'telegram') {
      switch (dialog.image._) {
        case 'inputPeerUser': {
          user.id = dialog.image.user_id;
          user.type = 'user';
          this._telegramService.getUserProfileIcon(dialog.image.dc_id, dialog.image.user_id, dialog.image.access_hash, dialog.image._, dialog.image.local_id, dialog.image.volume_id).subscribe(
            data => {
              user.image$.next(data);
            }
          );
          break;
        }
        case 'inputPeerChannel': {
          user.id = dialog.image.channel_id;
          user.type = 'channel';
          this._telegramService.getUserProfileIcon(dialog.image.dc_id, dialog.image.channel_id, dialog.image.access_hash, dialog.image._, dialog.image.local_id, dialog.image.volume_id).subscribe(
            data => {
              user.image$.next(data);
            }
          );
          break;
        }
      }
    }
  }
}