
import { Injectable } from '@angular/core';
import { forkJoin, merge } from 'rxjs';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';
import { VkAPIService } from 'src/app/service/vk-api.service';

export interface Dialog {
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
}

@Injectable({ providedIn: 'root' })
export class DialogService {

    public dialogList: Array<Dialog> = [];
    constructor(
        public telegAPIservice: TelegramAPIService,
        public vkAPIService: VkAPIService,
    ) {
        this.getDialog();
    }


    public getDialog(): void {
        const m = forkJoin([this.vkAPIService.getConversations(), this.telegAPIservice.getConversations()]);
        m.subscribe(([result1, result2]) => {
            let dialogVk: Array<Dialog> = this._formDialogVk(result1);
            let dialogTeleg: Array<Dialog> = this._formDialogTeleg(result2);
            let dialogs: Array<Dialog> = dialogVk.concat(dialogTeleg);
            console.log(result1)
            console.log(result2)
            this.dialogList = dialogs.sort((a, b) => { 
                if (a.date < b.date) {
                    return 1;
                }
                if (a.date > b.date) {
                    return -1;
                }
                return 0;
            })

        });
    }

    private _formDialogVk(result: any): Array<Dialog> {
        let dialogList: Array<Dialog> = [];
        result.response.items.forEach((mess: any, index: number) => {
            console.log(mess);
            result.response.profiles.forEach((user: any) => {
                if (user.id === mess.conversation.peer.id) {
                    dialogList.push({
                        source: 'vk',
                        type: 'user',
                        title: user.first_name + ' ' + user.last_name,
                        image: this.vkAPIService.getImage(dialogList, index, user.photo_50),
                        out: mess.last_message.out ? true : false,
                        message: mess.last_message.text,
                        count: 0,
                        date: mess.last_message.date,
                        peer: mess.conversation.peer,
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
                                source: 'telegram',
                                type: 'user',
                                title: user.first_name,
                                image: user.photo ? this.telegAPIservice._getImage(dialogList, index, mess.peer_id.user_id, user.access_hash, user.photo.photo_small.local_id, user.photo.photo_small.volume_id) : '',
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
                                source: 'telegram',
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
        return dialogList;
    }
}