import { Injectable } from '@angular/core';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Injectable({providedIn: 'root'})
export class ChatService {

    public messages: any = [
    ]
  

    public selectedDialog: any;
    public updateMessage = this._telegAPIservice.updateMessage;

    constructor(
        private _telegAPIservice: TelegramAPIService,
    ) { 
        
    }
    

    public selectDialog(dialog: any): void {
        console.log(dialog);
        this.messages = [];
        if (dialog.source === 'telegram') {
            this.selectedDialog = dialog;
            this._telegAPIservice.getHistory(dialog.peer);
        }
        //
    }
}