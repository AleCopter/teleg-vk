import { Injectable } from '@angular/core';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Injectable({providedIn: 'root'})
export class ChatService {

    public messages: any = [];
    public users: any = []
    public load: boolean = false;
  

    public selectedDialog: any;
    public updateMessage = this._telegAPIservice.updateMessage;

    constructor(
        private _telegAPIservice: TelegramAPIService,
    ) { 
        
    }
    
    public selectDialog(dialog: any): void {
        console.log(dialog);

        if (dialog.source === 'telegram') {
            this.load = true;
            this.messages = [];
            this.users = [];
            this.selectedDialog = dialog;
            this._telegAPIservice.getHistory(dialog.peer);
        }
        //
    }
}