import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
        private _router: Router,
    ) { 
        
    }
    
    public selectDialog(dialog: any): void {
        console.log(dialog);

        if (dialog.source === 'telegram') {
            this.load = true;
            this.messages = [];
            this.users = [];
            this.selectedDialog = dialog;
            console.log(dialog)
            this._router.navigate([], { queryParams: { source: dialog.source, search_id: dialog.search_id} })
            //this._telegAPIservice.getHistory(dialog.peer);
        }
        //
    }
}