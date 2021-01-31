import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-dialog-panel',
  templateUrl: './dialog-panel.component.html',
  styleUrls: ['./dialog-panel.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '550px'
      })),
      state('close', style({
        width: '80px'
      })),
      transition('* => open', animate('0.3s')),
      transition('open => *', animate('0.3s')),

    ])
  ]
})
export class DialogPanelComponent implements OnInit {

  public isHidden: boolean = false;


  constructor(
    public dialogService: DialogService,
    private _chatService: ChatService,
    private _changeDetection: ChangeDetectorRef,
  ) {
    this.dialogService.updateChanges.subscribe(
      (data: boolean) => {
        if (data) {
          this._changeDetection.detectChanges();
        }
      }
    )
  }

  ngOnInit(): void {
    this.dialogService.getDialog();
  }

  public selectDialog(dialog: any): void {
    console.log(dialog);
    this._chatService.selectDialog(dialog);
  }

  public test(): void {
    this.dialogService.updateStatus.next({id: 392603054, source: "telegram", online: true});
  }

  public swapDialog(index: number): void {
    console.log(index)
    //
  } 

  public openClose() {
    this.isHidden = !this.isHidden;
  }
}
