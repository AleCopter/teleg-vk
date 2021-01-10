
import { Injectable } from '@angular/core';
import { forkJoin, merge } from 'rxjs';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';
import { VkAPIService } from 'src/app/service/vk-api.service';

@Injectable({ providedIn: 'root' })
export class DialogService {

    public dialogList: any = [
        {
            type: "channel",
            title: "СТАС БОМБИТ",
            image: "", out: false,
            message: "И мораль сей басни такова - каким бы ты охуевшим и…М. ↵↵↵ЧМОКИ↵↵P.S. опять прибухнул, не обессудьте.",
            peer: {
                _: "inputPeerChannel",
                channel_id: 1046511458,
                access_hash: "10344513225496364641",
            },
            count: 1,
            date: 1610239047,
        }
    ];
    constructor(
        public telegAPIservice: TelegramAPIService,
        public vkAPIService: VkAPIService,
    ) { 
        this.getDialog();
    }


    public getDialog(): void {
        const m = forkJoin([this.vkAPIService.getConversations(), this.telegAPIservice.getConversations()]);
        m.subscribe(([result1,result2]) => { 
            console.log(result1)
            console.log(result2)
            });
    }
}