
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, merge } from 'rxjs';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';
import { VkAPIService } from 'src/app/service/vk-api.service';

export interface Dialog {
    search_id: any;
    source: string;
    type: string;
    image: any,
    title: string;
    out: boolean;
    message: string;
    peer: {
        _: string,
        user_id?: number,
        chat_id?: number,
        channel_id?: number,
        access_hash?: string,
    },
    count: number,
    date: number,
    user?: any,
    isMigrated: boolean;
}

@Injectable({ providedIn: 'root' })
export class DialogService {

    public userStorage: Array<any> = [];

    public dialogList: Array<Dialog> = [];

    public users: Array<any> = [];

    public updateStatus = this.telegAPIservice.updateDialogStatus;
    public updateMessage = this.telegAPIservice.updateDialogMessage;
    public updateChanges = new BehaviorSubject(false);

    //private _sound: HTMLAudioElement;

    constructor(
        public telegAPIservice: TelegramAPIService,
        public vkAPIService: VkAPIService,
    ) {
        //this.getDialog();

    }

    public swapDialog(index: number): void {
        if (index !== 0) {
            let dialog = this.dialogList[index];
            this.dialogList.splice(index, 1)
            this.dialogList.unshift(dialog);
            this.updateChanges.next(true);
        }
    }

    public playSound(): void {
        let _sound = new Audio();
        _sound.src = "../../assets/sound.mp3";
        _sound.load();
        _sound.play().catch((reason: any) => {
            console.log(reason);
        });
    }

    // Получение полного списка диалогов
    public getDialog(): void {
        const m = forkJoin([this.vkAPIService.getConversations(), this.telegAPIservice.getConversations()]);
        m.subscribe(([result1, result2]) => {
            console.log(result2)
            this.users = this._formUserTeleg(result2.users);
            let dialogVk: Array<Dialog> = this._formDialogVk(result1);
            let dialogTeleg: Array<Dialog> = this._formDialogTeleg(result2);
            let dialogs: Array<Dialog> = dialogVk.concat(dialogTeleg);
            

            this.dialogList = dialogs.sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                }
                if (a.date > b.date) {
                    return -1;
                }
                return 0;
            })

            console.log(dialogs);
        });
    }

    private _formUserTeleg(result: any): Array<any> {
        let users: Array<any> = [];
        console.log(result);

        result.forEach((user: any) => {
            if (user.status) {
                users.push({
                    source: 'telegram',
                    type: 'user',
                    id: user.id,
                    online: user.status._ === 'userStatusOnline' ? true : false,
                })
            }
        });
        console.log(users);
        return users;
    }

    private _formDialogVk(result: any): Array<Dialog> {
        let dialogList: Array<Dialog> = [];
        //console.log(l)
        result.response.items.forEach((mess: any, index: number) => {
            console.log(mess);
            result.response.profiles.forEach((user: any) => {
                if (user.id === mess.conversation.peer.id) {
                    dialogList.push({
                        search_id: '',
                        source: 'vk',
                        type: 'user',
                        title: user.first_name + ' ' + user.last_name,
                        image: '',
                        //image: this.vkAPIService.getImage(dialogList, index, user.photo_50),
                        out: mess.last_message.out ? true : false,
                        message: mess.last_message.text,
                        count: mess.conversation.unread_count ? mess.conversation.unread_count : 0,
                        date: mess.last_message.date,
                        peer: mess.conversation.peer,
                        user: {
                            id: user.id,
                            online: user.online ? true : false,
                        },
                        isMigrated: false,
                    })
                }
            });

        });
        return dialogList;
    }

    private _formDialogTeleg(result: any): Array<any> {
        let dialogList: Array<Dialog> = [];
        result.messages.forEach((mess: any, index: number) => {
            //console.log(mess)
            switch (mess.peer_id._) {
                case 'peerUser': {
                    result.users.forEach((user: any) => {

                        if (user.id === mess.peer_id.user_id) {
                            //console.log(user)
                            dialogList.push({
                                search_id: user.id + '_' + user.access_hash,
                                source: 'telegram',
                                type: 'user',
                                title: user.first_name,
                                
                                image: user.photo ? {
                                    _: 'inputPeerUser',
                                    dc_id: user.photo.dc_id,
                                    user_id: mess.peer_id.user_id,
                                    access_hash: user.access_hash,
                                    local_id: user.photo.photo_small.local_id,
                                    volume_id: user.photo.photo_small.volume_id,
                                } : '',
                                
                                //image: user.photo ? this.telegAPIservice.getImage(dialogList, user.photo.dc_id, index, mess.peer_id.user_id, user.access_hash, 'inputPeerUser', user.photo.photo_small.local_id, user.photo.photo_small.volume_id) : '',
                                out: mess.out,
                                message: mess.message,
                                count: result.dialogs[index].unread_count,
                                date: mess.date,
                                peer: {
                                    _: 'inputPeerUser',
                                    user_id: mess.peer_id.user_id,
                                    access_hash: user.access_hash
                                },
                                user: {
                                    id: user.id,
                                    online: user.status?._ === 'userStatusOnline' ? true : false,
                                },
                                isMigrated: false,
                            });
                        }
                    });
                    break;
                }
                case 'peerChat': {
                    result.chats.forEach((chat: any) => {
                        if (chat.id === mess.peer_id.chat_id) {
                            dialogList.push({
                                search_id: chat.id,
                                source: 'telegram',
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
                                },
                                user: {
                                    id: chat.id,
                                },
                                isMigrated: chat.migrated_to ? true : false,
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
                                search_id: channel.id + '_' + channel.access_hash,
                                source: 'telegram',
                                type: 'channel',
                                title: channel.title,
                                image: channel.photo.photo_small  ? {
                                    _: 'inputPeerChannel',
                                    dc_id: channel.photo.dc_id,
                                    channel_id: mess.peer_id.channel_id,
                                    access_hash: channel.access_hash,
                                    local_id: channel.photo.photo_small.local_id,
                                    volume_id: channel.photo.photo_small.volume_id,
                                } : '',
                                //image: channel.photo.photo_small ? this.telegAPIservice.getImage(dialogList, channel.photo.dc_id, index, mess.peer_id.channel_id, channel.access_hash, 'inputPeerChannel', channel.photo.photo_small.local_id, channel.photo.photo_small.volume_id) : '',
                                out: mess.out,
                                message: mess.message,
                                count: result.dialogs[index].unread_count,
                                date: mess.date,
                                peer: {
                                    _: 'inputPeerChannel',
                                    channel_id: result.dialogs[index].peer.channel_id,
                                    access_hash: channel.access_hash
                                },
                                user: {
                                    id: channel.id,
                                },
                                isMigrated: false,
                            });
                        }
                    });
                    break;
                }
            }

        });
        return dialogList;
    }
}