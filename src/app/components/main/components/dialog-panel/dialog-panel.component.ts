import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-dialog-panel',
  templateUrl: './dialog-panel.component.html',
  styleUrls: ['./dialog-panel.component.scss']
})
export class DialogPanelComponent implements OnInit {

  public isHidden: boolean = false;

  constructor(
    public dialogService: DialogService,
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
  }

  public selectDialog(d: any): void {
  }

  public test(): void {
    this.dialogService.updateStatus.next({id: 392603054, source: "telegram", online: true});
  }

  public swapDialog(index: number): void {
    console.log(index)
    //
  } 
}
